// Transaction-related types

import { BaseModel, EntityNamingScheme, FilterConfig } from "../index";

export const TransactionNamingScheme: EntityNamingScheme = {
  MODEL: 'Transaction',
  SINGULAR: 'Transaction',
  PLURAL: 'Transactions'
};

export enum TransactionDirection {
  Incoming = "incoming",
  Outgoing = "outgoing",
}

export enum TransactionInterval {
  NONRECURRING = 'Nonrecurring',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  MONTHLY_ON = 'Monthly On',
  YEARLY = 'Yearly'
}

export enum TransactionRecurOn {
  ON_FIRST = 1,
  ON_SECOND = 2,
  ON_THIRD = 4,
  ON_FOURTH = 8,
  ON_MONDAY = 16,
  ON_TUESDAY = 32,
  ON_WEDNESDAY = 64,
  ON_THURSDAY = 128,
  ON_FRIDAY = 256,
  ON_SATURDAY = 512,
  ON_SUNDAY = 1024,
  ON_1ST = 2048,
  ON_2ND = 4096,
  ON_3RD = 8192,
  ON_4TH = 16384,
  ON_5TH = 32768,
  ON_6TH = 65536,
  ON_7TH = 131072,
  ON_8TH = 262144,
  ON_9TH = 524288,
  ON_10TH = 1048576,
  ON_11TH = 2097152,
  ON_12TH = 4194304,
  ON_13TH = 8388608,
  ON_14TH = 16777216,
  ON_15TH = 33554432,
  ON_16TH = 67108864,
  ON_17TH = 134217728,
  ON_18TH = 268435456,
  ON_19TH = 536870912,
  ON_20TH = 1073741824,
  ON_21ST = 2147483648,
  ON_22ND = 4294967296,
  ON_23RD = 8589934592,
  ON_24TH = 17179869184,
  ON_25TH = 34359738368,
  ON_26TH = 68719476736,
  ON_27TH = 137438953472,
  ON_28TH = 274877906944,
  ON_29TH = 549755813888,
  ON_30TH = 1099511627776,
  ON_31ST = 2199023255552,
  ON_LASTDOM = 4398046511104,
  ON_JANUARY = 8796093022208,
  ON_FEBRUARY = 17592186044416,
  ON_MARCH = 35184372088832,
  ON_APRIL = 70368744177664,
  ON_MAY = 140737488355328,
  ON_JUNE = 281474976710656,
  ON_JULY = 562949953421312,
  ON_AUGUST = 1125899906842624,
  ON_SEPTEMBER = 2251799813685248,
  ON_OCTOBER = 4503599627370496,
  ON_NOVEMBER = 9007199254740992,
  ON_DECEMBER = 18014398509481984
}
export type RecurOnGroupKey =
  | 'daysOfWeek'
  | 'daysOfMonth'
  | 'months'
  | 'weekOccurrence';
  
export interface Transaction extends BaseModel {
  name: string;
  bankAccount: string; // Reference to BankAccount
  direction: TransactionDirection;
  amount: number;
  notes?: string;
  startDate: Date;
  endDate?: Date;
  recurInterval: TransactionInterval;
  recurFrequency: number;
  recurOn: number;
  nextOccurrence?: Date;
}

export type TransactionFilters = Partial<Transaction>;


export const transactionFilterConfig: FilterConfig<TransactionFilters> = (<const>{
  recordId: { type: 'string' },
  createdAt: { type: 'date' },
  updatedAt: { type: 'date' },
  name: { type: 'string' },
  bankAccount: { type: 'string' },
  direction: { type: 'string' },
  amount: { type: 'number' },
  recurOn: { type: 'number' },
  recurFrequency: { type: 'number' },
  recurInterval: { type: 'string' },
  startDate: { type: 'date' },
  endDate: { type: 'date' },
  nextOccurrence: { type: 'date' },
  notes: { type: 'string' }
}) satisfies FilterConfig<TransactionFilters>;
