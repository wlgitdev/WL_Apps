// BankAccount.ts
import mongoose, { Schema, Document } from 'mongoose';
import { BankAccountNamingScheme, BankAccount, TransactionCategoryNamingScheme, TransactionNamingScheme } from '@wl-apps/types';
import { baseModelSchema } from '../BaseModel';
import {
  createStringConfig,
  createNumericConfig,
  createDateConfig
} from '../commonValidators';
import { TransactionModel } from './Transaction';

export interface BankAccountDocument extends BankAccount, Document {}

export const bankAccountSchema = new Schema(
  {
    ...baseModelSchema.obj,
    name: createStringConfig({
      minLength: 2,
      maxLength: 100,
      required: true,
      pattern: /^[^\p{C}]+$/u
    }),
    balance: createNumericConfig({
      required: true,
      default: 0
    }),
    balanceUpdateDate: createDateConfig({})
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

bankAccountSchema.virtual(TransactionCategoryNamingScheme.PLURAL, {
  ref: TransactionCategoryNamingScheme.MODEL,
  localField: '_id',
  foreignField: BankAccountNamingScheme.MODEL,
  options: { sort: { name: 1 } }
});

// Pre-save middleware (handles document saves)
bankAccountSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("balance")) {
    this.balanceUpdateDate = new Date();
  }
  next();
});

bankAccountSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const update = this.getUpdate() as any;

  // Check if balance is being modified in this update
  if (update?.balance !== undefined || update?.$set?.balance !== undefined) {
    if (!update.$set) update.$set = {};
    update.$set.balanceUpdateDate = new Date();
  }
  next();
});

// Prevent deletion if referenced by transactions
bankAccountSchema.pre(['deleteOne', 'findOneAndDelete'], async function (next) {
  const query = this.getFilter();
  const count = await TransactionModel.countDocuments({ bankAccount: query._id });

  if (count > 0) {
    return next(new Error(`Cannot delete ${BankAccountNamingScheme.SINGULAR}: it is referenced by one or more ${TransactionNamingScheme.PLURAL}.`));
  }

  next();
});

export const BankAccountModel = mongoose.model<BankAccountDocument>(
  BankAccountNamingScheme.MODEL,
  bankAccountSchema
);
