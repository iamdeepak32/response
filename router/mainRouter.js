import express from "express";
import { userRouter } from "./userRoutes.js";
import { companyRouter } from "./companyRoutes.js";
import { addressRouter } from "./addressRoutes.js";

const mainRouter = express.Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/company", companyRouter);
mainRouter.use("/address", addressRouter);

export { mainRouter };
