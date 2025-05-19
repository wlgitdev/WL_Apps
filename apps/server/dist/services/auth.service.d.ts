import { Request } from "express";
import { UserService } from "./user.service";
import { LoginResponse, LoginCredentials, ApiResponse } from "@wl-apps/types";
import { UserDocument } from "../models/User";
export declare class AuthService {
    private userService;
    private readonly jwtSecret;
    private readonly jwtExpiresIn;
    constructor(userService: UserService, jwtSecret?: string, jwtExpiresIn?: string);
    login(credentials: LoginCredentials): Promise<LoginResponse>;
    private generateToken;
    private verifyToken;
    authenticateRequest(req: Request): Promise<ApiResponse<Partial<UserDocument>>>;
}
//# sourceMappingURL=auth.service.d.ts.map