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
exports.BankAccountModel = exports.bankAccountSchema = void 0;
// BankAccount.ts
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("@wl-apps/types");
const BaseModel_1 = require("../BaseModel");
const commonValidators_1 = require("../commonValidators");
const Transaction_1 = require("./Transaction");
exports.bankAccountSchema = new mongoose_1.Schema({
    ...BaseModel_1.baseModelSchema.obj,
    name: (0, commonValidators_1.createStringConfig)({
        minLength: 2,
        maxLength: 100,
        required: true,
        pattern: /^[^\p{C}]+$/u
    }),
    balance: (0, commonValidators_1.createNumericConfig)({
        required: true,
        default: 0
    }),
    balanceUpdateDate: (0, commonValidators_1.createDateConfig)({})
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (_doc, ret) {
            ret.recordId = ret._id;
            delete ret._id;
            delete ret.id;
            delete ret.__v;
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
exports.bankAccountSchema.virtual(types_1.TransactionCategoryNamingScheme.PLURAL, {
    ref: types_1.TransactionCategoryNamingScheme.MODEL,
    localField: '_id',
    foreignField: types_1.BankAccountNamingScheme.MODEL,
    options: { sort: { name: 1 } }
});
// Pre-save middleware (handles document saves)
exports.bankAccountSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("balance")) {
        this.balanceUpdateDate = new Date();
    }
    next();
});
exports.bankAccountSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    const update = this.getUpdate();
    // Check if balance is being modified in this update
    if (update?.balance !== undefined || update?.$set?.balance !== undefined) {
        if (!update.$set)
            update.$set = {};
        update.$set.balanceUpdateDate = new Date();
    }
    next();
});
// Prevent deletion if referenced by transactions
exports.bankAccountSchema.pre(['deleteOne', 'findOneAndDelete'], async function (next) {
    const query = this.getFilter();
    const count = await Transaction_1.TransactionModel.countDocuments({ bankAccount: query._id });
    if (count > 0) {
        return next(new Error(`Cannot delete ${types_1.BankAccountNamingScheme.SINGULAR}: it is referenced by one or more ${types_1.TransactionNamingScheme.PLURAL}.`));
    }
    next();
});
exports.BankAccountModel = mongoose_1.default.model(types_1.BankAccountNamingScheme.MODEL, exports.bankAccountSchema);
//# sourceMappingURL=BankAccount.js.map