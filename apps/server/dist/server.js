"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const routes_1 = __importDefault(require("./routes"));
const env_1 = require("./config/env");
const cors_1 = require("./config/cors");
const errorHandler_1 = require("./errors/errorHandler");
const error_1 = require("./errors/error");
const app = (0, express_1.default)();
const port = env_1.env.PORT || 3000;
app.use((0, cors_1.configureCors)());
app.use(express_1.default.json());
app.use(routes_1.default);
// Error handling middleware - should be last
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        app.listen(port, () => {
            console.log(`⚡️Server is running at http://localhost:${port}`);
        });
    }
    catch (error) {
        throw new error_1.DatabaseError(error instanceof Error ? error.message : "Failed to connect to database");
    }
};
startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=server.js.map