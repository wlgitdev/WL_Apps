import mongoose, { Document } from 'mongoose';
import { BankAccount } from '@wl-apps/types';
export interface BankAccountDocument extends BankAccount, Document {
}
export declare const bankAccountSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
        transform: (_doc: mongoose.Document<unknown, {}, mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            balance: mongoose.SchemaDefinitionProperty;
            balanceUpdateDate: mongoose.SchemaDefinitionProperty;
        } | {
            name: mongoose.SchemaDefinitionProperty;
            balance: mongoose.SchemaDefinitionProperty;
            balanceUpdateDate: mongoose.SchemaDefinitionProperty;
        }>, {}> & ((mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            balance: mongoose.SchemaDefinitionProperty;
            balanceUpdateDate: mongoose.SchemaDefinitionProperty;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }) | (mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            balance: mongoose.SchemaDefinitionProperty;
            balanceUpdateDate: mongoose.SchemaDefinitionProperty;
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
            balance: mongoose.SchemaDefinitionProperty;
            balanceUpdateDate: mongoose.SchemaDefinitionProperty;
        } | {
            name: mongoose.SchemaDefinitionProperty;
            balance: mongoose.SchemaDefinitionProperty;
            balanceUpdateDate: mongoose.SchemaDefinitionProperty;
        }>, {}> & ((mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            balance: mongoose.SchemaDefinitionProperty;
            balanceUpdateDate: mongoose.SchemaDefinitionProperty;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }) | (mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            balance: mongoose.SchemaDefinitionProperty;
            balanceUpdateDate: mongoose.SchemaDefinitionProperty;
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
    balance?: any;
    balanceUpdateDate?: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: mongoose.SchemaDefinitionProperty;
    balance: mongoose.SchemaDefinitionProperty;
    balanceUpdateDate: mongoose.SchemaDefinitionProperty;
} | {
    name: mongoose.SchemaDefinitionProperty;
    balance: mongoose.SchemaDefinitionProperty;
    balanceUpdateDate: mongoose.SchemaDefinitionProperty;
}>, {}> & ((mongoose.FlatRecord<{
    name: mongoose.SchemaDefinitionProperty;
    balance: mongoose.SchemaDefinitionProperty;
    balanceUpdateDate: mongoose.SchemaDefinitionProperty;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}) | (mongoose.FlatRecord<{
    name: mongoose.SchemaDefinitionProperty;
    balance: mongoose.SchemaDefinitionProperty;
    balanceUpdateDate: mongoose.SchemaDefinitionProperty;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}))>;
export declare const BankAccountModel: mongoose.Model<BankAccountDocument, {}, {}, {}, mongoose.Document<unknown, {}, BankAccountDocument, {}> & BankAccountDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=BankAccount.d.ts.map