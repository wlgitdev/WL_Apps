import express from "express";
import authRoutes from "./auth.routes";
import healthRoutes from "./health";
import { API_PREFIX, SERVER_API_ROUTES } from "@wl-apps/utils";
import {
  trackStatesRouter,
  spotifyRouter,
  usersRouter
} from './Sortify'
import {
  bankAccountRouter,
  transactionCategoryRouter,
  transactionRouter
} from './PF'

const router = express.Router();

router.use(`/${API_PREFIX}/${SERVER_API_ROUTES.auth.base}`, authRoutes);
router.use(`/${API_PREFIX}/${SERVER_API_ROUTES.health.base}`, healthRoutes);

router.use(`/${API_PREFIX}/${SERVER_API_ROUTES.sortify.users.base}`, usersRouter);
router.use(`/${API_PREFIX}/${SERVER_API_ROUTES.sortify.trackStates.base}`, trackStatesRouter);
router.use(`/${API_PREFIX}/${SERVER_API_ROUTES.sortify.spotify.base}`, spotifyRouter);

router.use(`/${API_PREFIX}/${SERVER_API_ROUTES.pf.bank_accounts}`, bankAccountRouter);
router.use(`/${API_PREFIX}/${SERVER_API_ROUTES.pf.transaction_categories}`, transactionCategoryRouter);
router.use(`/${API_PREFIX}/${SERVER_API_ROUTES.pf.transactions}`, transactionRouter);

export default router;
