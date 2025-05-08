import { z } from "zod";

const envSchema = z.object({
  // Using VITE_ prefix as per Vite's conventions
  VITE_API_URL: z.string().optional().default("/api"), // Default to relative path for proxy
  VITE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  VITE_AUTH_TOKEN_KEY: z.string().default("auth_token"),
});

// Type for the validated environment
export type Env = z.infer<typeof envSchema>;

const validateEnv = (): Env => {
  try {
    const parsed = envSchema.safeParse({
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_ENV: import.meta.env.VITE_ENV,
      VITE_AUTH_TOKEN_KEY: import.meta.env.VITE_AUTH_TOKEN_KEY,
    });

    if (!parsed.success) {
      console.error("❌ Invalid environment variables:");
      console.error(parsed.error.format());
      throw new Error("Invalid environment configuration");
    }

    return parsed.data;
  } catch (error) {
    console.error("❌ Error validating environment variables:", error);
    throw error;
  }
};

export const env = validateEnv();
