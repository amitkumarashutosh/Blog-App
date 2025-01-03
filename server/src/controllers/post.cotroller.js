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
  const { title, content, category } = req.body;
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
    category,
    userId: req.user.id,
    image: image?.url,
  });
  res.status(201).json(post);
});

const getPosts = asyncHandler(async (req, res) => {
  try {
    const query = {};

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    if (req.query.userId) query.userId = req.query.userId;
    if (req.query.category && req.query.category !== "uncategorized") {
      query.category = req.query.category;
    }
    if (req.query.slug) query.slug = req.query.slug;
    if (req.query.postId) query._id = req.query.postId;
    if (req.query.searchTerm) {
      query.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(query); // Adjust to filtered posts
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const deletePost = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(403, "You are not allowed to delete this post");
  }

  await Post.findByIdAndDelete(req.params.id);
  res.status(200).json("The post has been deleted");
});

const editPost = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(403, "You are not allowed to update this post");
  }

  let image = "";
  const path = req.file?.path;
  if (path) {
    image = await uploadOnCloudinary(path);
  }

  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        ...req.body,
        ...(path && { image: image?.url }),
      },
    },
    { new: true }
  );
  res.status(200).json(post);
});

export { createPost, getPosts, deletePost, editPost };
