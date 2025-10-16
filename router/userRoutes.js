import express from "express";
import { GetUsers, CreateUser, UpdateUser, DeleteUser } from "../controller/userController/index.js";

const userRouter = express.Router();

userRouter.get("/", GetUsers);
userRouter.post("/", CreateUser);
userRouter.put("/:id", UpdateUser);
userRouter.delete("/:id", DeleteUser);

export { userRouter };
