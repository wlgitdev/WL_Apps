import { DatabaseError, NotFoundError } from "../../errors/error";
import {
  ApiBatchResponse,
  ApiResponse,
  BatchSummary,
  BatchOperationResult,
  BatchUpdate,
  SpotifyCallbackData,
  SpotifyTokenResponse,
} from "@wl-apps/types";

import {
  TRACK_STATES_STATUS,
  UserPlaylist,
  TrackStatesExtended,
} from "@wl-apps/types";

import crypto from "crypto";
import { SessionService } from "../session.service";
import { SpotifyTokensService } from "./spotifyTokens.service";
import { API_PREFIX, BASE_URLS, SERVER_API_ROUTES } from "@wl-apps/utils";
import { TrackStatesService } from "./trackStates.service";
import SpotifyWebApi from "spotify-web-api-node";
import {
  TrackStatesDocument,
  TrackStatesModel,
} from "../../models/Sortify/TrackStates";
import mongoose from "mongoose";

export class SpotifyService {
  private spotifyRedirectUri: string;

  constructor(
    private sessionService: SessionService,
    private spotifyTokensService: SpotifyTokensService
  ) {
    this.spotifyRedirectUri =
      BASE_URLS.server 
      + '/' + API_PREFIX 
      + '/' + SERVER_API_ROUTES.sortify.spotify.callback;
  }

  private generateState(): string {
    return crypto.randomBytes(16).toString("hex");
  }

  private generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString("base64url");
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(verifier)
    );
    return Buffer.from(hash).toString("base64url");
  }

  private async refreshTokens(userId: string): Promise<void> {
    try {
      const tokensResponse = await this.spotifyTokensService.getSpotifyTokens({
        userId,
      });
      if (
        !tokensResponse.success ||
        !tokensResponse.data.length ||
        !tokensResponse.data[0]?.recordId
      ) {
        throw new NotFoundError("Spotify tokens not found for user");
      }

      const tokens = tokensResponse.data[0];
      const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        refreshToken: tokens.encryptedRefreshToken,
      });

      const refreshData = await spotifyApi.refreshAccessToken();

      if (!tokens.recordId) {
        throw new Error("Token record id required.");
      }

      await this.spotifyTokensService.updateSpotifyTokens(tokens.recordId, {
        encryptedAccessToken: refreshData.body.access_token,
        encryptedRefreshToken: tokens.encryptedRefreshToken,
      });
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to refresh tokens"
      );
    }
  }

  private async executeWithTokenRefresh<T>(
    userId: string,
    action: (api: SpotifyWebApi) => Promise<T>
  ): Promise<T> {
    try {
      const spotifyApi = await this.newSpotifyApiInstance(userId);
      return await action(spotifyApi);
    } catch (error) {
      if (error instanceof Error && error.message.includes("token expired")) {
        await this.refreshTokens(userId);
        const spotifyApi = await this.newSpotifyApiInstance(userId);
        return await action(spotifyApi);
      }
      throw error;
    }
  }

  private async newSpotifyApiInstance(userId: string) {
    try {
      const tokensResponse = await this.spotifyTokensService.getSpotifyTokens({
        userId,
      });
      if (!tokensResponse.success || !tokensResponse.data.length) {
        throw new NotFoundError("Spotify tokens not found for user");
      }

      const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        accessToken: tokensResponse.data[0]!.encryptedAccessToken,
      });

      return spotifyApi;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error
          ? error.message
          : "Failed to fetch spotify api instance"
      );
    }
  }

  async getSpotifyAuthUrl(recordId: string): Promise<ApiResponse<string>> {
    try {
      const state = this.generateState();
      const codeVerifier = this.generateCodeVerifier();
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);

      // Store state and verifier in session
      await this.sessionService.set(`spotify:${state}`, {
        recordId,
        codeVerifier,
        timestamp: Date.now(),
      });

      const result =
        process.env.SPOTIFY_CLIENT_ID &&
        this.spotifyRedirectUri &&
        codeChallenge &&
        state;

      if (!result) {
        throw new Error("Spotify connection details incorrect");
      }

      const params = new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        response_type: "code",
        redirect_uri: this.spotifyRedirectUri!,
        state,
        scope:
          "user-library-read user-library-modify playlist-modify-public playlist-modify-private",
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      });

      return {
        success: true,
        data: `https://accounts.spotify.com/authorize?${params.toString()}`,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to get auth url"
      );
    }
  }

  async syncLikedSongs(recordId: string): Promise<ApiResponse<boolean>> {
    try {
      return await this.executeWithTokenRefresh(
        recordId,
        async (spotifyApi) => {
          // Get existing track states for user
          const trackStatesService = new TrackStatesService();
          const existingTracksResponse =
            await trackStatesService.getTrackStates({
              userId: recordId,
            });
          const existingTracks = existingTracksResponse.success
            ? existingTracksResponse.data
            : [];

          // Get all liked songs from Spotify
          const likedSongs = new Map<
            string,
            { name: string; artists: string[] }
          >();
          let offset = 0;
          const limit = 50;

          while (true) {
            const response = await spotifyApi.getMySavedTracks({
              limit,
              offset,
            });
            if (!response.body.items.length) break;

            for (const item of response.body.items) {
              const track = item.track;
              likedSongs.set(track.id, {
                name: track.name,
                artists: track.artists.map((artist) => artist.name),
              });
            }

            if (response.body.items.length < limit) break;
            offset += limit;
          }

          // Delete tracks that no longer exist in Spotify
          for (const track of existingTracks) {
            if (!likedSongs.has(track.trackId)) {
              await trackStatesService.deleteTrackStates(track.recordId || "");
            }
          }

          // Create or update tracks from Spotify
          for (const [trackId, trackInfo] of likedSongs) {
            const existingTrack = existingTracks.find(
              (t) => t.trackId === trackId
            );
            const trackName = `${trackInfo.name} - ${trackInfo.artists.join(
              ", "
            )}`;

            if (!existingTrack) {
              // Create new track state
              await trackStatesService.createTrackStates({
                userId: recordId,
                trackId,
                name: trackName,
                status: "null",
                targetPlaylists: [],
              });
            } else if (existingTrack.name !== trackName) {
              // Update track name if changed
              await trackStatesService.updateTrackStates(
                existingTrack.recordId || "",
                {
                  name: trackName,
                }
              );
            }
          }
          return {
            success: true,
            data: true,
          };
        }
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to sync liked songs"
      );
    }
  }

  async syncChangesToSpotify(
    userId: string,
    updates: BatchUpdate<TrackStatesDocument>[]
  ): Promise<ApiResponse<ApiBatchResponse<TrackStatesDocument>>> {
    try {
      return await this.executeWithTokenRefresh(userId, async (spotifyApi) => {
        const results: BatchOperationResult<TrackStatesDocument>[] = [];

        // Process each track state update
        for (let i = 0; i < updates.length; i++) {
          const update = updates[i];
          try {
            const trackState = await TrackStatesModel.findOne({
              _id: new mongoose.Types.ObjectId(update?.data.recordId),
              userId: new mongoose.Types.ObjectId(userId),
            });
            if (!trackState) {
              results.push({
                success: false,
                error: `Track state (${
                  update!.recordId
                }) not found for user (${userId})`,
                index: i,
              });
              continue;
            }

            // Handle target playlists
            if (trackState.targetPlaylists?.length > 0) {
              for (const playlistId of trackState.targetPlaylists) {
                try {
                  await spotifyApi.addTracksToPlaylist(playlistId, [
                    trackState.trackId,
                  ]);
                  // Remove playlist from target playlists after successful addition
                  trackState.targetPlaylists =
                    trackState.targetPlaylists.filter(
                      (id) => id !== playlistId
                    );
                  await trackState.save();
                } catch (error) {
                  if (error instanceof Error) {
                    throw new DatabaseError(
                      `Failed to add track to playlist ${playlistId}: ${error.message}`
                    );
                  } else {
                    throw new DatabaseError(
                      `Failed to add track to playlist ${playlistId}: ${JSON.stringify(
                        error
                      )}`
                    );
                  }
                }
              }
            }

            // Handle track removal
            if (trackState.status === TRACK_STATES_STATUS.TO_REMOVE) {
              await spotifyApi.removeFromMySavedTracks([trackState.trackId]);
            }

            results.push({
              success: true,
              data: trackState,
              index: i,
            });
          } catch (error) {
            results.push({
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to process track state",
              index: i,
            });
          }
        }

        // Calculate summary
        const summary: BatchSummary = {
          total: updates.length,
          successful: results.filter((r) => r.success).length,
          failed: results.filter((r) => !r.success).length,
          completeSuccess: results.every((r) => r.success),
        };

        return {
          success: summary.completeSuccess,
          data: {
            results,
            summary,
          },
        };
      });
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error
          ? error.message
          : "Failed to sync changes to Spotify"
      );
    }
  }

  async handleCallback(
    data: Partial<SpotifyCallbackData>
  ): Promise<ApiResponse<boolean>> {
    try {
      if (!data.code || !data.state) {
        throw new Error("Missing code or state from Spotify callback");
      }

      // Get session data using state
      const sessionData = await this.sessionService.get(
        `spotify:${data.state}`
      );
      if (!sessionData?.codeVerifier || !sessionData?.recordId) {
        throw new Error("Invalid or expired state");
      }

      // Exchange code for tokens
      const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: process.env.SPOTIFY_CLIENT_ID!,
            grant_type: "authorization_code",
            code: data.code,
            redirect_uri: this.spotifyRedirectUri!,
            code_verifier: sessionData.codeVerifier,
          }),
        }
      );

      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange code for tokens");
      }

      const tokens: SpotifyTokenResponse =
        (await tokenResponse.json()) as SpotifyTokenResponse;

      // Save encrypted tokens
      await this.spotifyTokensService.createOrUpdateSpotifyTokens({
        userId: sessionData.recordId,
        encryptedAccessToken: tokens.access_token,
        encryptedRefreshToken: tokens.refresh_token,
      });

      // Clean up session
      await this.sessionService.delete(`spotify:${data.state}`);

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error
          ? error.message
          : "Failed to handle Spotify callback"
      );
    }
  }

  async getUserPlaylists(userId: string): Promise<ApiResponse<UserPlaylist[]>> {
    try {
      return await this.executeWithTokenRefresh(userId, async (spotifyApi) => {
        const playlists: UserPlaylist[] = [];
        let offset = 0;
        const limit = 50;

        while (true) {
          const response = await spotifyApi.getUserPlaylists({ limit, offset });
          if (!response.body.items.length) break;

          playlists.push(...response.body.items);

          if (response.body.items.length < limit) break;
          offset += limit;
        }

        return {
          success: true,
          data: playlists,
        };
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error
          ? error.message
          : "Failed to fetch user playlists"
      );
    }
  }

  async getTrackStatesExtended(
    userId: string
  ): Promise<ApiResponse<TrackStatesExtended[]>> {
    try {
      return await this.executeWithTokenRefresh(userId, async (spotifyApi) => {
        const trackStatesService = new TrackStatesService();

        // Get base track states
        const trackStatesResponse = await trackStatesService.getTrackStates({
          userId,
        });
        if (!trackStatesResponse.success) {
          throw new Error("Failed to fetch track states");
        }

        // Fetch Spotify data for all tracks in batches of 50
        const records: TrackStatesExtended[] = [];
        const trackStates = trackStatesResponse.data;

        // First get liked songs to determine date_added
        const likedTracks = new Map();
        let offset = 0;
        const limit = 50;

        while (true) {
          const savedTracks = await spotifyApi.getMySavedTracks({
            limit,
            offset,
          });
          if (!savedTracks.body.items.length) break;

          for (const item of savedTracks.body.items) {
            likedTracks.set(item.track.id, {
              date_added: new Date(item.added_at),
            });
          }

          if (savedTracks.body.items.length < limit) break;
          offset += limit;
        }

        // Get artist information to extract genres
        const artistIds = new Set<string>();

        for (let i = 0; i < trackStates.length; i += 50) {
          const batch = trackStates.slice(i, i + 50);
          const trackIds = batch.map((track) => track.trackId);
          const spotifyTracks = await spotifyApi.getTracks(trackIds);

          // Collect all artist IDs
          spotifyTracks.body.tracks.forEach((track) => {
            if (track) {
              track.artists.forEach((artist) => {
                artistIds.add(artist.id);
              });
            }
          });

          batch.forEach((track, index) => {
            const spotifyTrack = spotifyTracks.body.tracks[index];
            if (spotifyTrack) {
              records.push({
                ...track,
                ...spotifyTrack,
                external_url_spotify:
                  spotifyTrack.external_urls["spotify"] || "",
                artist_names: spotifyTrack.artists.map((item) => item.name),
                date_added:
                  likedTracks.get(spotifyTrack.id)?.date_added || new Date(),
                genres: [], // Will be populated after getting artist genres
              });
            }
          });
        }

        // Fetch artist details in batches to get genres
        const artistGenres = new Map<string, string[]>();
        const artistIdsArray = Array.from(artistIds);

        for (let i = 0; i < artistIdsArray.length; i += 50) {
          const artistBatch = artistIdsArray.slice(i, i + 50);
          const artistsResponse = await spotifyApi.getArtists(artistBatch);

          artistsResponse.body.artists.forEach((artist) => {
            if (artist) {
              artistGenres.set(artist.id, artist.genres);
            }
          });
        }

        // Update records with genre information
        records.forEach((record) => {
          const allGenres = new Set<string>();
          if (record.artists) {
            record.artists.forEach((artist) => {
              const genres = artistGenres.get(artist.id);
              if (genres) {
                genres.forEach((genre) => allGenres.add(genre));
              }
            });
          }
          record.genres = Array.from(allGenres);
        });

        return {
          success: true,
          data: records,
        };
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error
          ? error.message
          : "Failed to fetch user track states"
      );
    }
  }
}
