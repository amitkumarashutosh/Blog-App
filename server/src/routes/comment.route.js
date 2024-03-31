import express from "express";
import {
  createComment,
  getAllComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.route("/").post(verifyToken, createComment);
router.route("/:id").get(getAllComment);

export default router;
