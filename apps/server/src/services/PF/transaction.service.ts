import mongoose from 'mongoose';
import {
  TransactionModel as EntityModel,
  TransactionDocument as EntityDocument,
  frequencyMap
} from '../../models/PF/Transaction';
import {
  ApiBatchResponse,
  ApiResponse,
  BatchResult,
  BatchUpdate,
  TransactionFilters as EntityFilters,
  TransactionNamingScheme,
} from '@wl-apps/types';
import { DatabaseError, NotFoundError, ValidationError } from '../../errors/error';
import { Frequency, RRule, Weekday, Options as RRuleOptions } from 'rrule';

type RRuleOptionsWithRequired = Required<
  Pick<RRuleOptions, 'freq' | 'dtstart' | 'interval'>
> &
  Omit<RRuleOptions, 'freq' | 'dtstart' | 'interval'>;

export class TransactionService {
  async createTransaction(
    data: Partial<EntityDocument>
  ): Promise<ApiResponse<EntityDocument>> {
    try {
      const record = new EntityModel({
        ...data
      });

      await record.save();
      return {
        success: true,
        data: record.toJSON()
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(error.message);
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to create transaction'
      );
    }
  }

  async createTransactionsBatch(
    dataArray: Partial<EntityDocument>[]
  ): Promise<ApiResponse<ApiBatchResponse<EntityDocument>>> {
    const results: BatchResult<EntityDocument>[] = [];
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        for (let i = 0; i < dataArray.length; i++) {
          try {
            const record = new EntityModel({
              ...dataArray[i]
            });
            await record.save({ session });
            results.push({
              success: true,
              data: record.toJSON(),
              index: i
            });
          } catch (error) {
            results.push({
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
              index: i
            });
          }
        }
      });

      const success = results.every(result => result.success);
      const successCount = results.filter(result => result.success).length;
      const failureCount = results.length - successCount;

      return {
        success: true,
        data: {
          results,
          summary: {
            total: results.length,
            successful: successCount,
            failed: failureCount,
            completeSuccess: success
          }
        }
      };
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to create transactions batch'
      );
    } finally {
      await session.endSession();
    }
  }

  async getTransactions(
    filters: EntityFilters = {},
    options: {
      matchType?: 'exact' | 'contains';
    } = {}
  ): Promise<ApiResponse<EntityDocument[]>> {
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

      const records = await EntityModel.find(mongooseFilters).sort({
        updatedAt: -1
      });

      return {
        success: true,
        data: records.map(record => record.toJSON()) // nextOccurrence is now calculated by the model
      };
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch transactions'
      );
    }
  }

  async updateTransaction(
    recordId: string,
    data: Partial<EntityDocument>
  ): Promise<ApiResponse<EntityDocument>> {
    try {
      const updateData = {
        ...data
      };

      const record = await EntityModel.findByIdAndUpdate(recordId, updateData, {
        new: true,
        runValidators: true
      });

      if (!record) {
        throw new NotFoundError(TransactionNamingScheme.SINGULAR);
      }

      return {
        success: true,
        data: record.toJSON()
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(error.message);
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to update transaction'
      );
    }
  }

  async updateTransactionsBatch(
    updates: BatchUpdate<EntityDocument>[]
  ): Promise<ApiResponse<ApiBatchResponse<EntityDocument>>> {
    if (!Array.isArray(updates)) {
      throw new ValidationError("Updates must be an array");
    }

    const results: BatchResult<EntityDocument>[] = [];
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        for (let i = 0; i < updates.length; i++) {
          const update = updates[i];

          // Validate update object structure
          if (!update || !update.recordId || !update.data) {
            results.push({
              success: false,
              error: "Invalid update object structure",
              index: i,
            });
            continue;
          }

          try {
            const record = await EntityModel.findByIdAndUpdate(
              update.recordId,
              { ...update.data },
              {
                new: true,
                runValidators: true,
                session
              }
            );

            if (!record) {
              throw new NotFoundError(TransactionNamingScheme.SINGULAR);
            }

            results.push({
              success: true,
              data: record.toJSON(),
              index: i
            });
          } catch (error) {
            results.push({
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
              index: i
            });
          }
        }
      });

      const success = results.every(result => result.success);
      const successCount = results.filter(result => result.success).length;
      const failureCount = results.length - successCount;

      return {
        success: true,
        data: {
          results,
          summary: {
            total: results.length,
            successful: successCount,
            failed: failureCount,
            completeSuccess: success
          }
        }
      };
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to update transactions batch'
      );
    } finally {
      await session.endSession();
    }
  }

  async deleteTransaction(recordId: string): Promise<ApiResponse<boolean>> {
    try {
      const result = await EntityModel.findByIdAndDelete(recordId);

      if (!result) {
        throw new NotFoundError(TransactionNamingScheme.SINGULAR);
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to delete transaction'
      );
    }
  }

  async getTransactionsWithinRange(
    startDate: Date,
    endDate: Date,
    filters: EntityFilters = {},
    options: { matchType?: 'exact' | 'contains' } = {}
  ): Promise<ApiResponse<EntityDocument[]>> {
    try {
      const mongooseFilters: any = { ...filters, startDate: { $lte: endDate } };
      if (!mongooseFilters.endDate) {
        mongooseFilters.$or = [
          { endDate: null },
          { endDate: { $gte: startDate } }
        ];
      }
      
      const { matchType = 'exact' } = options;
      for (const [key, value] of Object.entries(mongooseFilters)) {
        if (matchType === 'contains' && typeof value === 'string') {
          mongooseFilters[key] = { $regex: value, $options: 'i' };
        }
      }
            
      const transactions = await EntityModel.find(mongooseFilters);
      
      
      const results = transactions.flatMap(transaction => {
        const rule = new RRule({
          dtstart: new Date(transaction.startDate),
          until: transaction.endDate
            ? new Date(transaction.endDate)
            : undefined,
          freq: frequencyMap[transaction.recurInterval],
          interval: transaction.recurFrequency || 1
        });
        
        return rule.between(startDate, endDate, true).map(date => ({
          ...transaction.toJSON(),
          startDate: date,
          endDate: date
        }));
      });
      
      return { success: true, data: results };
    } catch (error) {
      
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch transactions'
      );
    }
  }
}
