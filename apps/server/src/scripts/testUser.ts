import { connectDatabase } from "../config/database";
import { UserService } from "../services/user.service";

const createTestUser = async () => {
  try {
    // 1. Connect to database
    await connectDatabase();
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const service = new UserService();

    const testUser = await service.createUser({
      email: "test@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "User",
      isActive: true,
    });

    const users = await service.getUsers()
    console.log(`user created, user count is now ${users.data?.length}: \n${JSON.stringify(users)}`);

    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
};

createTestUser();