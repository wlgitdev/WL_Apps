import { BaseModel } from "../baseModel";
import { EntityNamingScheme, FilterConfig } from "../common";

export const TransactionCategoryNamingScheme: EntityNamingScheme = {
  MODEL: 'TransactionCategory',
  SINGULAR: 'Category',
  PLURAL: 'Categories'
};

export interface TransactionCategory extends BaseModel {
  name: string;
}

export type TransactionCategoryFilters = Partial<TransactionCategory>;
;

export const transactionCategoryFilterConfig: FilterConfig<TransactionCategoryFilters> = (<const>{
  recordId: { type: "string" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  name: { type: "string" }
}) satisfies FilterConfig<TransactionCategoryFilters>;
