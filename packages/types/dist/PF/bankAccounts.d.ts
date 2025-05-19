import { BaseModel, EntityNamingScheme, FilterConfig, TransactionDirection } from "../index";
export declare const BankAccountNamingScheme: EntityNamingScheme;
export interface BankAccount extends BaseModel {
    name: string;
    balance: number;
    balanceUpdateDate: Date;
}
export type BankAccountFilters = Partial<BankAccount>;
export declare const bankAccountFilterConfig: FilterConfig<BankAccountFilters>;
export interface TransactionForecast {
    date: Date;
    balance: number;
    transactions?: Array<{
        name: string;
        amount: number;
        direction: TransactionDirection;
    }>;
}
export interface ForecastRequest {
    bankAccountId: string;
    startDate: Date;
    endDate: Date;
}
//# sourceMappingURL=bankAccounts.d.ts.map