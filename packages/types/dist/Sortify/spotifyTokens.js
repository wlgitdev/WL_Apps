"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyTokensFilterConfig = exports.SpotifyTokensNamingScheme = void 0;
exports.SpotifyTokensNamingScheme = {
    MODEL: 'SpotifyTokens',
    SINGULAR: 'Token',
    PLURAL: 'Tokens'
};
exports.SpotifyTokensFilterConfig = {
    recordId: { type: "string" },
    createdAt: { type: "date" },
    updatedAt: { type: "date" },
    userId: { type: "string" },
    encryptedAccessToken: { type: "string" },
    encryptedRefreshToken: { type: "string" },
};
//# sourceMappingURL=spotifyTokens.js.map