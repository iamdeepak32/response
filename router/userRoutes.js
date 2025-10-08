const express = require("express");
const router = express.Router();
const connection = require("../db/conn"); 
const { CreateUser, GetUsers, UpdateUser, DeleteUser } = require("../controller/userController");

router.post("/", (req, res) => CreateUser(req, res, connection));
router.get("/", (req, res) => GetUsers(req, res, connection));
router.put("/:id", (req, res) => UpdateUser(req, res, connection));
router.delete("/:id", (req, res) => DeleteUser(req, res, connection));

module.exports = router;
