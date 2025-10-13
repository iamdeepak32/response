import express from "express";

import { CreateUser } from "../controller/userController";
import { GetUsers } from "../controller/userController";
import { DeleteUser } from "../controller/userController";
import { UpdateUser } from "../controller/userController";

const router = express.Router();

router.post("/", CreateUser);
router.get("/", GetUsers);
router.put("/:id", UpdateUser);
router.delete("/:id", DeleteUser);

module.exports = router;



