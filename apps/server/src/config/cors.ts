import cors from "cors";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  ALLOWED_ORIGINS: z.string().optional(),
});

export const configureCors = () => {
  const env = envSchema.parse(process.env);

  // Default allowed origins
  const allowedOrigins = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(",")
    : [];

  // In development, always allow localhost:3000
  if (env.NODE_ENV === "development") {
    allowedOrigins.push("http://localhost:3000");
  }

  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) {
        return callback(null, true);
      }

      // Check if the origin is allowed
      if (env.NODE_ENV === "development" || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Log unauthorized attempts in production
      if (env.NODE_ENV === "production") {
        console.warn(
          `Blocked CORS request from unauthorized origin: ${origin}`
        );
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    optionsSuccessStatus: 200,
  });
};
