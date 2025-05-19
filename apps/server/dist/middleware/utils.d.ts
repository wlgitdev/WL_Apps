import { Request, Response, NextFunction } from "express";
import { FilterConfig } from "@wl-apps/types";
export declare const createQueryFilters: <T extends Record<string, any>>(req: Request, filterConfig: FilterConfig<T>) => Partial<T>;
export declare const withAuth: (handler: Function) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
//# sourceMappingURL=utils.d.ts.map