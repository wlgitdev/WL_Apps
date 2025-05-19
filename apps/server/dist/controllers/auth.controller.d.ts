import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=auth.controller.d.ts.map