import { ApiBatchResponse, ApiResponse, BatchUpdate, SpotifyCallbackData } from "@wl-apps/types";
import { UserPlaylist, TrackStatesExtended } from "@wl-apps/types";
import { SessionService } from "../session.service";
import { SpotifyTokensService } from "./spotifyTokens.service";
import { TrackStatesDocument } from "../../models/Sortify/TrackStates";
export declare class SpotifyService {
    private sessionService;
    private spotifyTokensService;
    private spotifyRedirectUri;
    constructor(sessionService: SessionService, spotifyTokensService: SpotifyTokensService);
    private generateState;
    private generateCodeVerifier;
    private generateCodeChallenge;
    private refreshTokens;
    private executeWithTokenRefresh;
    private newSpotifyApiInstance;
    getSpotifyAuthUrl(recordId: string): Promise<ApiResponse<string>>;
    syncLikedSongs(recordId: string): Promise<ApiResponse<boolean>>;
    syncChangesToSpotify(userId: string, updates: BatchUpdate<TrackStatesDocument>[]): Promise<ApiResponse<ApiBatchResponse<TrackStatesDocument>>>;
    handleCallback(data: Partial<SpotifyCallbackData>): Promise<ApiResponse<boolean>>;
    getUserPlaylists(userId: string): Promise<ApiResponse<UserPlaylist[]>>;
    getTrackStatesExtended(userId: string): Promise<ApiResponse<TrackStatesExtended[]>>;
}
//# sourceMappingURL=spotify.service.d.ts.map