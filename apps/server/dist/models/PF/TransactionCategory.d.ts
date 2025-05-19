import mongoose, { Document } from "mongoose";
import { TransactionCategory } from "@wl-apps/types";
export interface TransactionCategoryDocument extends TransactionCategory, Document {
}
export declare const transactionCategorySchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
        transform: (_doc: mongoose.Document<unknown, {}, mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
        } | {
            name: mongoose.SchemaDefinitionProperty;
        }>, {}> & ((mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }) | (mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
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
        } | {
            name: mongoose.SchemaDefinitionProperty;
        }>, {}> & ((mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }) | (mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
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
    name?: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: mongoose.SchemaDefinitionProperty;
} | {
    name: mongoose.SchemaDefinitionProperty;
}>, {}> & ((mongoose.FlatRecord<{
    name: mongoose.SchemaDefinitionProperty;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}) | (mongoose.FlatRecord<{
    name: mongoose.SchemaDefinitionProperty;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}))>;
export declare const TransactionCategoryModel: mongoose.Model<TransactionCategoryDocument, {}, {}, {}, mongoose.Document<unknown, {}, TransactionCategoryDocument, {}> & TransactionCategoryDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=TransactionCategory.d.ts.map