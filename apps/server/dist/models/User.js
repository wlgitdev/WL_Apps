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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const commonValidators_1 = require("./commonValidators");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const spotifyTokens_service_1 = require("../services/Sortify/spotifyTokens.service");
const userSchema = new mongoose_1.Schema({
    email: (0, commonValidators_1.createStringConfig)({
        minLength: 2,
        maxLength: 200,
        required: true,
        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        patternMessage: "Email address must be valid",
        context: {
            entityName: "User",
            fieldDisplayName: "User Email",
        },
    }),
    password: (0, commonValidators_1.createStringConfig)({
        minLength: 8,
        maxLength: 50,
        required: true,
        allowSelect: false,
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        patternMessage: "User Password must contain at least one letter and one number",
        context: {
            entityName: "User",
            fieldDisplayName: "User Password",
        },
    }),
    firstName: (0, commonValidators_1.createStringConfig)({
        minLength: 2,
        maxLength: 30,
        required: true,
        pattern: /^[A-Za-z\u00C0-\u017F]{2,30}(?:[-'][A-Za-z\u00C0-\u017F]+)*$/,
        patternMessage: "First name should be 2-30 characters long, can include accented letters and hyphens",
        context: {
            entityName: "User",
            fieldDisplayName: "User First Name",
        },
    }),
    lastName: (0, commonValidators_1.createStringConfig)({
        minLength: 2,
        maxLength: 30,
        required: true,
        pattern: /^[A-Za-z\u00C0-\u017F]{2,30}(?:[-'][A-Za-z\u00C0-\u017F]+)*$/,
        patternMessage: "Last name should be 2-30 characters long, can include accented letters and hyphens",
        context: {
            entityName: "User",
            fieldDisplayName: "User Last Name",
        },
    }),
    isActive: (0, commonValidators_1.createBooleanConfig)({
        required: true,
        context: {
            entityName: "User",
            fieldDisplayName: "User Is Active",
        },
    }),
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.recordId = ret._id;
            delete ret._id;
            delete ret.id;
            delete ret.__v;
            delete ret.password;
            return ret;
        },
    },
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.recordId = ret._id;
            delete ret._id;
            delete ret.id;
            delete ret.__v;
            delete ret.password;
            return ret;
        },
    },
});
// Virtual for recordId that maps to _id
userSchema.virtual('recordId').get(function () {
    return this._id;
});
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
userSchema.methods.isConnectedToSpotify = async function () {
    const spotifyTokensService = new spotifyTokens_service_1.SpotifyTokensService();
    const result = await spotifyTokensService.getSpotifyTokens({ userId: this._id.toString() });
    return result.success && result.data.length > 0;
};
// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    // Only hash password if it's modified or new
    if (!this.isModified('password'))
        return next();
    try {
        // Hash password with cost of 12
        this.password = await bcryptjs_1.default.hash(this.password.toString(), 12);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Update service queries to use _id internally
userSchema.statics.findByRecordId = function (recordId) {
    return this.findById(recordId);
};
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcryptjs_1.default.compare(candidatePassword, this.password);
};
exports.UserModel = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=User.js.map