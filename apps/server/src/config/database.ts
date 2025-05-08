import mongoose from "mongoose";
import dotenv from "dotenv";
import { env } from "./env";

dotenv.config();

const MONGODB_URI = env.MONGODB_URI
  ? `${env.MONGODB_URI.replace("/?", "/wl-apps?")}`
  : "mongodb://localhost:27017/wl-apps";
  
export const connectDatabase = async (): Promise<void> => {
  try {
    const options = {
      autoIndex: true,
      // Add other MongoDB options as needed
    };

    await mongoose.connect(MONGODB_URI, options);
    console.log("✅ MongoDB connected successfully");

    // Add event listeners for database events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("❌ MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
      } catch (err) {
        console.error("Error during MongoDB disconnection:", err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
