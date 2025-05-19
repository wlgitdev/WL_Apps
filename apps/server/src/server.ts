import express, { Express } from "express";
import { connectDatabase } from "./config/database";
import routes from "./routes";
import { env } from "./config/env"
import { configureCors } from "./config/cors";
import { errorHandler } from "./errors/errorHandler";
import { DatabaseError } from "./errors/error";

const app: Express = express();
const port = env.PORT || 3000;

app.use(configureCors());

app.use(express.json());

app.use(routes);

// Error handling middleware - should be last
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`⚡️Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    throw new DatabaseError(
      error instanceof Error ? error.message : "Failed to connect to database"
    );
  }
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

export default app;
