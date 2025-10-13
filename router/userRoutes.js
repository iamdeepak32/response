import express from "express";

import { CreateUser } from "../controller/userController/index.js";
import { GetUsers } from "../controller/userController/index.js";
import { DeleteUser } from "../controller/userController/index.js";
import { UpdateUser } from "../controller/userController/index.js";

const userRouter = express.Router();

userRouter.post("/", CreateUser);
userRouter.get("/", GetUsers);
userRouter.put("/:id", UpdateUser);
userRouter.delete("/:id", DeleteUser);

export { userRouter };
