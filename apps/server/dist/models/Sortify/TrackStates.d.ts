import mongoose, { Document } from 'mongoose';
import { TrackStates } from '@wl-apps/types';
export interface TrackStatesDocument extends TrackStates, Document {
}
export declare const trackStatesSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
        transform: (_doc: mongoose.Document<unknown, {}, mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            trackId: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
            status: mongoose.SchemaDefinitionProperty;
            targetPlaylists: mongoose.SchemaDefinitionProperty;
        } | {
            name: mongoose.SchemaDefinitionProperty;
            trackId: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
            status: mongoose.SchemaDefinitionProperty;
            targetPlaylists: mongoose.SchemaDefinitionProperty;
        }>, {}> & ((mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            trackId: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
            status: mongoose.SchemaDefinitionProperty;
            targetPlaylists: mongoose.SchemaDefinitionProperty;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }) | (mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            trackId: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
            status: mongoose.SchemaDefinitionProperty;
            targetPlaylists: mongoose.SchemaDefinitionProperty;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        })), ret: Record<string, any>) => Record<string, any>;
    };
    toObject: {
        virtuals: true;
        transform: (_doc: mongoose.Document<unknown, {}, mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            trackId: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
            status: mongoose.SchemaDefinitionProperty;
            targetPlaylists: mongoose.SchemaDefinitionProperty;
        } | {
            name: mongoose.SchemaDefinitionProperty;
            trackId: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
            status: mongoose.SchemaDefinitionProperty;
            targetPlaylists: mongoose.SchemaDefinitionProperty;
        }>, {}> & ((mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            trackId: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
            status: mongoose.SchemaDefinitionProperty;
            targetPlaylists: mongoose.SchemaDefinitionProperty;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }) | (mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            trackId: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
            status: mongoose.SchemaDefinitionProperty;
            targetPlaylists: mongoose.SchemaDefinitionProperty;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        })), ret: Record<string, any>) => Record<string, any>;
    };
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status?: any;
    name?: any;
    userId?: any;
    trackId?: any;
    targetPlaylists?: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: mongoose.SchemaDefinitionProperty;
    trackId: mongoose.SchemaDefinitionProperty;
    userId: mongoose.SchemaDefinitionProperty;
    status: mongoose.SchemaDefinitionProperty;
    targetPlaylists: mongoose.SchemaDefinitionProperty;
} | {
    name: mongoose.SchemaDefinitionProperty;
    trackId: mongoose.SchemaDefinitionProperty;
    userId: mongoose.SchemaDefinitionProperty;
    status: mongoose.SchemaDefinitionProperty;
    targetPlaylists: mongoose.SchemaDefinitionProperty;
}>, {}> & ((mongoose.FlatRecord<{
    name: mongoose.SchemaDefinitionProperty;
    trackId: mongoose.SchemaDefinitionProperty;
    userId: mongoose.SchemaDefinitionProperty;
    status: mongoose.SchemaDefinitionProperty;
    targetPlaylists: mongoose.SchemaDefinitionProperty;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}) | (mongoose.FlatRecord<{
    name: mongoose.SchemaDefinitionProperty;
    trackId: mongoose.SchemaDefinitionProperty;
    userId: mongoose.SchemaDefinitionProperty;
    status: mongoose.SchemaDefinitionProperty;
    targetPlaylists: mongoose.SchemaDefinitionProperty;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}))>;
export declare const TrackStatesModel: mongoose.Model<TrackStatesDocument, {}, {}, {}, mongoose.Document<unknown, {}, TrackStatesDocument, {}> & TrackStatesDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=TrackStates.d.ts.map