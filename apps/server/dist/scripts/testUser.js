"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const user_service_1 = require("../services/user.service");
const createTestUser = async () => {
    try {
        await (0, database_1.connectDatabase)();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const service = new user_service_1.UserService();
        const testUser = await service.createUser({
            email: "test@example.com",
            password: "password123",
            firstName: "Test",
            lastName: "User",
            isActive: true,
        });
        const users = await service.getUsers();
        console.log(`user created, user count is now ${users.data?.length}: \n${JSON.stringify(users)}`);
        process.exit(0);
    }
    catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
};
createTestUser();
//# sourceMappingURL=testUser.js.map