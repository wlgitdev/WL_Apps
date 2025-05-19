"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForecastService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BankAccount_1 = require("../../models/PF/BankAccount");
const types_1 = require("@wl-apps/types");
const error_1 = require("../../errors/error");
const transaction_service_1 = require("./transaction.service");
class ForecastService {
    constructor() {
        this.transactionService = new transaction_service_1.TransactionService();
    }
    async generateForecast(request) {
        try {
            const bankAccount = await BankAccount_1.BankAccountModel.findById(new mongoose_1.default.Types.ObjectId(request.bankAccountId));
            if (!bankAccount) {
                throw new error_1.NotFoundError(types_1.BankAccountNamingScheme.SINGULAR);
            }
            if (!request.startDate || !request.endDate) {
                throw new error_1.ValidationError("Start date and end date are required");
            }
            // Fetch transactions directly using the transaction service
            const transactionsResponse = await this.transactionService.getTransactionsWithinRange(request.startDate, request.endDate, { bankAccount: request.bankAccountId } // Filter by bank account
            );
            if (!transactionsResponse.success) {
                throw new error_1.DatabaseError("Failed to fetch transactions");
            }
            const transactions = transactionsResponse.data;
            // Calculate forecast data
            const forecastData = this.calculateForecastPoints(bankAccount.balance, transactions, request.startDate, request.endDate);
            return {
                success: true,
                data: forecastData
            };
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError || error instanceof error_1.ValidationError) {
                throw error;
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : "Failed to generate forecast");
        }
    }
    calculateForecastPoints(startingBalance, transactions, startDate, endDate) {
        const points = [];
        let currentBalance = startingBalance;
        // create date objects without time components for comparison
        const start = new Date(startDate.toDateString());
        const end = new Date(endDate.toDateString());
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const currentDate = new Date(d);
            const todaysTransactions = transactions.filter(txn => {
                const txnDate = new Date(txn.startDate);
                return txnDate.toDateString() === currentDate.toDateString();
            });
            // Adjust balance based on transactions
            todaysTransactions.forEach(txn => {
                const amount = txn.direction === types_1.TransactionDirection.Incoming
                    ? txn.amount
                    : -txn.amount;
                currentBalance += amount;
            });
            // Add forecast point
            points.push({
                date: new Date(currentDate),
                balance: currentBalance,
                transactions: todaysTransactions.map(txn => ({
                    name: txn.name,
                    amount: txn.amount,
                    direction: txn.direction
                }))
            });
        }
        return points;
    }
}
exports.ForecastService = ForecastService;
//# sourceMappingURL=forecast.service.js.map