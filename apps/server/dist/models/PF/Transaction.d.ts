import mongoose, { Document } from "mongoose";
import { Transaction, TransactionInterval } from '@wl-apps/types';
import { Frequency } from "rrule";
export interface TransactionDocument extends Transaction, Document {
}
export declare const transactionSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    indexes: ({
        name: number;
        direction?: undefined;
        bankAccount?: undefined;
        unique?: undefined;
    } | {
        direction: number;
        name?: undefined;
        bankAccount?: undefined;
        unique?: undefined;
    } | {
        name: number;
        bankAccount: number;
        unique: boolean;
        direction?: undefined;
    })[];
    timestamps: true;
    toJSON: {
        virtuals: true;
        transform: (_doc: mongoose.Document<unknown, {}, mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            direction: mongoose.SchemaDefinitionProperty;
            amount: mongoose.SchemaDefinitionProperty;
            bankAccount: mongoose.SchemaDefinitionProperty;
            notes: mongoose.SchemaDefinitionProperty;
            recurInterval: mongoose.SchemaDefinitionProperty;
            recurFrequency: mongoose.SchemaDefinitionProperty;
            recurOn: mongoose.SchemaDefinitionProperty;
            startDate: mongoose.SchemaDefinitionProperty;
            endDate: mongoose.SchemaDefinitionProperty;
            categories: mongoose.SchemaDefinitionProperty;
        } | {
            name: mongoose.SchemaDefinitionProperty;
            direction: mongoose.SchemaDefinitionProperty;
            amount: mongoose.SchemaDefinitionProperty;
            bankAccount: mongoose.SchemaDefinitionProperty;
            notes: mongoose.SchemaDefinitionProperty;
            recurInterval: mongoose.SchemaDefinitionProperty;
            recurFrequency: mongoose.SchemaDefinitionProperty;
            recurOn: mongoose.SchemaDefinitionProperty;
            startDate: mongoose.SchemaDefinitionProperty;
            endDate: mongoose.SchemaDefinitionProperty;
            categories: mongoose.SchemaDefinitionProperty;
        }>, {}> & ((mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            direction: mongoose.SchemaDefinitionProperty;
            amount: mongoose.SchemaDefinitionProperty;
            bankAccount: mongoose.SchemaDefinitionProperty;
            notes: mongoose.SchemaDefinitionProperty;
            recurInterval: mongoose.SchemaDefinitionProperty;
            recurFrequency: mongoose.SchemaDefinitionProperty;
            recurOn: mongoose.SchemaDefinitionProperty;
            startDate: mongoose.SchemaDefinitionProperty;
            endDate: mongoose.SchemaDefinitionProperty;
            categories: mongoose.SchemaDefinitionProperty;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }) | (mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            direction: mongoose.SchemaDefinitionProperty;
            amount: mongoose.SchemaDefinitionProperty;
            bankAccount: mongoose.SchemaDefinitionProperty;
            notes: mongoose.SchemaDefinitionProperty;
            recurInterval: mongoose.SchemaDefinitionProperty;
            recurFrequency: mongoose.SchemaDefinitionProperty;
            recurOn: mongoose.SchemaDefinitionProperty;
            startDate: mongoose.SchemaDefinitionProperty;
            endDate: mongoose.SchemaDefinitionProperty;
            categories: mongoose.SchemaDefinitionProperty;
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
            direction: mongoose.SchemaDefinitionProperty;
            amount: mongoose.SchemaDefinitionProperty;
            bankAccount: mongoose.SchemaDefinitionProperty;
            notes: mongoose.SchemaDefinitionProperty;
            recurInterval: mongoose.SchemaDefinitionProperty;
            recurFrequency: mongoose.SchemaDefinitionProperty;
            recurOn: mongoose.SchemaDefinitionProperty;
            startDate: mongoose.SchemaDefinitionProperty;
            endDate: mongoose.SchemaDefinitionProperty;
            categories: mongoose.SchemaDefinitionProperty;
        } | {
            name: mongoose.SchemaDefinitionProperty;
            direction: mongoose.SchemaDefinitionProperty;
            amount: mongoose.SchemaDefinitionProperty;
            bankAccount: mongoose.SchemaDefinitionProperty;
            notes: mongoose.SchemaDefinitionProperty;
            recurInterval: mongoose.SchemaDefinitionProperty;
            recurFrequency: mongoose.SchemaDefinitionProperty;
            recurOn: mongoose.SchemaDefinitionProperty;
            startDate: mongoose.SchemaDefinitionProperty;
            endDate: mongoose.SchemaDefinitionProperty;
            categories: mongoose.SchemaDefinitionProperty;
        }>, {}> & ((mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            direction: mongoose.SchemaDefinitionProperty;
            amount: mongoose.SchemaDefinitionProperty;
            bankAccount: mongoose.SchemaDefinitionProperty;
            notes: mongoose.SchemaDefinitionProperty;
            recurInterval: mongoose.SchemaDefinitionProperty;
            recurFrequency: mongoose.SchemaDefinitionProperty;
            recurOn: mongoose.SchemaDefinitionProperty;
            startDate: mongoose.SchemaDefinitionProperty;
            endDate: mongoose.SchemaDefinitionProperty;
            categories: mongoose.SchemaDefinitionProperty;
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }) | (mongoose.FlatRecord<{
            name: mongoose.SchemaDefinitionProperty;
            direction: mongoose.SchemaDefinitionProperty;
            amount: mongoose.SchemaDefinitionProperty;
            bankAccount: mongoose.SchemaDefinitionProperty;
            notes: mongoose.SchemaDefinitionProperty;
            recurInterval: mongoose.SchemaDefinitionProperty;
            recurFrequency: mongoose.SchemaDefinitionProperty;
            recurOn: mongoose.SchemaDefinitionProperty;
            startDate: mongoose.SchemaDefinitionProperty;
            endDate: mongoose.SchemaDefinitionProperty;
            categories: mongoose.SchemaDefinitionProperty;
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
    direction?: any;
    amount?: any;
    bankAccount?: any;
    notes?: any;
    recurInterval?: any;
    recurFrequency?: any;
    recurOn?: any;
    startDate?: any;
    endDate?: any;
    categories?: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: mongoose.SchemaDefinitionProperty;
    direction: mongoose.SchemaDefinitionProperty;
    amount: mongoose.SchemaDefinitionProperty;
    bankAccount: mongoose.SchemaDefinitionProperty;
    notes: mongoose.SchemaDefinitionProperty;
    recurInterval: mongoose.SchemaDefinitionProperty;
    recurFrequency: mongoose.SchemaDefinitionProperty;
    recurOn: mongoose.SchemaDefinitionProperty;
    startDate: mongoose.SchemaDefinitionProperty;
    endDate: mongoose.SchemaDefinitionProperty;
    categories: mongoose.SchemaDefinitionProperty;
} | {
    name: mongoose.SchemaDefinitionProperty;
    direction: mongoose.SchemaDefinitionProperty;
    amount: mongoose.SchemaDefinitionProperty;
    bankAccount: mongoose.SchemaDefinitionProperty;
    notes: mongoose.SchemaDefinitionProperty;
    recurInterval: mongoose.SchemaDefinitionProperty;
    recurFrequency: mongoose.SchemaDefinitionProperty;
    recurOn: mongoose.SchemaDefinitionProperty;
    startDate: mongoose.SchemaDefinitionProperty;
    endDate: mongoose.SchemaDefinitionProperty;
    categories: mongoose.SchemaDefinitionProperty;
}>, {}> & ((mongoose.FlatRecord<{
    name: mongoose.SchemaDefinitionProperty;
    direction: mongoose.SchemaDefinitionProperty;
    amount: mongoose.SchemaDefinitionProperty;
    bankAccount: mongoose.SchemaDefinitionProperty;
    notes: mongoose.SchemaDefinitionProperty;
    recurInterval: mongoose.SchemaDefinitionProperty;
    recurFrequency: mongoose.SchemaDefinitionProperty;
    recurOn: mongoose.SchemaDefinitionProperty;
    startDate: mongoose.SchemaDefinitionProperty;
    endDate: mongoose.SchemaDefinitionProperty;
    categories: mongoose.SchemaDefinitionProperty;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}) | (mongoose.FlatRecord<{
    name: mongoose.SchemaDefinitionProperty;
    direction: mongoose.SchemaDefinitionProperty;
    amount: mongoose.SchemaDefinitionProperty;
    bankAccount: mongoose.SchemaDefinitionProperty;
    notes: mongoose.SchemaDefinitionProperty;
    recurInterval: mongoose.SchemaDefinitionProperty;
    recurFrequency: mongoose.SchemaDefinitionProperty;
    recurOn: mongoose.SchemaDefinitionProperty;
    startDate: mongoose.SchemaDefinitionProperty;
    endDate: mongoose.SchemaDefinitionProperty;
    categories: mongoose.SchemaDefinitionProperty;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}))>;
export declare const frequencyMap: Record<TransactionInterval, Frequency>;
export declare const TransactionModel: mongoose.Model<TransactionDocument, {}, {}, {}, mongoose.Document<unknown, {}, TransactionDocument, {}> & TransactionDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Transaction.d.ts.map