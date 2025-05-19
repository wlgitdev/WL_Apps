"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const async_1 = require("../middleware/async");
const error_1 = require("../errors/error");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.login = (0, async_1.asyncHandler)(async (req, res) => {
            const credentials = req.body;
            if (!credentials.email) {
                throw new error_1.ValidationError("Email is required");
            }
            if (!credentials.password) {
                throw new error_1.ValidationError("Password is required");
            }
            const result = await this.authService.login(credentials);
            res.status(200).json(result);
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map