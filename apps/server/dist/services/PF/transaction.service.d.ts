import { TransactionDocument as EntityDocument } from '../../models/PF/Transaction';
import { ApiBatchResponse, ApiResponse, BatchUpdate, TransactionFilters as EntityFilters } from '@wl-apps/types';
export declare class TransactionService {
    createTransaction(data: Partial<EntityDocument>): Promise<ApiResponse<EntityDocument>>;
    createTransactionsBatch(dataArray: Partial<EntityDocument>[]): Promise<ApiResponse<ApiBatchResponse<EntityDocument>>>;
    getTransactions(filters?: EntityFilters, options?: {
        matchType?: 'exact' | 'contains';
    }): Promise<ApiResponse<EntityDocument[]>>;
    updateTransaction(recordId: string, data: Partial<EntityDocument>): Promise<ApiResponse<EntityDocument>>;
    updateTransactionsBatch(updates: BatchUpdate<EntityDocument>[]): Promise<ApiResponse<ApiBatchResponse<EntityDocument>>>;
    deleteTransaction(recordId: string): Promise<ApiResponse<boolean>>;
    getTransactionsWithinRange(startDate: Date, endDate: Date, filters?: EntityFilters, options?: {
        matchType?: 'exact' | 'contains';
    }): Promise<ApiResponse<EntityDocument[]>>;
}
//# sourceMappingURL=transaction.service.d.ts.map