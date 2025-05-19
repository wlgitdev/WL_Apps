import { BaseModel, EntityNamingScheme, FilterConfig } from "../index";
export declare const SpotifyTokensNamingScheme: EntityNamingScheme;
export interface SpotifyTokens extends BaseModel {
    userId: string;
    encryptedAccessToken: string;
    encryptedRefreshToken: string;
}
export type SpotifyTokensFilters = Partial<SpotifyTokens>;
export declare const SpotifyTokensFilterConfig: FilterConfig<SpotifyTokensFilters>;
//# sourceMappingURL=spotifyTokens.d.ts.map