"use strict";
// Transaction-related types
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionFilterConfig = exports.TransactionRecurOn = exports.TransactionInterval = exports.TransactionDirection = exports.TransactionNamingScheme = void 0;
exports.TransactionNamingScheme = {
    MODEL: 'Transaction',
    SINGULAR: 'Transaction',
    PLURAL: 'Transactions'
};
var TransactionDirection;
(function (TransactionDirection) {
    TransactionDirection["Incoming"] = "incoming";
    TransactionDirection["Outgoing"] = "outgoing";
})(TransactionDirection || (exports.TransactionDirection = TransactionDirection = {}));
var TransactionInterval;
(function (TransactionInterval) {
    TransactionInterval["NONRECURRING"] = "Nonrecurring";
    TransactionInterval["DAILY"] = "Daily";
    TransactionInterval["WEEKLY"] = "Weekly";
    TransactionInterval["MONTHLY"] = "Monthly";
    TransactionInterval["MONTHLY_ON"] = "Monthly On";
    TransactionInterval["YEARLY"] = "Yearly";
})(TransactionInterval || (exports.TransactionInterval = TransactionInterval = {}));
var TransactionRecurOn;
(function (TransactionRecurOn) {
    TransactionRecurOn[TransactionRecurOn["ON_FIRST"] = 1] = "ON_FIRST";
    TransactionRecurOn[TransactionRecurOn["ON_SECOND"] = 2] = "ON_SECOND";
    TransactionRecurOn[TransactionRecurOn["ON_THIRD"] = 4] = "ON_THIRD";
    TransactionRecurOn[TransactionRecurOn["ON_FOURTH"] = 8] = "ON_FOURTH";
    TransactionRecurOn[TransactionRecurOn["ON_MONDAY"] = 16] = "ON_MONDAY";
    TransactionRecurOn[TransactionRecurOn["ON_TUESDAY"] = 32] = "ON_TUESDAY";
    TransactionRecurOn[TransactionRecurOn["ON_WEDNESDAY"] = 64] = "ON_WEDNESDAY";
    TransactionRecurOn[TransactionRecurOn["ON_THURSDAY"] = 128] = "ON_THURSDAY";
    TransactionRecurOn[TransactionRecurOn["ON_FRIDAY"] = 256] = "ON_FRIDAY";
    TransactionRecurOn[TransactionRecurOn["ON_SATURDAY"] = 512] = "ON_SATURDAY";
    TransactionRecurOn[TransactionRecurOn["ON_SUNDAY"] = 1024] = "ON_SUNDAY";
    TransactionRecurOn[TransactionRecurOn["ON_1ST"] = 2048] = "ON_1ST";
    TransactionRecurOn[TransactionRecurOn["ON_2ND"] = 4096] = "ON_2ND";
    TransactionRecurOn[TransactionRecurOn["ON_3RD"] = 8192] = "ON_3RD";
    TransactionRecurOn[TransactionRecurOn["ON_4TH"] = 16384] = "ON_4TH";
    TransactionRecurOn[TransactionRecurOn["ON_5TH"] = 32768] = "ON_5TH";
    TransactionRecurOn[TransactionRecurOn["ON_6TH"] = 65536] = "ON_6TH";
    TransactionRecurOn[TransactionRecurOn["ON_7TH"] = 131072] = "ON_7TH";
    TransactionRecurOn[TransactionRecurOn["ON_8TH"] = 262144] = "ON_8TH";
    TransactionRecurOn[TransactionRecurOn["ON_9TH"] = 524288] = "ON_9TH";
    TransactionRecurOn[TransactionRecurOn["ON_10TH"] = 1048576] = "ON_10TH";
    TransactionRecurOn[TransactionRecurOn["ON_11TH"] = 2097152] = "ON_11TH";
    TransactionRecurOn[TransactionRecurOn["ON_12TH"] = 4194304] = "ON_12TH";
    TransactionRecurOn[TransactionRecurOn["ON_13TH"] = 8388608] = "ON_13TH";
    TransactionRecurOn[TransactionRecurOn["ON_14TH"] = 16777216] = "ON_14TH";
    TransactionRecurOn[TransactionRecurOn["ON_15TH"] = 33554432] = "ON_15TH";
    TransactionRecurOn[TransactionRecurOn["ON_16TH"] = 67108864] = "ON_16TH";
    TransactionRecurOn[TransactionRecurOn["ON_17TH"] = 134217728] = "ON_17TH";
    TransactionRecurOn[TransactionRecurOn["ON_18TH"] = 268435456] = "ON_18TH";
    TransactionRecurOn[TransactionRecurOn["ON_19TH"] = 536870912] = "ON_19TH";
    TransactionRecurOn[TransactionRecurOn["ON_20TH"] = 1073741824] = "ON_20TH";
    TransactionRecurOn[TransactionRecurOn["ON_21ST"] = 2147483648] = "ON_21ST";
    TransactionRecurOn[TransactionRecurOn["ON_22ND"] = 4294967296] = "ON_22ND";
    TransactionRecurOn[TransactionRecurOn["ON_23RD"] = 8589934592] = "ON_23RD";
    TransactionRecurOn[TransactionRecurOn["ON_24TH"] = 17179869184] = "ON_24TH";
    TransactionRecurOn[TransactionRecurOn["ON_25TH"] = 34359738368] = "ON_25TH";
    TransactionRecurOn[TransactionRecurOn["ON_26TH"] = 68719476736] = "ON_26TH";
    TransactionRecurOn[TransactionRecurOn["ON_27TH"] = 137438953472] = "ON_27TH";
    TransactionRecurOn[TransactionRecurOn["ON_28TH"] = 274877906944] = "ON_28TH";
    TransactionRecurOn[TransactionRecurOn["ON_29TH"] = 549755813888] = "ON_29TH";
    TransactionRecurOn[TransactionRecurOn["ON_30TH"] = 1099511627776] = "ON_30TH";
    TransactionRecurOn[TransactionRecurOn["ON_31ST"] = 2199023255552] = "ON_31ST";
    TransactionRecurOn[TransactionRecurOn["ON_LASTDOM"] = 4398046511104] = "ON_LASTDOM";
    TransactionRecurOn[TransactionRecurOn["ON_JANUARY"] = 8796093022208] = "ON_JANUARY";
    TransactionRecurOn[TransactionRecurOn["ON_FEBRUARY"] = 17592186044416] = "ON_FEBRUARY";
    TransactionRecurOn[TransactionRecurOn["ON_MARCH"] = 35184372088832] = "ON_MARCH";
    TransactionRecurOn[TransactionRecurOn["ON_APRIL"] = 70368744177664] = "ON_APRIL";
    TransactionRecurOn[TransactionRecurOn["ON_MAY"] = 140737488355328] = "ON_MAY";
    TransactionRecurOn[TransactionRecurOn["ON_JUNE"] = 281474976710656] = "ON_JUNE";
    TransactionRecurOn[TransactionRecurOn["ON_JULY"] = 562949953421312] = "ON_JULY";
    TransactionRecurOn[TransactionRecurOn["ON_AUGUST"] = 1125899906842624] = "ON_AUGUST";
    TransactionRecurOn[TransactionRecurOn["ON_SEPTEMBER"] = 2251799813685248] = "ON_SEPTEMBER";
    TransactionRecurOn[TransactionRecurOn["ON_OCTOBER"] = 4503599627370496] = "ON_OCTOBER";
    TransactionRecurOn[TransactionRecurOn["ON_NOVEMBER"] = 9007199254740992] = "ON_NOVEMBER";
    TransactionRecurOn[TransactionRecurOn["ON_DECEMBER"] = 18014398509481984] = "ON_DECEMBER";
})(TransactionRecurOn || (exports.TransactionRecurOn = TransactionRecurOn = {}));
exports.transactionFilterConfig = {
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
};
//# sourceMappingURL=transaction.js.map