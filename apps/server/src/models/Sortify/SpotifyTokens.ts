import mongoose, { Schema, Document } from 'mongoose';
import { UserNamingScheme } from '@wl-apps/types';
import { baseModelSchema } from '../BaseModel';
import {
  createReferenceConfig,
  createStringConfig,
} from '../commonValidators';
import { SpotifyTokens, SpotifyTokensNamingScheme } from '@wl-apps/types';

export interface SpotifyTokensDocument extends SpotifyTokens, Document {}

export const spotifyTokensSchema = new Schema(
  {
    ...baseModelSchema.obj,
    encryptedAccessToken: createStringConfig({
      required: true,
    }),
    encryptedRefreshToken: createStringConfig({
      required: true,
    }),
    userId: createReferenceConfig({
      required: true,
      modelName: UserNamingScheme.MODEL,
    }),
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.recordId = ret._id;
        delete ret._id;
        delete ret.id;
        delete ret.__v;
        delete ret.encryptedAccessToken;
        delete ret.encryptedRefreshToken;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.recordId = ret._id;
        delete ret._id;
        delete ret.id;
        delete ret.__v;
        delete ret.encryptedAccessToken;
        delete ret.encryptedRefreshToken;
        return ret;
      }
    }
  }
);

// Create an index on userId for better query performance
spotifyTokensSchema.index({ userId: 1 }, { unique: true });

export const SpotifyTokensModel = mongoose.model<SpotifyTokensDocument>(
  SpotifyTokensNamingScheme.MODEL,
  spotifyTokensSchema
);
