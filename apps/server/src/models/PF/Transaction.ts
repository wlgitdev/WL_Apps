import mongoose, { Schema, Document } from "mongoose";
import {
  BankAccountNamingScheme,
  Transaction,
  TransactionCategoryNamingScheme,
  TransactionDirection,
  TransactionInterval,
  TransactionNamingScheme,
  TransactionRecurOn
} from '@wl-apps/types';
import { baseModelSchema } from '../BaseModel';
import {
  createStringConfig,
  createNumericConfig,
  createDateConfig,
  createEnumConfig,
  createReferenceConfig,
  createArrayReferencesConfig
} from "../commonValidators";
import { RRule, Frequency, Weekday } from "rrule";

export interface TransactionDocument extends Transaction, Document {}

export const transactionSchema = new Schema(
  {
    ...baseModelSchema.obj,
    name: createStringConfig({
      minLength: 2,
      maxLength: 100,
      required: true
    }),
    direction: createEnumConfig({
      required: true,
      values: Object.values(TransactionDirection)
    }),
    amount: createNumericConfig({
      min: 0,
      required: true,
      default: 0
    }),
    bankAccount: createReferenceConfig({
      modelName: BankAccountNamingScheme.MODEL,
      required: true
    }),
    notes: createStringConfig({
      minLength: 0,
      maxLength: 2000,
      required: false
    }),
    recurInterval: createEnumConfig({
      required: true,
      values: Object.values(TransactionInterval)
    }),
    recurFrequency: createNumericConfig({
      min: 0,
      required: true,
      default: 0
    }),
    recurOn: createNumericConfig({
      min: 0,
      required: true,
      default: 0
    }),
    startDate: createDateConfig({
      required: true
    }),
    endDate: createDateConfig({
      required: false
    }),
    categories: createArrayReferencesConfig({
      modelName: TransactionCategoryNamingScheme.MODEL,
      required: false
    })
  },
  {
    indexes: [
      { name: 1 },
      { direction: 1 },
      { name: 1, bankAccount: 1, unique: true }
    ],
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.recordId = ret._id;
        delete ret._id;
        delete ret.id;
        delete ret.__v;
        ret.nextOccurrence = calculateNextOccurrence(ret as Transaction);
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.recordId = ret._id;
        delete ret._id;
        delete ret.id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

transactionSchema.index({ name: 1, bankAccount: 1 }, { unique: true });

export const frequencyMap: Record<TransactionInterval, Frequency> = {
  [TransactionInterval.NONRECURRING]: Frequency.DAILY,
  [TransactionInterval.DAILY]: Frequency.DAILY,
  [TransactionInterval.WEEKLY]: Frequency.WEEKLY,
  [TransactionInterval.MONTHLY]: Frequency.MONTHLY,
  [TransactionInterval.MONTHLY_ON]: Frequency.MONTHLY,
  [TransactionInterval.YEARLY]: Frequency.YEARLY
};

// Virtual field for computed nextOccurrence
transactionSchema
  .virtual("nextOccurrence")
  .get(function (this: TransactionDocument) {
    const nextDate = calculateNextOccurrence(this);
    return nextDate instanceof Date ? nextDate : null as Date | null;
});

// Function to calculate next occurrence based on recurrence rules
function calculateNextOccurrence(transaction: Transaction): Date | undefined {
  if (transaction.recurInterval === TransactionInterval.NONRECURRING) {
    return undefined;
  }

  const baseOptions = {
    dtstart: new Date(transaction.startDate),
    until: transaction.endDate ? new Date(transaction.endDate) : undefined,
    interval: transaction.recurFrequency || 1,
    wkst: RRule.MO
  };

  const ruleOptions: any = {
    ...baseOptions,
    freq: frequencyMap[transaction.recurInterval]
  };

  // Handle weekly recurrence
  if (transaction.recurInterval === TransactionInterval.WEEKLY) {
    ruleOptions.byweekday = convertRecurOnToRRule(transaction.recurOn);
  }

  // Handle monthly recurrence
  if (transaction.recurInterval === TransactionInterval.MONTHLY) {
    ruleOptions.bymonthday = getMonthlyDays(transaction.recurOn);
  }

  // Handle yearly recurrence
  if (transaction.recurInterval === TransactionInterval.YEARLY) {
    ruleOptions.bymonth = getYearlyMonths(transaction.recurOn);
    ruleOptions.bymonthday = getMonthlyDays(transaction.recurOn);
  }

  const rule = new RRule(ruleOptions);
  return rule.after(new Date()) || undefined;
}

// Convert recurOn bitwise flags to Weekday array
function convertRecurOnToRRule(recurOn: number): Weekday[] {
  const weekdays: Weekday[] = [];

  if (recurOn & TransactionRecurOn.ON_MONDAY) weekdays.push(RRule.MO);
  if (recurOn & TransactionRecurOn.ON_TUESDAY) weekdays.push(RRule.TU);
  if (recurOn & TransactionRecurOn.ON_WEDNESDAY) weekdays.push(RRule.WE);
  if (recurOn & TransactionRecurOn.ON_THURSDAY) weekdays.push(RRule.TH);
  if (recurOn & TransactionRecurOn.ON_FRIDAY) weekdays.push(RRule.FR);
  if (recurOn & TransactionRecurOn.ON_SATURDAY) weekdays.push(RRule.SA);
  if (recurOn & TransactionRecurOn.ON_SUNDAY) weekdays.push(RRule.SU);

  return weekdays.length > 0 ? weekdays : [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA, RRule.SU];
}

// Get monthly recurrence days
function getMonthlyDays(recurOn: number): number[] {
  const days: number[] = [];
  for (let i = 1; i <= 31; i++) {
    const key = `ON_${i}${getOrdinalSuffix(i)}` as keyof typeof TransactionRecurOn;
    if (recurOn & TransactionRecurOn[key]) {
      days.push(i);
    }
  }
  return days.length > 0 ? days : Array.from({ length: 31 }, (_, i) => i + 1);
}

// Get yearly recurrence months
function getYearlyMonths(recurOn: number): number[] {
  const months: number[] = [];
  const monthFlags = {
    [TransactionRecurOn.ON_JANUARY]: 1,
    [TransactionRecurOn.ON_FEBRUARY]: 2,
    [TransactionRecurOn.ON_MARCH]: 3,
    [TransactionRecurOn.ON_APRIL]: 4,
    [TransactionRecurOn.ON_MAY]: 5,
    [TransactionRecurOn.ON_JUNE]: 6,
    [TransactionRecurOn.ON_JULY]: 7,
    [TransactionRecurOn.ON_AUGUST]: 8,
    [TransactionRecurOn.ON_SEPTEMBER]: 9,
    [TransactionRecurOn.ON_OCTOBER]: 10,
    [TransactionRecurOn.ON_NOVEMBER]: 11,
    [TransactionRecurOn.ON_DECEMBER]: 12
  };

  Object.entries(monthFlags).forEach(([flagStr, month]) => {
    const flag = parseInt(flagStr);
    if (recurOn & flag) {
      months.push(month);
    }
  });

  return months.length > 0 ? months : Array.from({ length: 12 }, (_, i) => i + 1);
}

// Helper function for ordinal suffixes
function getOrdinalSuffix(i: number): string {
  if (i === 1) return "ST";
  if (i === 2) return "ND";
  if (i === 3) return "RD";
  return "TH";
}

export const TransactionModel = mongoose.model<TransactionDocument>(
  TransactionNamingScheme.MODEL,
  transactionSchema
);
