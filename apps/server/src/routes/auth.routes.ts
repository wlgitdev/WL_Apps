import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { SERVER_API_ROUTES } from "@wl-apps/utils";

const router = express.Router();
const authController = new AuthController(new AuthService(new UserService()));

router
  .post(`/${SERVER_API_ROUTES.auth.login}`, authController.login);

export default router;
