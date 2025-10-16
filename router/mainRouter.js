import express from "express";
import { userRouter } from "./userRoutes.js";
import { companyRouter } from "./companyRoutes.js";

const mainRouter = express.Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/company", companyRouter);

export { mainRouter };


