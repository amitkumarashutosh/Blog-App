import asyncHandler from "../utils/async.js";
import { ApiError } from "../utils/error.js";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(403, "You are not allowed to create a post");
  }

  let image = "";
  const path = req.file?.path;
  if (path) {
    image = await uploadOnCloudinary(path);
  }
  const { title, content } = req.body;
  if (!title || !content) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const slug = title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const post = await Post.create({
    title,
    content,
    slug,
    userId: req.user.id,
    image: image?.url,
  });
  res.status(201).json(post);
});

export { createPost };
