import { Request, Response } from "express";
import { TransactionService as EntityService } from "../../services/PF/transaction.service";
export declare class TransactionController {
    private entityService;
    constructor(entityService: EntityService);
    private filterConfig;
    create: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createBatch: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllWithinRange: (req: Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateBatch: (req: Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=transaction.controller.d.ts.map