import { Request, Response } from "express";
import { TrackStatesService } from "../../services/Sortify/trackStates.service";
export declare class TrackStatesController {
    private trackStatesService;
    constructor(trackStatesService: TrackStatesService);
    private filterConfig;
    create: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createBatch: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateBatch: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=trackStates.controller.d.ts.map