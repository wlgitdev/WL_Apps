// Bank Account-related types

import { BaseModel, EntityNamingScheme, FilterConfig, TransactionDirection } from "../index";

export const BankAccountNamingScheme: EntityNamingScheme = {
  MODEL: 'BankAccount',
  SINGULAR: 'Account',
  PLURAL: 'Accounts'
};

export interface BankAccount extends BaseModel {
  name: string;
  balance: number;
  balanceUpdateDate: Date;
}

export type BankAccountFilters = Partial<BankAccount>;

export const bankAccountFilterConfig: FilterConfig<BankAccountFilters> = (<const>{
  recordId: { type: "string" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  name: { type: "string" },
  balance: { type: "number" },
  balanceUpdateDate: { type: "date" }
}) satisfies FilterConfig<BankAccountFilters>;

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