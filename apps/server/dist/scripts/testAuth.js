"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const user_service_1 = require("../services/user.service");
const auth_service_1 = require("../services/auth.service");
const login = async () => {
    try {
        await (0, database_1.connectDatabase)();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const service = new auth_service_1.AuthService(new user_service_1.UserService());
        const results = await service.login({
            email: "test@example.com",
            password: "password123",
        });
        console.log(`login ${results.success ? `successful` : `failed`}: ${JSON.stringify(results.data)}`);
        process.exit(0);
    }
    catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
};
login();
//# sourceMappingURL=testAuth.js.map