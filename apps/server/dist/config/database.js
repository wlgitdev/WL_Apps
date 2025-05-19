"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const env_1 = require("./env");
dotenv_1.default.config();
const MONGODB_URI = env_1.env.MONGODB_URI
    ? `${env_1.env.MONGODB_URI.replace("/?", "/wl-apps?")}`
    : "mongodb://localhost:27017/wl-apps";
const connectDatabase = async () => {
    try {
        const options = {
            autoIndex: true,
            // Add other MongoDB options as needed
        };
        await mongoose_1.default.connect(MONGODB_URI, options);
        console.log("✅ MongoDB connected successfully");
        // Add event listeners for database events
        mongoose_1.default.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            console.log("❌ MongoDB disconnected");
        });
        // Graceful shutdown
        process.on("SIGINT", async () => {
            try {
                await mongoose_1.default.connection.close();
                console.log("MongoDB connection closed through app termination");
                process.exit(0);
            }
            catch (err) {
                console.error("Error during MongoDB disconnection:", err);
                process.exit(1);
            }
        });
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map