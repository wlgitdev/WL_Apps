"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const error_1 = require("../errors/error");
class AuthService {
    constructor(userService, jwtSecret = env_1.env.JWT_SECRET || "wl-apps-key", jwtExpiresIn = env_1.env.JWT_EXPIRES_IN || "1d") {
        this.userService = userService;
        this.jwtSecret = jwtSecret;
        this.jwtExpiresIn = jwtExpiresIn;
    }
    async login(credentials) {
        try {
            const userValidation = await this.userService.validateUserCredentials(credentials);
            if (!userValidation.success || !userValidation.data) {
                throw new error_1.AuthenticationError("Invalid credentials");
            }
            const userResponse = userValidation.data;
            const token = this.generateToken({
                recordId: userValidation.data.id,
                email: userValidation.data.email,
            });
            return {
                success: true,
                data: {
                    token,
                    user: userResponse,
                },
            };
        }
        catch (error) {
            if (error instanceof error_1.AuthenticationError) {
                throw error;
            }
            throw new error_1.AuthenticationError(error instanceof Error ? error.message : "Authentication failed");
        }
    }
    generateToken(payload) {
        try {
            return jsonwebtoken_1.default.sign(payload, this.jwtSecret, {
                expiresIn: this.jwtExpiresIn,
            });
        }
        catch (error) {
            throw new error_1.ValidationError(error instanceof Error ? error.message : "Failed to generate token");
        }
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.jwtSecret);
        }
        catch (error) {
            throw new error_1.AuthenticationError("Invalid token");
        }
    }
    async authenticateRequest(req) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.split(" ")[1];
            if (!token) {
                throw new error_1.AuthenticationError("Authentication token required");
            }
            const decoded = this.verifyToken(token);
            const userResponse = await this.userService.getUsers({
                recordId: decoded.recordId,
            });
            if (!userResponse.success || !userResponse.data?.length) {
                throw new error_1.AuthenticationError("Invalid token");
            }
            return {
                success: userResponse.data[0] ? true : false,
                data: userResponse.data[0] || {}
            };
        }
        catch (error) {
            if (error instanceof error_1.AuthenticationError) {
                throw error;
            }
            throw new error_1.AuthenticationError(error instanceof Error ? error.message : "Authentication failed");
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map