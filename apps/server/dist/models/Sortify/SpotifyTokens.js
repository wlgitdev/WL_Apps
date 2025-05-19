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
exports.SpotifyTokensModel = exports.spotifyTokensSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("@wl-apps/types");
const BaseModel_1 = require("../BaseModel");
const commonValidators_1 = require("../commonValidators");
const types_2 = require("@wl-apps/types");
exports.spotifyTokensSchema = new mongoose_1.Schema({
    ...BaseModel_1.baseModelSchema.obj,
    encryptedAccessToken: (0, commonValidators_1.createStringConfig)({
        required: true,
    }),
    encryptedRefreshToken: (0, commonValidators_1.createStringConfig)({
        required: true,
    }),
    userId: (0, commonValidators_1.createReferenceConfig)({
        required: true,
        modelName: types_1.UserNamingScheme.MODEL,
    }),
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (_doc, ret) {
            ret.recordId = ret._id;
            delete ret._id;
            delete ret.id;
            delete ret.__v;
            delete ret.encryptedAccessToken;
            delete ret.encryptedRefreshToken;
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
            delete ret.encryptedAccessToken;
            delete ret.encryptedRefreshToken;
            return ret;
        }
    }
});
// Create an index on userId for better query performance
exports.spotifyTokensSchema.index({ userId: 1 }, { unique: true });
exports.SpotifyTokensModel = mongoose_1.default.model(types_2.SpotifyTokensNamingScheme.MODEL, exports.spotifyTokensSchema);
//# sourceMappingURL=SpotifyTokens.js.map