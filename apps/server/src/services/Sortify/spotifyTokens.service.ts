import mongoose from 'mongoose';
import { SpotifyTokensModel, SpotifyTokensDocument } from '../../models/Sortify/SpotifyTokens';
import { ApiResponse} from '@wl-apps/types';
import { SpotifyTokensFilters, SpotifyTokensNamingScheme} from '@wl-apps/types';
import { DatabaseError, NotFoundError, ValidationError } from '../../errors/error';
import crypto from 'crypto';

export class SpotifyTokensService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 12;
  private readonly authTagLength = 16;
  private readonly tokenEncryptionKey: Buffer;

  constructor() {
    try {      
      const key = process.env.SPOTIFY_TOKEN_ENCRYPTION_KEY;
      if (!key) {
        throw new Error('SPOTIFY_TOKEN_ENCRYPTION_KEY environment variable is not set');
      }
      this.tokenEncryptionKey = Buffer.from(key, 'utf8');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error initialising SpotifyTokensService: ${error.message}`);              
      }
      throw new Error(`Error initialising SpotifyTokensService`);              
    }
  }

  private encryptToken(token: string): string {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, this.tokenEncryptionKey, iv);
      
      let encryptedToken = cipher.update(token, 'utf8', 'hex');
      encryptedToken += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      // Combine IV, encrypted token, and auth tag into a single string
      return iv.toString('hex') + ':' + encryptedToken + ':' + authTag.toString('hex');
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError('Failed to encrypt token: ' + error.message);
      }
      throw new DatabaseError('Failed to encrypt token');
    }
  }

  private decryptToken(encryptedData: string): string {
    try {
      // Split the combined string into its components
      const [ivHex, encryptedTokenHex, authTagHex] = encryptedData.split(':');
      
      if (!ivHex || !encryptedTokenHex || !authTagHex) {
        throw new Error('Invalid encrypted token format');
      }

      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      
      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, this.tokenEncryptionKey, iv);
      decipher.setAuthTag(authTag);
      
      // Decrypt
      let decryptedToken = decipher.update(encryptedTokenHex, 'hex', 'utf8');
      decryptedToken += decipher.final('utf8');
      
      return decryptedToken;
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError('Failed to decrypt token: ' + error.message);
      }
      throw new DatabaseError('Failed to decrypt token');
    }
  }

  async createSpotifyTokens(
    data: Partial<SpotifyTokensDocument>
  ): Promise<ApiResponse<SpotifyTokensDocument>> {
    try {      
      if (!data.encryptedAccessToken || !data.encryptedRefreshToken) {
        throw new ValidationError('Encrypted access token and refresh token are required');
      }

      const spotifyTokens = new SpotifyTokensModel({
        ...data,
        encryptedAccessToken: this.encryptToken(data.encryptedAccessToken),
        encryptedRefreshToken: this.encryptToken(data.encryptedRefreshToken)
      });

      await spotifyTokens.save();
      return {
        success: true,
        data: spotifyTokens.toJSON()
      };
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(error.message);
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to create record'
      );
    }
  }

  async getSpotifyTokens(
    filters: SpotifyTokensFilters = {},
    options: {
      matchType?: 'exact' | 'contains';
    } = {}
  ): Promise<ApiResponse<SpotifyTokensDocument[]>> {
    try {
      const mongooseFilters: any = { ...filters };
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

      const spotifyTokens = await SpotifyTokensModel.find(mongooseFilters)
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
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch data'
      );
    }
  }

  async updateSpotifyTokens(
    recordId: string,
    data: Partial<SpotifyTokensDocument>
  ): Promise<ApiResponse<SpotifyTokensDocument>> {
    try {
      const spotifyTokens = await SpotifyTokensModel.findById(recordId);

      if (!spotifyTokens) {
        throw new NotFoundError(SpotifyTokensNamingScheme.SINGULAR);
      }

      if (!data.encryptedAccessToken || !data.encryptedRefreshToken) {
        throw new ValidationError('Encrypted access token and refresh token are required');
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
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(error.message);
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to update record'
      );
    }
  }
  async createOrUpdateSpotifyTokens(
    data: Partial<SpotifyTokensDocument>
  ): Promise<ApiResponse<SpotifyTokensDocument>> {
    try {
      let result;

      if (data.recordId && !!(await SpotifyTokensModel.findById(data.recordId))) {
        result = await this.updateSpotifyTokens(data.recordId, data)
      } else {
        result = await this.createSpotifyTokens(data)
      }

      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(error.message);
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to create / update record'
      );
    }
  }

  async deleteSpotifyTokens(recordId: string): Promise<ApiResponse<boolean>> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // First check if record exists
      const spotifyTokens = await SpotifyTokensModel.findById(recordId).session(session);
      
      if (!spotifyTokens) {
        throw new NotFoundError(SpotifyTokensNamingScheme.SINGULAR);
      }

      await SpotifyTokensModel.findByIdAndDelete(recordId).session(session);

      await session.commitTransaction();
      return {
        success: true,
        data: true
      };
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to delete record'
      );
    } finally {
      session.endSession();
    }
  }

  
}
