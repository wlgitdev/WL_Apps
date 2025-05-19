"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("3000"),
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    MONGODB_URI: zod_1.z
        .string({
        required_error: "MongoDB connection string is required",
    })
        .url(),
    API_PREFIX: zod_1.z.string().default("/api"),
    LOG_LEVEL: zod_1.z.enum(["error", "warn", "info", "debug"]).default("info"),
    // Authentication
    JWT_SECRET: zod_1.z
        .string({
        required_error: "JWT secret is required",
    })
        .min(32, "JWT secret should be at least 32 characters long"),
    JWT_EXPIRES_IN: zod_1.z.string().default("1d"),
    // CORS
    ALLOWED_ORIGINS: zod_1.z.string().transform((str) => str.split(",")),
    // Spotify Configuration
    SPOTIFY_CLIENT_ID: zod_1.z.string({
        required_error: "Spotify client ID is required",
    }),
    SPOTIFY_CLIENT_SECRET: zod_1.z.string({
        required_error: "Spotify client secret is required",
    }),
    SPOTIFY_TOKEN_ENCRYPTION_KEY: zod_1.z.string({
        required_error: "Spotify token encryption key is required",
    }),
});
const validateEnv = () => {
    try {
        const parsed = envSchema.safeParse(process.env);
        if (!parsed.success) {
            console.error("❌ Invalid environment variables:");
            console.error(parsed.error.format());
            process.exit(1);
        }
        return parsed.data;
    }
    catch (error) {
        console.error("❌ Error validating environment variables:", error);
        process.exit(1);
    }
};
exports.env = validateEnv();
//# sourceMappingURL=env.js.map