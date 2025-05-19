import mongoose, { Document } from 'mongoose';
import { SpotifyTokens } from '@wl-apps/types';
export interface SpotifyTokensDocument extends SpotifyTokens, Document {
}
export declare const spotifyTokensSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
        transform: (_doc: mongoose.Document<unknown, {}, mongoose.FlatRecord<{
            encryptedAccessToken: mongoose.SchemaDefinitionProperty;
            encryptedRefreshToken: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
        } | {
            encryptedAccessToken: mongoose.SchemaDefinitionProperty;
            encryptedRefreshToken: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
        }>, {}> & ((mongoose.FlatRecord<{
            encryptedAccessToken: mongoose.SchemaDefinitionProperty;
            encryptedRefreshToken: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }) | (mongoose.FlatRecord<{
            encryptedAccessToken: mongoose.SchemaDefinitionProperty;
            encryptedRefreshToken: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        })), ret: Record<string, any>) => Record<string, any>;
    };
    toObject: {
        virtuals: true;
        transform: (_doc: mongoose.Document<unknown, {}, mongoose.FlatRecord<{
            encryptedAccessToken: mongoose.SchemaDefinitionProperty;
            encryptedRefreshToken: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
        } | {
            encryptedAccessToken: mongoose.SchemaDefinitionProperty;
            encryptedRefreshToken: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
        }>, {}> & ((mongoose.FlatRecord<{
            encryptedAccessToken: mongoose.SchemaDefinitionProperty;
            encryptedRefreshToken: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }) | (mongoose.FlatRecord<{
            encryptedAccessToken: mongoose.SchemaDefinitionProperty;
            encryptedRefreshToken: mongoose.SchemaDefinitionProperty;
            userId: mongoose.SchemaDefinitionProperty;
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
    encryptedAccessToken?: any;
    encryptedRefreshToken?: any;
    userId?: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    encryptedAccessToken: mongoose.SchemaDefinitionProperty;
    encryptedRefreshToken: mongoose.SchemaDefinitionProperty;
    userId: mongoose.SchemaDefinitionProperty;
} | {
    encryptedAccessToken: mongoose.SchemaDefinitionProperty;
    encryptedRefreshToken: mongoose.SchemaDefinitionProperty;
    userId: mongoose.SchemaDefinitionProperty;
}>, {}> & ((mongoose.FlatRecord<{
    encryptedAccessToken: mongoose.SchemaDefinitionProperty;
    encryptedRefreshToken: mongoose.SchemaDefinitionProperty;
    userId: mongoose.SchemaDefinitionProperty;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}) | (mongoose.FlatRecord<{
    encryptedAccessToken: mongoose.SchemaDefinitionProperty;
    encryptedRefreshToken: mongoose.SchemaDefinitionProperty;
    userId: mongoose.SchemaDefinitionProperty;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}))>;
export declare const SpotifyTokensModel: mongoose.Model<SpotifyTokensDocument, {}, {}, {}, mongoose.Document<unknown, {}, SpotifyTokensDocument, {}> & SpotifyTokensDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=SpotifyTokens.d.ts.map