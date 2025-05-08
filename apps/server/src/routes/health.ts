import express, { Request, Response } from "express";
import { ApiResponse } from "@wl-apps/types";

const router = express.Router();

router.get(`/`, (req: Request, res: Response) => {
  const response: ApiResponse<{ status: string }> = {
    success: true,
    data: {
      status: "healthy",
    },
  };
  res.json(response);
});

export default router;
