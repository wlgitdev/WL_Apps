"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = exports.frequencyMap = exports.transactionSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("@wl-apps/types");
const BaseModel_1 = require("../BaseModel");
const commonValidators_1 = require("../commonValidators");
const rrule_1 = require("rrule");
exports.transactionSchema = new mongoose_1.Schema({
    ...BaseModel_1.baseModelSchema.obj,
    name: (0, commonValidators_1.createStringConfig)({
        minLength: 2,
        maxLength: 100,
        required: true
    }),
    direction: (0, commonValidators_1.createEnumConfig)({
        required: true,
        values: Object.values(types_1.TransactionDirection)
    }),
    amount: (0, commonValidators_1.createNumericConfig)({
        min: 0,
        required: true,
        default: 0
    }),
    bankAccount: (0, commonValidators_1.createReferenceConfig)({
        modelName: types_1.BankAccountNamingScheme.MODEL,
        required: true
    }),
    notes: (0, commonValidators_1.createStringConfig)({
        minLength: 0,
        maxLength: 2000,
        required: false
    }),
    recurInterval: (0, commonValidators_1.createEnumConfig)({
        required: true,
        values: Object.values(types_1.TransactionInterval)
    }),
    recurFrequency: (0, commonValidators_1.createNumericConfig)({
        min: 0,
        required: true,
        default: 0
    }),
    recurOn: (0, commonValidators_1.createNumericConfig)({
        min: 0,
        required: true,
        default: 0
    }),
    startDate: (0, commonValidators_1.createDateConfig)({
        required: true
    }),
    endDate: (0, commonValidators_1.createDateConfig)({
        required: false
    }),
    categories: (0, commonValidators_1.createArrayReferencesConfig)({
        modelName: types_1.TransactionCategoryNamingScheme.MODEL,
        required: false
    })
}, {
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
            ret.nextOccurrence = calculateNextOccurrence(ret);
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
});
exports.transactionSchema.index({ name: 1, bankAccount: 1 }, { unique: true });
exports.frequencyMap = {
    [types_1.TransactionInterval.NONRECURRING]: rrule_1.Frequency.DAILY,
    [types_1.TransactionInterval.DAILY]: rrule_1.Frequency.DAILY,
    [types_1.TransactionInterval.WEEKLY]: rrule_1.Frequency.WEEKLY,
    [types_1.TransactionInterval.MONTHLY]: rrule_1.Frequency.MONTHLY,
    [types_1.TransactionInterval.MONTHLY_ON]: rrule_1.Frequency.MONTHLY,
    [types_1.TransactionInterval.YEARLY]: rrule_1.Frequency.YEARLY
};
// Virtual field for computed nextOccurrence
exports.transactionSchema
    .virtual("nextOccurrence")
    .get(function () {
    const nextDate = calculateNextOccurrence(this);
    return nextDate instanceof Date ? nextDate : null;
});
// Function to calculate next occurrence based on recurrence rules
function calculateNextOccurrence(transaction) {
    if (transaction.recurInterval === types_1.TransactionInterval.NONRECURRING) {
        return undefined;
    }
    const baseOptions = {
        dtstart: new Date(transaction.startDate),
        until: transaction.endDate ? new Date(transaction.endDate) : undefined,
        interval: transaction.recurFrequency || 1,
        wkst: rrule_1.RRule.MO
    };
    const ruleOptions = {
        ...baseOptions,
        freq: exports.frequencyMap[transaction.recurInterval]
    };
    // Handle weekly recurrence
    if (transaction.recurInterval === types_1.TransactionInterval.WEEKLY) {
        ruleOptions.byweekday = convertRecurOnToRRule(transaction.recurOn);
    }
    // Handle monthly recurrence
    if (transaction.recurInterval === types_1.TransactionInterval.MONTHLY) {
        ruleOptions.bymonthday = getMonthlyDays(transaction.recurOn);
    }
    // Handle yearly recurrence
    if (transaction.recurInterval === types_1.TransactionInterval.YEARLY) {
        ruleOptions.bymonth = getYearlyMonths(transaction.recurOn);
        ruleOptions.bymonthday = getMonthlyDays(transaction.recurOn);
    }
    const rule = new rrule_1.RRule(ruleOptions);
    return rule.after(new Date()) || undefined;
}
// Convert recurOn bitwise flags to Weekday array
function convertRecurOnToRRule(recurOn) {
    const weekdays = [];
    if (recurOn & types_1.TransactionRecurOn.ON_MONDAY)
        weekdays.push(rrule_1.RRule.MO);
    if (recurOn & types_1.TransactionRecurOn.ON_TUESDAY)
        weekdays.push(rrule_1.RRule.TU);
    if (recurOn & types_1.TransactionRecurOn.ON_WEDNESDAY)
        weekdays.push(rrule_1.RRule.WE);
    if (recurOn & types_1.TransactionRecurOn.ON_THURSDAY)
        weekdays.push(rrule_1.RRule.TH);
    if (recurOn & types_1.TransactionRecurOn.ON_FRIDAY)
        weekdays.push(rrule_1.RRule.FR);
    if (recurOn & types_1.TransactionRecurOn.ON_SATURDAY)
        weekdays.push(rrule_1.RRule.SA);
    if (recurOn & types_1.TransactionRecurOn.ON_SUNDAY)
        weekdays.push(rrule_1.RRule.SU);
    return weekdays.length > 0 ? weekdays : [rrule_1.RRule.MO, rrule_1.RRule.TU, rrule_1.RRule.WE, rrule_1.RRule.TH, rrule_1.RRule.FR, rrule_1.RRule.SA, rrule_1.RRule.SU];
}
// Get monthly recurrence days
function getMonthlyDays(recurOn) {
    const days = [];
    for (let i = 1; i <= 31; i++) {
        const key = `ON_${i}${getOrdinalSuffix(i)}`;
        if (recurOn & types_1.TransactionRecurOn[key]) {
            days.push(i);
        }
    }
    return days.length > 0 ? days : Array.from({ length: 31 }, (_, i) => i + 1);
}
// Get yearly recurrence months
function getYearlyMonths(recurOn) {
    const months = [];
    const monthFlags = {
        [types_1.TransactionRecurOn.ON_JANUARY]: 1,
        [types_1.TransactionRecurOn.ON_FEBRUARY]: 2,
        [types_1.TransactionRecurOn.ON_MARCH]: 3,
        [types_1.TransactionRecurOn.ON_APRIL]: 4,
        [types_1.TransactionRecurOn.ON_MAY]: 5,
        [types_1.TransactionRecurOn.ON_JUNE]: 6,
        [types_1.TransactionRecurOn.ON_JULY]: 7,
        [types_1.TransactionRecurOn.ON_AUGUST]: 8,
        [types_1.TransactionRecurOn.ON_SEPTEMBER]: 9,
        [types_1.TransactionRecurOn.ON_OCTOBER]: 10,
        [types_1.TransactionRecurOn.ON_NOVEMBER]: 11,
        [types_1.TransactionRecurOn.ON_DECEMBER]: 12
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
function getOrdinalSuffix(i) {
    if (i === 1)
        return "ST";
    if (i === 2)
        return "ND";
    if (i === 3)
        return "RD";
    return "TH";
}
exports.TransactionModel = mongoose_1.default.model(types_1.TransactionNamingScheme.MODEL, exports.transactionSchema);
//# sourceMappingURL=Transaction.js.map