"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BankAccount_1 = require("../../models/PF/BankAccount");
const TransactionCategory_1 = require("../../models/PF/TransactionCategory");
const types_1 = require("@wl-apps/types");
const error_1 = require("../../errors/error");
class BankAccountService {
    async createBankAccount(data) {
        try {
            const bankAccount = new BankAccount_1.BankAccountModel({
                ...data
            });
            await bankAccount.save();
            return {
                success: true,
                data: bankAccount.toJSON()
            };
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new error_1.ValidationError(error.message);
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to create record');
        }
    }
    async getBankAccounts(filters = {}, options = {}) {
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
            const bankAccounts = await BankAccount_1.BankAccountModel.find(mongooseFilters)
                .populate({
                path: types_1.TransactionCategoryNamingScheme.PLURAL,
                select: 'name'
            })
                .sort({ name: -1 });
            return {
                success: true,
                data: bankAccounts.map(account => account.toJSON())
            };
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to fetch data');
        }
    }
    async updateBankAccount(recordId, data) {
        try {
            const bankAccount = await BankAccount_1.BankAccountModel.findById(recordId);
            if (!bankAccount) {
                throw new error_1.NotFoundError(types_1.BankAccountNamingScheme.SINGULAR);
            }
            Object.assign(bankAccount, data);
            // Save the document - this will trigger the pre-save middleware
            await bankAccount.save();
            return {
                success: true,
                data: bankAccount.toJSON()
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
    async deleteBankAccount(recordId) {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            // First check if bank account exists
            const bankAccount = await BankAccount_1.BankAccountModel.findById(recordId).session(session);
            if (!bankAccount) {
                throw new error_1.NotFoundError(types_1.BankAccountNamingScheme.SINGULAR);
            }
            // Check if there are any associated categories
            const hasCategories = await TransactionCategory_1.TransactionCategoryModel.exists({
                bankAccount: recordId
            }).session(session);
            if (hasCategories) {
                throw new Error(`Cannot delete ${types_1.TransactionNamingScheme.SINGULAR} with existing categories`);
            }
            await BankAccount_1.BankAccountModel.findByIdAndDelete(recordId).session(session);
            await session.commitTransaction();
            return {
                success: true,
                data: true
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
    async getBankAccountCategories(recordId) {
        try {
            const categories = await TransactionCategory_1.TransactionCategoryModel.find({
                bankAccount: recordId
            }).sort({ name: 1 });
            return {
                success: true,
                data: categories.map(category => category.toJSON())
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
                : 'Failed to fetch record category');
        }
    }
}
exports.BankAccountService = BankAccountService;
//# sourceMappingURL=bankAccount.service.js.map