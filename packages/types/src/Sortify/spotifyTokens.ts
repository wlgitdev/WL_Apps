import { BaseModel, EntityNamingScheme, FilterConfig } from "../index";

export const SpotifyTokensNamingScheme: EntityNamingScheme = {
  MODEL: 'SpotifyTokens',
  SINGULAR: 'Token',
  PLURAL: 'Tokens'
};

export interface SpotifyTokens extends BaseModel {
  userId: string;
  encryptedAccessToken: string;
  encryptedRefreshToken: string;
}

export type SpotifyTokensFilters = Partial<SpotifyTokens>;

export const SpotifyTokensFilterConfig: FilterConfig<SpotifyTokensFilters> = (<const>{
  recordId: { type: "string" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  userId: { type: "string" },
  encryptedAccessToken: { type: "string" },
  encryptedRefreshToken: { type: "string" },
}) satisfies FilterConfig<SpotifyTokensFilters>;

