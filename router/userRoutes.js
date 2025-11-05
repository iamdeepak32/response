import express from "express";
import { GetUsers, CreateUser, UpdateUser, DeleteUser } 
  from "../controller/userController/index.js";
import { sendinvitation } from "../controller/userController/sendinvitation.js";

const userRouter = express.Router();

userRouter.get("/", GetUsers);
userRouter.post("/", CreateUser);
userRouter.put("/:id", UpdateUser);
userRouter.delete("/:id", DeleteUser);

userRouter.post("/invite/:id", sendinvitation);

export { userRouter };
