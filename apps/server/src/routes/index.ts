import express from "express";
import authRoutes from "./auth.routes";
import healthRoutes from "./health";

const router = express.Router();
const apiVersion = 1;
const baseUrl = `/api/v${apiVersion}`;

router.use(`${baseUrl}/auth`, authRoutes);
router.use(`${baseUrl}/health`, healthRoutes);

export default router;
