import { Comment } from "../models/comment.model.js";
import asyncHandler from "../utils/async.js";
import { ApiError } from "../utils/error.js";

const createComment = asyncHandler(async (req, res) => {
  req.body.userId = req.user.id;
  const comment = await Comment.create(req.body);
  res.status(201).json(comment);
});

const getAllComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.find({ postId: id }).sort({ createdAt: -1 });
  if (!comment) {
    throw new ApiError(404, `No post is availabe with id ${id}`);
  }

  res.status(200).json({ comment, count: comment.length });
});

export { createComment, getAllComment };
