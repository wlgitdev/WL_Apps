"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyTokensService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SpotifyTokens_1 = require("../../models/Sortify/SpotifyTokens");
const types_1 = require("@wl-apps/types");
const error_1 = require("../../errors/error");
const crypto_1 = __importDefault(require("crypto"));
class SpotifyTokensService {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.keyLength = 32;
        this.ivLength = 12;
        this.authTagLength = 16;
        try {
            const key = process.env.SPOTIFY_TOKEN_ENCRYPTION_KEY;
            if (!key) {
                throw new Error('SPOTIFY_TOKEN_ENCRYPTION_KEY environment variable is not set');
            }
            this.tokenEncryptionKey = Buffer.from(key, 'utf8');
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error initialising SpotifyTokensService: ${error.message}`);
            }
            throw new Error(`Error initialising SpotifyTokensService`);
        }
    }
    encryptToken(token) {
        try {
            const iv = crypto_1.default.randomBytes(this.ivLength);
            const cipher = crypto_1.default.createCipheriv(this.algorithm, this.tokenEncryptionKey, iv);
            let encryptedToken = cipher.update(token, 'utf8', 'hex');
            encryptedToken += cipher.final('hex');
            const authTag = cipher.getAuthTag();
            // Combine IV, encrypted token, and auth tag into a single string
            return iv.toString('hex') + ':' + encryptedToken + ':' + authTag.toString('hex');
        }
        catch (error) {
            if (error instanceof Error) {
                throw new error_1.DatabaseError('Failed to encrypt token: ' + error.message);
            }
            throw new error_1.DatabaseError('Failed to encrypt token');
        }
    }
    decryptToken(encryptedData) {
        try {
            // Split the combined string into its components
            const [ivHex, encryptedTokenHex, authTagHex] = encryptedData.split(':');
            if (!ivHex || !encryptedTokenHex || !authTagHex) {
                throw new Error('Invalid encrypted token format');
            }
            const iv = Buffer.from(ivHex, 'hex');
            const authTag = Buffer.from(authTagHex, 'hex');
            // Create decipher
            const decipher = crypto_1.default.createDecipheriv(this.algorithm, this.tokenEncryptionKey, iv);
            decipher.setAuthTag(authTag);
            // Decrypt
            let decryptedToken = decipher.update(encryptedTokenHex, 'hex', 'utf8');
            decryptedToken += decipher.final('utf8');
            return decryptedToken;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new error_1.DatabaseError('Failed to decrypt token: ' + error.message);
            }
            throw new error_1.DatabaseError('Failed to decrypt token');
        }
    }
    async createSpotifyTokens(data) {
        try {
            if (!data.encryptedAccessToken || !data.encryptedRefreshToken) {
                throw new error_1.ValidationError('Encrypted access token and refresh token are required');
            }
            const spotifyTokens = new SpotifyTokens_1.SpotifyTokensModel({
                ...data,
                encryptedAccessToken: this.encryptToken(data.encryptedAccessToken),
                encryptedRefreshToken: this.encryptToken(data.encryptedRefreshToken)
            });
            await spotifyTokens.save();
            return {
                success: true,
                data: spotifyTokens.toJSON()
            };
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new error_1.ValidationError(error.message);
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to create record');
        }
    }
    async getSpotifyTokens(filters = {}, options = {}) {
        try {
            const mongooseFilters = { ...filters };
            const { matchType = 'exact' } = options;
            if (mongooseFilters.recordId) {
                mongooseFilters._id = mongooseFilters.recordId;
                delete mongooseFilters.recordId;
            }
            for (const [key, value] of Object.entries(mongooseFilters)) {
                if (matchType === 'contains' && typeof value === 'string') {
                    mongooseFilters[key] = { $regex: value, $options: 'i' };
                }
            }
            const spotifyTokens = await SpotifyTokens_1.SpotifyTokensModel.find(mongooseFilters)
                .sort({ userId: -1 });
            // Decrypt tokens before returning
            const decryptedTokens = spotifyTokens.map(record => {
                const json = record.toJSON();
                if (record.encryptedAccessToken) {
                    json.encryptedAccessToken = this.decryptToken(record.encryptedAccessToken);
                }
                if (record.encryptedRefreshToken) {
                    json.encryptedRefreshToken = this.decryptToken(record.encryptedRefreshToken);
                }
                return json;
            });
            return {
                success: true,
                data: decryptedTokens
            };
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to fetch data');
        }
    }
    async updateSpotifyTokens(recordId, data) {
        try {
            const spotifyTokens = await SpotifyTokens_1.SpotifyTokensModel.findById(recordId);
            if (!spotifyTokens) {
                throw new error_1.NotFoundError(types_1.SpotifyTokensNamingScheme.SINGULAR);
            }
            if (!data.encryptedAccessToken || !data.encryptedRefreshToken) {
                throw new error_1.ValidationError('Encrypted access token and refresh token are required');
            }
            Object.assign(spotifyTokens, {
                ...data,
                encryptedAccessToken: this.encryptToken(data.encryptedAccessToken),
                encryptedRefreshToken: this.encryptToken(data.encryptedRefreshToken)
            });
            await spotifyTokens.save();
            return {
                success: true,
                data: spotifyTokens.toJSON()
            };
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new error_1.ValidationError(error.message);
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to update record');
        }
    }
    async createOrUpdateSpotifyTokens(data) {
        try {
            let result;
            if (data.recordId && !!(await SpotifyTokens_1.SpotifyTokensModel.findById(data.recordId))) {
                result = await this.updateSpotifyTokens(data.recordId, data);
            }
            else {
                result = await this.createSpotifyTokens(data);
            }
            return result;
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new error_1.ValidationError(error.message);
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to create / update record');
        }
    }
    async deleteSpotifyTokens(recordId) {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            // First check if record exists
            const spotifyTokens = await SpotifyTokens_1.SpotifyTokensModel.findById(recordId).session(session);
            if (!spotifyTokens) {
                throw new error_1.NotFoundError(types_1.SpotifyTokensNamingScheme.SINGULAR);
            }
            await SpotifyTokens_1.SpotifyTokensModel.findByIdAndDelete(recordId).session(session);
            await session.commitTransaction();
            return {
                success: true,
                data: true
            };
        }
        catch (error) {
            await session.abortTransaction();
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to delete record');
        }
        finally {
            session.endSession();
        }
    }
}
exports.SpotifyTokensService = SpotifyTokensService;
//# sourceMappingURL=spotifyTokens.service.js.map