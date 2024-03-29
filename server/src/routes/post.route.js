import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  createPost,
  deletePost,
  editPost,
  getPosts,
} from "../controllers/post.cotroller.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/")
  .post(verifyToken, upload.single("image"), createPost)
  .get(getPosts);

router
  .route("/:id")
  .delete(verifyToken, deletePost)
  .patch(verifyToken, upload.single("image"), editPost);

export default router;
