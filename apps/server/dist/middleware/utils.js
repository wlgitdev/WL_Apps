"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAuth = exports.createQueryFilters = void 0;
const auth_service_1 = require("../services/auth.service");
const user_service_1 = require("../services/user.service");
const createQueryFilters = (req, filterConfig) => {
    const filters = {};
    Object.entries(filterConfig).forEach(([key, config]) => {
        const queryValue = req.query[key];
        if (queryValue === undefined)
            return;
        let transformedValue;
        switch (config.type) {
            case "number":
                transformedValue = Number(queryValue);
                if (isNaN(transformedValue))
                    return;
                break;
            case "date":
                transformedValue = new Date(queryValue);
                if (isNaN(transformedValue.getTime()))
                    return;
                break;
            case "boolean":
                transformedValue = queryValue === "true";
                break;
            case "array":
                transformedValue = queryValue.split(",");
                break;
            default:
                transformedValue = config.transform
                    ? config.transform(queryValue)
                    : queryValue;
        }
        filters[key] = transformedValue;
    });
    return filters;
};
exports.createQueryFilters = createQueryFilters;
const withAuth = (handler) => {
    return async (req, res, next) => {
        const authService = new auth_service_1.AuthService(new user_service_1.UserService());
        const authResponse = await authService.authenticateRequest(req);
        if (!authResponse.success) {
            return res.status(401).json(authResponse);
        }
        req.user = authResponse.data;
        return handler(req, res, next);
    };
};
exports.withAuth = withAuth;
//# sourceMappingURL=utils.js.map