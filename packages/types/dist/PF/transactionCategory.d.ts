import { BaseModel } from "../baseModel";
import { EntityNamingScheme, FilterConfig } from "../common";
export declare const TransactionCategoryNamingScheme: EntityNamingScheme;
export interface TransactionCategory extends BaseModel {
    name: string;
}
export type TransactionCategoryFilters = Partial<TransactionCategory>;
export declare const transactionCategoryFilterConfig: FilterConfig<TransactionCategoryFilters>;
//# sourceMappingURL=transactionCategory.d.ts.map