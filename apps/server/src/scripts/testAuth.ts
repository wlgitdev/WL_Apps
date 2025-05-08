import { connectDatabase } from "../config/database";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";

const login = async () => {
  try {
    await connectDatabase();
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const service = new AuthService(new UserService());

    const results = await service.login({
      email: "test@example.com",
      password: "password123",
    });
    

    console.log(`login ${results.success ? `successful` : `failed`}: ${JSON.stringify(results.data)}`);

    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
};

login();