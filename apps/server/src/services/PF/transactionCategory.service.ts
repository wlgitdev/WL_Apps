import mongoose from "mongoose";
import {
  TransactionCategoryModel,
  TransactionCategoryDocument,TransactionDocument, TransactionModel } from "../../models/PF";
import { ApiResponse, TransactionCategoryFilters, TransactionCategoryNamingScheme, TransactionNamingScheme } from "@wl-apps/types";
import { DatabaseError, NotFoundError, ValidationError } from "../../errors/error";

export class TransactionCategoryService {
  async createTransactionCategory(
    data: Partial<TransactionCategoryDocument>
  ): Promise<ApiResponse<TransactionCategoryDocument>> {
    try {

      const transactionCategory = new TransactionCategoryModel({
        ...data
      });

      await transactionCategory.save();
      return {
        success: true,
        data: transactionCategory.toJSON(),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(error.message);
      }
      throw new DatabaseError(
          error instanceof Error
            ? error.message
          : "Failed to create record"
      );
    }
  }

  async getTransactionCategories(
    filters: TransactionCategoryFilters = {},
    options: {
      matchType?: "exact" | "contains";
    } = {}
  ): Promise<ApiResponse<TransactionCategoryDocument[]>> {
    try {
      const mongooseFilters: any = { ...filters };
      const { matchType = "exact" } = options;

      if (mongooseFilters.recordId) {
        mongooseFilters._id = mongooseFilters.recordId;
        delete mongooseFilters.recordId;
      }

      for (const [key, value] of Object.entries(mongooseFilters)) {
        if (matchType === "contains" && typeof value === "string") {
          mongooseFilters[key] = { $regex: value, $options: "i" };
        }
      }

      const transactionCategories = await TransactionCategoryModel.find(
        mongooseFilters
      )
        .populate({
          path: TransactionNamingScheme.PLURAL,
          select: "name",
        })
        .sort({ name: -1 });

      return {
        success: true,
        data: transactionCategories.map((record) => record.toJSON()),
      };
    } catch (error) {
      throw new DatabaseError(
          error instanceof Error
            ? error.message
          : "Failed to fetch data"
      );
    }
  }

  async updateTransactionCategory(
    recordId: string,
    data: Partial<TransactionCategoryDocument>
  ): Promise<ApiResponse<TransactionCategoryDocument>> {
    try {
      const updateData = {
        ...data
      };

      const transactionCategory =
        await TransactionCategoryModel.findByIdAndUpdate(recordId, updateData, {
          new: true,
          runValidators: true,
        });

      if (!transactionCategory) {
        throw new NotFoundError(TransactionCategoryNamingScheme.SINGULAR);
      }

      return {
        success: true,
        data: transactionCategory.toJSON(),
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

  async deleteTransactionCategory(
    recordId: string
  ): Promise<ApiResponse<boolean>> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const record = await TransactionCategoryModel.findByIdAndDelete(
        recordId,
        { session }
      );

      if (!record) {
        throw new NotFoundError(TransactionCategoryNamingScheme.SINGULAR);
      }

      // Delete associated transactions
      await TransactionModel.deleteMany({ category: recordId }, { session });

      await session.commitTransaction();
      return {
        success: true,
        data: true,
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

  async getTransactionCategoryTransactions(
    recordId: string
  ): Promise<ApiResponse<TransactionDocument[]>> {
    try {
      const category = await TransactionCategoryModel.findById(recordId);
      if (!category) {
        throw new NotFoundError(TransactionCategoryNamingScheme.SINGULAR);
      }

      const transactions = await TransactionModel.find({
        category: recordId,
      }).sort({ name: 1 });

      return {
        success: true,
        data: transactions.map((record) => record.toJSON()),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to fetch transactions"
      );
    }
  }
}
