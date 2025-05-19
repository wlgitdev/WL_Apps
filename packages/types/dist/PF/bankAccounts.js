"use strict";
// Bank Account-related types
Object.defineProperty(exports, "__esModule", { value: true });
exports.bankAccountFilterConfig = exports.BankAccountNamingScheme = void 0;
exports.BankAccountNamingScheme = {
    MODEL: 'BankAccount',
    SINGULAR: 'Account',
    PLURAL: 'Accounts'
};
exports.bankAccountFilterConfig = {
    recordId: { type: "string" },
    createdAt: { type: "date" },
    updatedAt: { type: "date" },
    name: { type: "string" },
    balance: { type: "number" },
    balanceUpdateDate: { type: "date" }
};
//# sourceMappingURL=bankAccounts.js.map