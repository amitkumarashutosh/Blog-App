import express from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getAllComment,
  likeComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.route("/").post(verifyToken, createComment);
router
  .route("/:id")
  .get(getAllComment)
  .put(verifyToken, editComment)
  .delete(verifyToken, deleteComment);
router.route("/like/:id").put(verifyToken, likeComment);

export default router;
