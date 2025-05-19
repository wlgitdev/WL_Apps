"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyService = void 0;
const error_1 = require("../../errors/error");
const types_1 = require("@wl-apps/types");
const crypto_1 = __importDefault(require("crypto"));
const utils_1 = require("@wl-apps/utils");
const trackStates_service_1 = require("./trackStates.service");
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const TrackStates_1 = require("../../models/Sortify/TrackStates");
const mongoose_1 = __importDefault(require("mongoose"));
class SpotifyService {
    constructor(sessionService, spotifyTokensService) {
        this.sessionService = sessionService;
        this.spotifyTokensService = spotifyTokensService;
        this.spotifyRedirectUri =
            utils_1.BASE_URLS.server
                + '/' + utils_1.API_PREFIX
                + '/' + utils_1.SERVER_API_ROUTES.sortify.spotify.callback;
    }
    generateState() {
        return crypto_1.default.randomBytes(16).toString("hex");
    }
    generateCodeVerifier() {
        return crypto_1.default.randomBytes(32).toString("base64url");
    }
    async generateCodeChallenge(verifier) {
        const hash = await crypto_1.default.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
        return Buffer.from(hash).toString("base64url");
    }
    async refreshTokens(userId) {
        try {
            const tokensResponse = await this.spotifyTokensService.getSpotifyTokens({
                userId,
            });
            if (!tokensResponse.success ||
                !tokensResponse.data.length ||
                !tokensResponse.data[0]?.recordId) {
                throw new error_1.NotFoundError("Spotify tokens not found for user");
            }
            const tokens = tokensResponse.data[0];
            const spotifyApi = new spotify_web_api_node_1.default({
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
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error ? error.message : "Failed to refresh tokens");
        }
    }
    async executeWithTokenRefresh(userId, action) {
        try {
            const spotifyApi = await this.newSpotifyApiInstance(userId);
            return await action(spotifyApi);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes("token expired")) {
                await this.refreshTokens(userId);
                const spotifyApi = await this.newSpotifyApiInstance(userId);
                return await action(spotifyApi);
            }
            throw error;
        }
    }
    async newSpotifyApiInstance(userId) {
        try {
            const tokensResponse = await this.spotifyTokensService.getSpotifyTokens({
                userId,
            });
            if (!tokensResponse.success || !tokensResponse.data.length) {
                throw new error_1.NotFoundError("Spotify tokens not found for user");
            }
            const spotifyApi = new spotify_web_api_node_1.default({
                clientId: process.env.SPOTIFY_CLIENT_ID,
                accessToken: tokensResponse.data[0].encryptedAccessToken,
            });
            return spotifyApi;
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            throw new error_1.DatabaseError(error instanceof Error
                ? error.message
                : "Failed to fetch spotify api instance");
        }
    }
    async getSpotifyAuthUrl(recordId) {
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
            const result = process.env.SPOTIFY_CLIENT_ID &&
                this.spotifyRedirectUri &&
                codeChallenge &&
                state;
            if (!result) {
                throw new Error("Spotify connection details incorrect");
            }
            const params = new URLSearchParams({
                client_id: process.env.SPOTIFY_CLIENT_ID,
                response_type: "code",
                redirect_uri: this.spotifyRedirectUri,
                state,
                scope: "user-library-read user-library-modify playlist-modify-public playlist-modify-private",
                code_challenge_method: "S256",
                code_challenge: codeChallenge,
            });
            return {
                success: true,
                data: `https://accounts.spotify.com/authorize?${params.toString()}`,
            };
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : "Failed to get auth url");
        }
    }
    async syncLikedSongs(recordId) {
        try {
            return await this.executeWithTokenRefresh(recordId, async (spotifyApi) => {
                // Get existing track states for user
                const trackStatesService = new trackStates_service_1.TrackStatesService();
                const existingTracksResponse = await trackStatesService.getTrackStates({
                    userId: recordId,
                });
                const existingTracks = existingTracksResponse.success
                    ? existingTracksResponse.data
                    : [];
                // Get all liked songs from Spotify
                const likedSongs = new Map();
                let offset = 0;
                const limit = 50;
                while (true) {
                    const response = await spotifyApi.getMySavedTracks({
                        limit,
                        offset,
                    });
                    if (!response.body.items.length)
                        break;
                    for (const item of response.body.items) {
                        const track = item.track;
                        likedSongs.set(track.id, {
                            name: track.name,
                            artists: track.artists.map((artist) => artist.name),
                        });
                    }
                    if (response.body.items.length < limit)
                        break;
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
                    const existingTrack = existingTracks.find((t) => t.trackId === trackId);
                    const trackName = `${trackInfo.name} - ${trackInfo.artists.join(", ")}`;
                    if (!existingTrack) {
                        // Create new track state
                        await trackStatesService.createTrackStates({
                            userId: recordId,
                            trackId,
                            name: trackName,
                            status: "null",
                            targetPlaylists: [],
                        });
                    }
                    else if (existingTrack.name !== trackName) {
                        // Update track name if changed
                        await trackStatesService.updateTrackStates(existingTrack.recordId || "", {
                            name: trackName,
                        });
                    }
                }
                return {
                    success: true,
                    data: true,
                };
            });
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : "Failed to sync liked songs");
        }
    }
    async syncChangesToSpotify(userId, updates) {
        try {
            return await this.executeWithTokenRefresh(userId, async (spotifyApi) => {
                const results = [];
                // Process each track state update
                for (let i = 0; i < updates.length; i++) {
                    const update = updates[i];
                    try {
                        const trackState = await TrackStates_1.TrackStatesModel.findOne({
                            _id: new mongoose_1.default.Types.ObjectId(update?.data.recordId),
                            userId: new mongoose_1.default.Types.ObjectId(userId),
                        });
                        if (!trackState) {
                            results.push({
                                success: false,
                                error: `Track state (${update.recordId}) not found for user (${userId})`,
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
                                        trackState.targetPlaylists.filter((id) => id !== playlistId);
                                    await trackState.save();
                                }
                                catch (error) {
                                    if (error instanceof Error) {
                                        throw new error_1.DatabaseError(`Failed to add track to playlist ${playlistId}: ${error.message}`);
                                    }
                                    else {
                                        throw new error_1.DatabaseError(`Failed to add track to playlist ${playlistId}: ${JSON.stringify(error)}`);
                                    }
                                }
                            }
                        }
                        // Handle track removal
                        if (trackState.status === types_1.TRACK_STATES_STATUS.TO_REMOVE) {
                            await spotifyApi.removeFromMySavedTracks([trackState.trackId]);
                        }
                        results.push({
                            success: true,
                            data: trackState,
                            index: i,
                        });
                    }
                    catch (error) {
                        results.push({
                            success: false,
                            error: error instanceof Error
                                ? error.message
                                : "Failed to process track state",
                            index: i,
                        });
                    }
                }
                // Calculate summary
                const summary = {
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
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error
                ? error.message
                : "Failed to sync changes to Spotify");
        }
    }
    async handleCallback(data) {
        try {
            if (!data.code || !data.state) {
                throw new Error("Missing code or state from Spotify callback");
            }
            // Get session data using state
            const sessionData = await this.sessionService.get(`spotify:${data.state}`);
            if (!sessionData?.codeVerifier || !sessionData?.recordId) {
                throw new Error("Invalid or expired state");
            }
            // Exchange code for tokens
            const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: process.env.SPOTIFY_CLIENT_ID,
                    grant_type: "authorization_code",
                    code: data.code,
                    redirect_uri: this.spotifyRedirectUri,
                    code_verifier: sessionData.codeVerifier,
                }),
            });
            if (!tokenResponse.ok) {
                throw new Error("Failed to exchange code for tokens");
            }
            const tokens = (await tokenResponse.json());
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
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error
                ? error.message
                : "Failed to handle Spotify callback");
        }
    }
    async getUserPlaylists(userId) {
        try {
            return await this.executeWithTokenRefresh(userId, async (spotifyApi) => {
                const playlists = [];
                let offset = 0;
                const limit = 50;
                while (true) {
                    const response = await spotifyApi.getUserPlaylists({ limit, offset });
                    if (!response.body.items.length)
                        break;
                    playlists.push(...response.body.items);
                    if (response.body.items.length < limit)
                        break;
                    offset += limit;
                }
                return {
                    success: true,
                    data: playlists,
                };
            });
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            throw new error_1.DatabaseError(error instanceof Error
                ? error.message
                : "Failed to fetch user playlists");
        }
    }
    async getTrackStatesExtended(userId) {
        try {
            return await this.executeWithTokenRefresh(userId, async (spotifyApi) => {
                const trackStatesService = new trackStates_service_1.TrackStatesService();
                // Get base track states
                const trackStatesResponse = await trackStatesService.getTrackStates({
                    userId,
                });
                if (!trackStatesResponse.success) {
                    throw new Error("Failed to fetch track states");
                }
                // Fetch Spotify data for all tracks in batches of 50
                const records = [];
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
                    if (!savedTracks.body.items.length)
                        break;
                    for (const item of savedTracks.body.items) {
                        likedTracks.set(item.track.id, {
                            date_added: new Date(item.added_at),
                        });
                    }
                    if (savedTracks.body.items.length < limit)
                        break;
                    offset += limit;
                }
                // Get artist information to extract genres
                const artistIds = new Set();
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
                                external_url_spotify: spotifyTrack.external_urls["spotify"] || "",
                                artist_names: spotifyTrack.artists.map((item) => item.name),
                                date_added: likedTracks.get(spotifyTrack.id)?.date_added || new Date(),
                                genres: [], // Will be populated after getting artist genres
                            });
                        }
                    });
                }
                // Fetch artist details in batches to get genres
                const artistGenres = new Map();
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
                    const allGenres = new Set();
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
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            throw new error_1.DatabaseError(error instanceof Error
                ? error.message
                : "Failed to fetch user track states");
        }
    }
}
exports.SpotifyService = SpotifyService;
//# sourceMappingURL=spotify.service.js.map