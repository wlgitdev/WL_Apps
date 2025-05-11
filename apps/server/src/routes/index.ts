import express from "express";
import authRoutes from "./auth.routes";
import healthRoutes from "./health";

import {
  bankAccountRouter,
  transactionCategoryRouter,
  transactionRouter
} from './PF'

const router = express.Router();
const apiVersion = 1;
const baseUrl = `/api/v${apiVersion}`;

router.use(`${baseUrl}/auth`, authRoutes);
router.use(`${baseUrl}/health`, healthRoutes);

router.use(`${baseUrl}/pf/bank-accounts`, bankAccountRouter);
router.use(`${baseUrl}/pf/transaction-categories`, transactionCategoryRouter);
router.use(`${baseUrl}/pf/transactions`, transactionRouter);

export default router;
