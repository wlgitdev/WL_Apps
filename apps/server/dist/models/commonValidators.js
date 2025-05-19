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
exports.createEnumConfig = exports.createBooleanConfig = exports.createArrayReferencesConfig = exports.createArrayConfig = exports.createReferenceConfig = exports.createDateConfig = exports.createStringConfig = exports.createNumericConfig = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Helper to get display name for error messages
const getDisplayName = (path, context) => {
    if (context?.fieldDisplayName)
        return context.fieldDisplayName;
    return `${context?.entityName || "Field"} ${path.toLowerCase()}`;
};
// Numeric field validation
const createNumericConfig = (options) => ({
    type: Number,
    required: [
        options?.required ?? false,
        (props) => `${getDisplayName(props.path, options?.context)} is required`,
    ],
    validate: [
        {
            validator: function (value) {
                if (options?.min !== undefined && value < options.min)
                    return false;
                if (options?.max !== undefined && value > options.max)
                    return false;
                return true;
            },
            message: (props) => {
                if (options?.min !== undefined && options?.max !== undefined) {
                    return `${getDisplayName(props.path, options?.context)} must be between ${options.min} and ${options.max}`;
                }
                if (options?.min !== undefined) {
                    return `${getDisplayName(props.path, options?.context)} must be at least ${options.min}`;
                }
                if (options?.max !== undefined) {
                    return `${getDisplayName(props.path, options?.context)} must be at most ${options.max}`;
                }
                return "Invalid number";
            },
        },
    ],
    // default: options?.default,
});
exports.createNumericConfig = createNumericConfig;
// String field validation
const createStringConfig = (options) => ({
    type: String,
    required: options?.required ?? false,
    validate: {
        validator: function (value) {
            if (options?.minLength !== undefined && value.length < options.minLength)
                return false;
            if (options?.maxLength !== undefined && value.length > options.maxLength)
                return false;
            if (options?.pattern && !options.pattern.test(value))
                return false;
            return true;
        },
        message: (props) => {
            if (options?.pattern && !options.pattern.test(props.value)) {
                return options?.patternMessage ?? "Invalid format";
            }
            if (options?.minLength !== undefined &&
                props.value.length < options.minLength) {
                return `${getDisplayName(props.path, options?.context)} must be at least ${options.minLength} characters long`;
            }
            if (options?.maxLength !== undefined &&
                props.value.length > options.maxLength) {
                return `${getDisplayName(props.path, options?.context)} must be at most ${options.maxLength} characters long`;
            }
            return "Invalid string";
        },
    },
    select: options?.allowSelect ?? true,
});
exports.createStringConfig = createStringConfig;
// Date field validation
const createDateConfig = (options) => ({
    type: Date,
    required: [
        options?.required ?? false,
        (props) => `${getDisplayName(props.path, options?.context)} is required`,
    ],
    validate: [
        {
            validator: function (value) {
                if (options?.min && value < options.min)
                    return false;
                if (options?.max && value > options.max)
                    return false;
                return true;
            },
            message: (props) => {
                if (options?.min && props.value < options.min) {
                    return `${getDisplayName(props.path, options?.context)} must be after ${options.min.toISOString().split("T")[0]}`;
                }
                if (options?.max && props.value > options.max) {
                    return `${getDisplayName(props.path, options?.context)} must be before ${options.max.toISOString().split("T")[0]}`;
                }
                return "Invalid date";
            },
        },
    ],
});
exports.createDateConfig = createDateConfig;
// Reference field validation
const createReferenceConfig = (options) => ({
    type: mongoose_1.Schema.Types.ObjectId,
    ref: options.modelName,
    required: [
        options?.required ?? false,
        (props) => `${getDisplayName(props.path, options?.context)} is required`,
    ],
    validate: [
        {
            validator: async function (value) {
                if (!value)
                    return true; // Skip validation if value is not provided
                const Model = mongoose_1.default.model(options.modelName);
                const exists = await Model.exists({ _id: value });
                return exists !== null;
            },
            message: (props) => `Referenced ${options.modelName} in ${getDisplayName(props.path, options?.context)} does not exist`,
        },
    ],
});
exports.createReferenceConfig = createReferenceConfig;
// Array field validation
const createArrayConfig = (options) => ({
    type: [mongoose_1.Schema.Types.Mixed],
    required: [
        options?.required ?? false,
        (props) => `${getDisplayName(props.path, options?.context)} is required`,
    ],
});
exports.createArrayConfig = createArrayConfig;
// Array of References field validation
const createArrayReferencesConfig = (options) => ({
    type: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: options.modelName
        }],
    required: [
        options?.required ?? false,
        (props) => `${getDisplayName(props.path, options?.context)} is required`,
    ],
    validate: [
        {
            validator: async function (values) {
                if (!values || values.length === 0)
                    return true;
                // Check min length
                if (options.minLength !== undefined && values.length < options.minLength) {
                    return false;
                }
                // Check max length
                if (options.maxLength !== undefined && values.length > options.maxLength) {
                    return false;
                }
                // Unique check
                if (options.unique && new Set(values).size !== values.length) {
                    return false;
                }
                // Validate each reference exists
                const Model = mongoose_1.default.model(options.modelName);
                const existingDocs = await Model.find({ _id: { $in: values } });
                return existingDocs.length === values.length;
            },
            message: (props) => {
                const displayName = getDisplayName(props.path, options?.context);
                if (options.minLength !== undefined && props.value.length < options.minLength) {
                    return `${displayName} must have at least ${options.minLength} references`;
                }
                if (options.maxLength !== undefined && props.value.length > options.maxLength) {
                    return `${displayName} must have at most ${options.maxLength} references`;
                }
                if (options.unique && new Set(props.value).size !== props.value.length) {
                    return `${displayName} must have unique references`;
                }
                return `Invalid references for ${displayName}. Some referenced ${options.modelName} data doesn't exist`;
            }
        }
    ]
});
exports.createArrayReferencesConfig = createArrayReferencesConfig;
const createBooleanConfig = (options) => ({
    type: Boolean,
    required: [
        options?.required ?? false,
        (props) => `${getDisplayName(props.path, options?.context)} is required`,
    ],
});
exports.createBooleanConfig = createBooleanConfig;
const createEnumConfig = (options) => {
    return {
        type: mongoose_1.Schema.Types.String,
        enum: options.values,
        required: [
            options?.required ?? false,
            (props) => `${getDisplayName(props.path, options?.context)} is required`,
        ],
        validate: {
            validator: function (value) {
                return options.values.includes(value);
            },
            message: (props) => `${getDisplayName(props.path, options?.context)} must be one of: ${options.values.join(", ")}. Received: ${props.value}`,
        },
        default: options?.default,
    };
};
exports.createEnumConfig = createEnumConfig;
//# sourceMappingURL=commonValidators.js.map