import { Request, Response } from "express";
import { TransactionCategoryService } from "../../services/PF/transactionCategory.service";
export declare class TransactionCategoryController {
    private transactionCategoryService;
    constructor(transactionCategoryService: TransactionCategoryService);
    private filterConfig;
    create: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=transactionCategory.controller.d.ts.map