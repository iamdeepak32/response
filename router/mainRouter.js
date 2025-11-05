import express from "express";
import { userRouter } from "./userRoutes.js";
import { companyRouter } from "./companyRoutes.js";
import { addressRouter } from "./addressRoutes.js";
import emailRoutes from "./emailRoutes.js"; 

const mainRouter = express.Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/company", companyRouter);
mainRouter.use("/address", addressRouter);
mainRouter.use("/email", emailRoutes);

export { mainRouter };
