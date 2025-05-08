import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { FilterConfig } from "@wl-apps/types";

export const createQueryFilters = <T extends Record<string, any>>(
  req: Request,
  filterConfig: FilterConfig<T>
): Partial<T> => {
  const filters: Partial<T> = {};

  Object.entries(filterConfig).forEach(([key, config]) => {
    const queryValue = req.query[key];
    if (queryValue === undefined) return;
    
    let transformedValue: any;

    switch (config.type) {
      case "number":
        transformedValue = Number(queryValue);
        if (isNaN(transformedValue)) return;
        break;
      case "date":
        transformedValue = new Date(queryValue as string);
        if (isNaN(transformedValue.getTime())) return;
        break;
      case "boolean":
        transformedValue = queryValue === "true";
        break;
      case "array":
        transformedValue = (queryValue as string).split(",");
        break;
      default:
        transformedValue = config.transform
          ? config.transform(queryValue as string)
          : queryValue;
    }

    filters[key as keyof T] = transformedValue;
  });

  return filters;
};

export const withAuth = (handler: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authService = new AuthService(new UserService());
    const authResponse = await authService.authenticateRequest(req);

    if (!authResponse.success) {
      return res.status(401).json(authResponse);
    }

    (req as any).user = authResponse.data;

    return handler(req, res, next);
  };
};