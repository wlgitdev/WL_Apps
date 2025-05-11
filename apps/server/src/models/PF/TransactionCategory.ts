import mongoose, { Schema, Document } from "mongoose";
import { TransactionCategory, TransactionCategoryNamingScheme, TransactionNamingScheme } from "@wl-apps/types";
import { baseModelSchema } from "../BaseModel";
import {
  createStringConfig,
} from "../commonValidators";

export interface TransactionCategoryDocument extends TransactionCategory, Document {}

export const transactionCategorySchema = new Schema(
  {
      ...baseModelSchema.obj,
    name: createStringConfig({
      minLength: 2,
      maxLength: 100,
      required: true,
      pattern: /^[^\p{C}]+$/u,
      patternMessage:
        "Name can only contain printable characters",
      context: {
        entityName: TransactionCategoryNamingScheme.MODEL,
        fieldDisplayName: "Name",
      },
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
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.recordId = ret._id;
        delete ret._id;
        delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

transactionCategorySchema.virtual(TransactionNamingScheme.PLURAL, {
  ref: TransactionNamingScheme.MODEL,
  localField: '_id',
  foreignField: TransactionCategoryNamingScheme.PLURAL,
  options: { sort: { name: 1 } },
  displayInForms: true,
});

transactionCategorySchema.pre(
  ['deleteOne', 'findOneAndDelete'],
  async function (next) {
    const query = this.getFilter();
    const count = await mongoose
      .model(TransactionNamingScheme.MODEL)
      .countDocuments({ categories: query._id });

    if (count > 0) {
      return next(
        new Error(
          `Cannot delete ${TransactionCategoryNamingScheme.SINGULAR}: it is referenced by one or more ${TransactionNamingScheme.PLURAL}.`
        )
      );
    }

    next();
  }
);


export const TransactionCategoryModel = mongoose.model<TransactionCategoryDocument>(
  TransactionCategoryNamingScheme.MODEL,
  transactionCategorySchema
);
