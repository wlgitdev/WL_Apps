"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const health_1 = __importDefault(require("./health"));
const utils_1 = require("@wl-apps/utils");
const Sortify_1 = require("./Sortify");
const PF_1 = require("./PF");
const router = express_1.default.Router();
router.use(`/${utils_1.API_PREFIX}/${utils_1.SERVER_API_ROUTES.auth.base}`, auth_routes_1.default);
router.use(`/${utils_1.API_PREFIX}/${utils_1.SERVER_API_ROUTES.health.base}`, health_1.default);
router.use(`/${utils_1.API_PREFIX}/${utils_1.SERVER_API_ROUTES.sortify.users.base}`, Sortify_1.usersRouter);
router.use(`/${utils_1.API_PREFIX}/${utils_1.SERVER_API_ROUTES.sortify.trackStates.base}`, Sortify_1.trackStatesRouter);
router.use(`/${utils_1.API_PREFIX}/${utils_1.SERVER_API_ROUTES.sortify.spotify.base}`, Sortify_1.spotifyRouter);
router.use(`/${utils_1.API_PREFIX}/${utils_1.SERVER_API_ROUTES.pf.bank_accounts}`, PF_1.bankAccountRouter);
router.use(`/${utils_1.API_PREFIX}/${utils_1.SERVER_API_ROUTES.pf.transaction_categories}`, PF_1.transactionCategoryRouter);
router.use(`/${utils_1.API_PREFIX}/${utils_1.SERVER_API_ROUTES.pf.transactions}`, PF_1.transactionRouter);
exports.default = router;
//# sourceMappingURL=index.js.map