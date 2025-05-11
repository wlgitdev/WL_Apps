import mongoose from "mongoose";
import { BankAccountModel } from "../../models/PF/BankAccount";
import { TransactionDocument, TransactionModel } from "../../models/PF/Transaction";
import {
  ApiResponse,
  TransactionForecast,
  ForecastRequest,
  TransactionDirection,
  BankAccountNamingScheme
} from "@wl-apps/types";
import { DatabaseError, NotFoundError, ValidationError } from "../../errors/error";
import { TransactionService } from "./transaction.service";

export class ForecastService {
  private transactionService = new TransactionService();

  async generateForecast(
    request: ForecastRequest
  ): Promise<ApiResponse<TransactionForecast[]>> {
    try {
      const bankAccount = await BankAccountModel.findById(
        new mongoose.Types.ObjectId(request.bankAccountId)
      );

      if (!bankAccount) {
        throw new NotFoundError(BankAccountNamingScheme.SINGULAR);
      }

      if (!request.startDate || !request.endDate) {
        throw new ValidationError("Start date and end date are required");
      }
      
      // Fetch transactions directly using the transaction service
      const transactionsResponse = await this.transactionService.getTransactionsWithinRange(
        request.startDate,
        request.endDate,
        { bankAccount: request.bankAccountId } // Filter by bank account
      );

      if (!transactionsResponse.success) {
        throw new DatabaseError("Failed to fetch transactions");
      }

      const transactions = transactionsResponse.data;
      
      // Calculate forecast data
      const forecastData = this.calculateForecastPoints(
        bankAccount.balance,
        transactions,
        request.startDate,
        request.endDate
      );
      return {
        success: true,
        data: forecastData
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to generate forecast"
      );
    }
  }

  private calculateForecastPoints(
    startingBalance: number,
    transactions: TransactionDocument[],
    startDate: Date,
    endDate: Date
  ): TransactionForecast[] {
    const points: TransactionForecast[] = [];
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
        const amount =
          txn.direction === TransactionDirection.Incoming
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