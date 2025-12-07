import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

//create user
router.post("/", userControllers.createUser);

//get all user
router.get("/", auth("admin"), userControllers.getAllUser);

//get single user
router.get("/:id", auth(), userControllers.getSingleUser);

//update user
router.put("/:id", auth(), userControllers.updateUser);

router.delete("/:id", auth("admin"), userControllers.deleteUser);

export const userRoutes = router;
