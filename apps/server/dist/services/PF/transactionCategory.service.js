"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionCategoryService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PF_1 = require("../../models/PF");
const types_1 = require("@wl-apps/types");
const error_1 = require("../../errors/error");
class TransactionCategoryService {
    async createTransactionCategory(data) {
        try {
            const transactionCategory = new PF_1.TransactionCategoryModel({
                ...data
            });
            await transactionCategory.save();
            return {
                success: true,
                data: transactionCategory.toJSON(),
            };
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new error_1.ValidationError(error.message);
            }
            throw new error_1.DatabaseError(error instanceof Error
                ? error.message
                : "Failed to create record");
        }
    }
    async getTransactionCategories(filters = {}, options = {}) {
        try {
            const mongooseFilters = { ...filters };
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
            const transactionCategories = await PF_1.TransactionCategoryModel.find(mongooseFilters)
                .populate({
                path: types_1.TransactionNamingScheme.PLURAL,
                select: "name",
            })
                .sort({ name: -1 });
            return {
                success: true,
                data: transactionCategories.map((record) => record.toJSON()),
            };
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error
                ? error.message
                : "Failed to fetch data");
        }
    }
    async updateTransactionCategory(recordId, data) {
        try {
            const updateData = {
                ...data
            };
            const transactionCategory = await PF_1.TransactionCategoryModel.findByIdAndUpdate(recordId, updateData, {
                new: true,
                runValidators: true,
            });
            if (!transactionCategory) {
                throw new error_1.NotFoundError(types_1.TransactionCategoryNamingScheme.SINGULAR);
            }
            return {
                success: true,
                data: transactionCategory.toJSON(),
            };
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new error_1.ValidationError(error.message);
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to update record');
        }
    }
    async deleteTransactionCategory(recordId) {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const record = await PF_1.TransactionCategoryModel.findByIdAndDelete(recordId, { session });
            if (!record) {
                throw new error_1.NotFoundError(types_1.TransactionCategoryNamingScheme.SINGULAR);
            }
            // Delete associated transactions
            await PF_1.TransactionModel.deleteMany({ category: recordId }, { session });
            await session.commitTransaction();
            return {
                success: true,
                data: true,
            };
        }
        catch (error) {
            await session.abortTransaction();
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to delete record');
        }
        finally {
            session.endSession();
        }
    }
    async getTransactionCategoryTransactions(recordId) {
        try {
            const category = await PF_1.TransactionCategoryModel.findById(recordId);
            if (!category) {
                throw new error_1.NotFoundError(types_1.TransactionCategoryNamingScheme.SINGULAR);
            }
            const transactions = await PF_1.TransactionModel.find({
                category: recordId,
            }).sort({ name: 1 });
            return {
                success: true,
                data: transactions.map((record) => record.toJSON()),
            };
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : "Failed to fetch transactions");
        }
    }
}
exports.TransactionCategoryService = TransactionCategoryService;
//# sourceMappingURL=transactionCategory.service.js.map