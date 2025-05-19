import { Request, Response } from "express";
import { BankAccountService } from "../../services/PF/bankAccount.service";
import { ForecastService } from "../../services/PF/forecast.service";
export declare class BankAccountController {
    private bankAccountService;
    private forecastService;
    constructor(bankAccountService: BankAccountService, forecastService: ForecastService);
    private filterConfig;
    create: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: Request, res: Response, next: import("express").NextFunction) => void;
    generateForecast: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=bankAccount.controller.d.ts.map