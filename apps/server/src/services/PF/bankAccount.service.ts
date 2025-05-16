import mongoose from 'mongoose';
import { BankAccountModel, BankAccountDocument } from '../../models/PF/BankAccount';
import {
  TransactionCategoryModel,
  TransactionCategoryDocument
} from '../../models/PF/TransactionCategory';
import { ApiResponse, BankAccountFilters, BankAccountNamingScheme, TransactionCategoryNamingScheme, TransactionNamingScheme } from '@wl-apps/types';
import { DatabaseError, NotFoundError, ValidationError } from '../../errors/error';

export class BankAccountService {
  async createBankAccount(
    data: Partial<BankAccountDocument>
  ): Promise<ApiResponse<BankAccountDocument>> {
    try {
      const bankAccount = new BankAccountModel({
        ...data
      });

      await bankAccount.save();
      return {
        success: true,
        data: bankAccount.toJSON()
      };
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(error.message);
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to create record'
      );
    }
  }

  async getBankAccounts(
    filters: BankAccountFilters = {},
    options: {
      matchType?: 'exact' | 'contains';
    } = {}
  ): Promise<ApiResponse<BankAccountDocument[]>> {
    try {
      const mongooseFilters: any = { ...filters };
      const { matchType = 'exact' } = options;

      if (mongooseFilters.recordId) {
        mongooseFilters._id = mongooseFilters.recordId;
        delete mongooseFilters.recordId;
      }

      for (const [key, value] of Object.entries(mongooseFilters)) {
        if (matchType === 'contains' && typeof value === 'string') {
          mongooseFilters[key] = { $regex: value, $options: 'i' };
        }
      }

      const bankAccounts = await BankAccountModel.find(mongooseFilters)
        .populate({
          path: TransactionCategoryNamingScheme.PLURAL,
          select: 'name'
        })
        .sort({ name: -1 });

      return {
        success: true,
        data: bankAccounts.map(account => account.toJSON())
      };
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch data'
      );
    }
  }

  async updateBankAccount(
    recordId: string,
    data: Partial<BankAccountDocument>
  ): Promise<ApiResponse<BankAccountDocument>> {
    try {
      const bankAccount = await BankAccountModel.findById(recordId);

      if (!bankAccount) {
        throw new NotFoundError(BankAccountNamingScheme.SINGULAR);
      }

      Object.assign(bankAccount, data);

      // Save the document - this will trigger the pre-save middleware
      await bankAccount.save();

      return {
        success: true,
        data: bankAccount.toJSON()
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

  async deleteBankAccount(recordId: string): Promise<ApiResponse<boolean>> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // First check if bank account exists
      const bankAccount = await BankAccountModel.findById(recordId).session(session);
      
      if (!bankAccount) {
        throw new NotFoundError(BankAccountNamingScheme.SINGULAR);
      }

      // Check if there are any associated categories
      const hasCategories = await TransactionCategoryModel.exists({
        bankAccount: recordId 
      }).session(session);

      if (hasCategories) {
        throw new Error(`Cannot delete ${TransactionNamingScheme.SINGULAR} with existing categories`);
      }

      await BankAccountModel.findByIdAndDelete(recordId).session(session);

      await session.commitTransaction();
      return {
        success: true,
        data: true
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

  async getBankAccountCategories(
    recordId: string
  ): Promise<ApiResponse<TransactionCategoryDocument[]>> {
    try {
      const categories = await TransactionCategoryModel.find({
        bankAccount: recordId
      }).sort({ name: 1 });

      return {
        success: true,
        data: categories.map(category => category.toJSON())
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
          : 'Failed to fetch record category'
      );
    }
  }
}
