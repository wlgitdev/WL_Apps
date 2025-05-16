import mongoose, { Schema, Document } from 'mongoose';
import { UserNamingScheme } from '@wl-apps/types';
import { baseModelSchema } from '../BaseModel';
import {
  createArrayConfig,
  createEnumConfig,
  createReferenceConfig,
  createStringConfig,
} from '../commonValidators';
import { TRACK_STATES_STATUS, TrackStates, TrackStatesNamingScheme } from '@wl-apps/types/src/Sortify';

export interface TrackStatesDocument extends TrackStates, Document {}

export const trackStatesSchema = new Schema(
  {
    ...baseModelSchema.obj,
    name: createStringConfig({
      required: true,
    }),
    trackId: createStringConfig({
      required: true,
    }),
    userId: createReferenceConfig({
      required: true,
      modelName: UserNamingScheme.MODEL,
    }),
    status: createEnumConfig({
      required: true,
      values: [TRACK_STATES_STATUS.NULL, TRACK_STATES_STATUS.TO_REMOVE,TRACK_STATES_STATUS.SKIP]
    }),
    targetPlaylists: createArrayConfig({
      required: false,      
      unique: true,
    })
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
        return ret;
      }
    }
  }
);

export const TrackStatesModel = mongoose.model<TrackStatesDocument>(
  TrackStatesNamingScheme.MODEL,
  trackStatesSchema
);
