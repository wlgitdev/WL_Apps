"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const user_service_1 = require("../services/user.service");
const auth_service_1 = require("../services/auth.service");
const utils_1 = require("@wl-apps/utils");
const router = express_1.default.Router();
const authController = new auth_controller_1.AuthController(new auth_service_1.AuthService(new user_service_1.UserService()));
router
    .post(`/${utils_1.SERVER_API_ROUTES.auth.login}`, authController.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map