import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { createPost, getPosts } from "../controllers/post.cotroller.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/")
  .post(verifyToken, upload.single("image"), createPost)
  .get(getPosts);

export default router;
