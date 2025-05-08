import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  MONGODB_URI: z
    .string({
      required_error: "MongoDB connection string is required",
    })
    .url(),
  API_PREFIX: z.string().default("/api"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  // Authentication
  JWT_SECRET: z
    .string({
      required_error: "JWT secret is required",
    })
    .min(32, "JWT secret should be at least 32 characters long"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  // CORS
  ALLOWED_ORIGINS: z.string().transform((str) => str.split(",")),
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
  } catch (error) {
    console.error("❌ Error validating environment variables:", error);
    process.exit(1);
  }
};

export const env = validateEnv();
