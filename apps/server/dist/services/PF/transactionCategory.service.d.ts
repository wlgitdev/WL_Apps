import { TransactionCategoryDocument, TransactionDocument } from "../../models/PF";
import { ApiResponse, TransactionCategoryFilters } from "@wl-apps/types";
export declare class TransactionCategoryService {
    createTransactionCategory(data: Partial<TransactionCategoryDocument>): Promise<ApiResponse<TransactionCategoryDocument>>;
    getTransactionCategories(filters?: TransactionCategoryFilters, options?: {
        matchType?: "exact" | "contains";
    }): Promise<ApiResponse<TransactionCategoryDocument[]>>;
    updateTransactionCategory(recordId: string, data: Partial<TransactionCategoryDocument>): Promise<ApiResponse<TransactionCategoryDocument>>;
    deleteTransactionCategory(recordId: string): Promise<ApiResponse<boolean>>;
    getTransactionCategoryTransactions(recordId: string): Promise<ApiResponse<TransactionDocument[]>>;
}
//# sourceMappingURL=transactionCategory.service.d.ts.map