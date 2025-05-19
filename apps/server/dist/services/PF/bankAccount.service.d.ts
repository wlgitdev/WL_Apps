import { BankAccountDocument } from '../../models/PF/BankAccount';
import { TransactionCategoryDocument } from '../../models/PF/TransactionCategory';
import { ApiResponse, BankAccountFilters } from '@wl-apps/types';
export declare class BankAccountService {
    createBankAccount(data: Partial<BankAccountDocument>): Promise<ApiResponse<BankAccountDocument>>;
    getBankAccounts(filters?: BankAccountFilters, options?: {
        matchType?: 'exact' | 'contains';
    }): Promise<ApiResponse<BankAccountDocument[]>>;
    updateBankAccount(recordId: string, data: Partial<BankAccountDocument>): Promise<ApiResponse<BankAccountDocument>>;
    deleteBankAccount(recordId: string): Promise<ApiResponse<boolean>>;
    getBankAccountCategories(recordId: string): Promise<ApiResponse<TransactionCategoryDocument[]>>;
}
//# sourceMappingURL=bankAccount.service.d.ts.map