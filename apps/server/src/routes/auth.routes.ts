import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";

const router = express.Router();
const authController = new AuthController(new AuthService(new UserService()));

router
  .post(`/login`, authController.login);

export default router;
