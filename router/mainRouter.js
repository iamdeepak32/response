import express from "express";
import { userRouter } from "./userRoutes.js";

export const mainRouter = express.Router();

mainRouter.use("/api", userRouter);
