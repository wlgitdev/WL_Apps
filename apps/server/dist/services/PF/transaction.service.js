"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Transaction_1 = require("../../models/PF/Transaction");
const types_1 = require("@wl-apps/types");
const error_1 = require("../../errors/error");
const rrule_1 = require("rrule");
class TransactionService {
    async createTransaction(data) {
        try {
            const record = new Transaction_1.TransactionModel({
                ...data
            });
            await record.save();
            return {
                success: true,
                data: record.toJSON()
            };
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new error_1.ValidationError(error.message);
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to create transaction');
        }
    }
    async createTransactionsBatch(dataArray) {
        const results = [];
        const session = await mongoose_1.default.startSession();
        try {
            await session.withTransaction(async () => {
                for (let i = 0; i < dataArray.length; i++) {
                    try {
                        const record = new Transaction_1.TransactionModel({
                            ...dataArray[i]
                        });
                        await record.save({ session });
                        results.push({
                            success: true,
                            data: record.toJSON(),
                            index: i
                        });
                    }
                    catch (error) {
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
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to create transactions batch');
        }
        finally {
            await session.endSession();
        }
    }
    async getTransactions(filters = {}, options = {}) {
        try {
            const mongooseFilters = { ...filters };
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
            const records = await Transaction_1.TransactionModel.find(mongooseFilters).sort({
                updatedAt: -1
            });
            return {
                success: true,
                data: records.map(record => record.toJSON()) // nextOccurrence is now calculated by the model
            };
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to fetch transactions');
        }
    }
    async updateTransaction(recordId, data) {
        try {
            const updateData = {
                ...data
            };
            const record = await Transaction_1.TransactionModel.findByIdAndUpdate(recordId, updateData, {
                new: true,
                runValidators: true
            });
            if (!record) {
                throw new error_1.NotFoundError(types_1.TransactionNamingScheme.SINGULAR);
            }
            return {
                success: true,
                data: record.toJSON()
            };
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new error_1.ValidationError(error.message);
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to update transaction');
        }
    }
    async updateTransactionsBatch(updates) {
        if (!Array.isArray(updates)) {
            throw new error_1.ValidationError("Updates must be an array");
        }
        const results = [];
        const session = await mongoose_1.default.startSession();
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
                        const record = await Transaction_1.TransactionModel.findByIdAndUpdate(update.recordId, { ...update.data }, {
                            new: true,
                            runValidators: true,
                            session
                        });
                        if (!record) {
                            throw new error_1.NotFoundError(types_1.TransactionNamingScheme.SINGULAR);
                        }
                        results.push({
                            success: true,
                            data: record.toJSON(),
                            index: i
                        });
                    }
                    catch (error) {
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
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to update transactions batch');
        }
        finally {
            await session.endSession();
        }
    }
    async deleteTransaction(recordId) {
        try {
            const result = await Transaction_1.TransactionModel.findByIdAndDelete(recordId);
            if (!result) {
                throw new error_1.NotFoundError(types_1.TransactionNamingScheme.SINGULAR);
            }
            return {
                success: true,
                data: true
            };
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to delete transaction');
        }
    }
    async getTransactionsWithinRange(startDate, endDate, filters = {}, options = {}) {
        try {
            const mongooseFilters = { ...filters, startDate: { $lte: endDate } };
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
            const transactions = await Transaction_1.TransactionModel.find(mongooseFilters);
            const results = transactions.flatMap(transaction => {
                const rule = new rrule_1.RRule({
                    dtstart: new Date(transaction.startDate),
                    until: transaction.endDate
                        ? new Date(transaction.endDate)
                        : undefined,
                    freq: Transaction_1.frequencyMap[transaction.recurInterval],
                    interval: transaction.recurFrequency || 1
                });
                return rule.between(startDate, endDate, true).map(date => ({
                    ...transaction.toJSON(),
                    startDate: date,
                    endDate: date
                }));
            });
            return { success: true, data: results };
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to fetch transactions');
        }
    }
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map