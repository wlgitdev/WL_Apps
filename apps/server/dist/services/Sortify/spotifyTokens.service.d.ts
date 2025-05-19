import { SpotifyTokensDocument } from '../../models/Sortify/SpotifyTokens';
import { ApiResponse } from '@wl-apps/types';
import { SpotifyTokensFilters } from '@wl-apps/types';
export declare class SpotifyTokensService {
    private readonly algorithm;
    private readonly keyLength;
    private readonly ivLength;
    private readonly authTagLength;
    private readonly tokenEncryptionKey;
    constructor();
    private encryptToken;
    private decryptToken;
    createSpotifyTokens(data: Partial<SpotifyTokensDocument>): Promise<ApiResponse<SpotifyTokensDocument>>;
    getSpotifyTokens(filters?: SpotifyTokensFilters, options?: {
        matchType?: 'exact' | 'contains';
    }): Promise<ApiResponse<SpotifyTokensDocument[]>>;
    updateSpotifyTokens(recordId: string, data: Partial<SpotifyTokensDocument>): Promise<ApiResponse<SpotifyTokensDocument>>;
    createOrUpdateSpotifyTokens(data: Partial<SpotifyTokensDocument>): Promise<ApiResponse<SpotifyTokensDocument>>;
    deleteSpotifyTokens(recordId: string): Promise<ApiResponse<boolean>>;
}
//# sourceMappingURL=spotifyTokens.service.d.ts.map