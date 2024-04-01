import { Comment } from "../models/comment.model.js";
import asyncHandler from "../utils/async.js";
import { ApiError } from "../utils/error.js";

const createComment = asyncHandler(async (req, res) => {
  req.body.userId = req.user.id;
  const comment = await Comment.create(req.body);
  res.status(201).json(comment);
});

const getAllPostComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.find({ postId: id }).sort({ createdAt: -1 });
  if (!comment) {
    throw new ApiError(404, `No post is availabe with id ${id}`);
  }

  res.status(200).json({ comment, count: comment.length });
});

const likeComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ApiError("Comment not found");
  }

  const userIndex = comment.likes.indexOf(req.user.id);
  if (userIndex === -1) {
    comment.likes.push(req.user.id);
    comment.numberOfLikes += 1;
  } else {
    comment.likes.splice(userIndex, 1);
    comment.numberOfLikes -= 1;
  }

  await comment.save();
  res.status(200).json(comment);
});

const editComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (req.user.id !== comment.userId && !req.user.isAdmin) {
    throw new ApiError(403, "You are not allowed to edit this comment");
  }

  comment.content = req.body.content;
  await comment.save();

  res.status(200).json(comment);
});

const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (req.user.id !== comment.userId && !req.user.isAdmin) {
    throw new ApiError(403, "You are not allowed to edit this comment");
  }

  await Comment.findByIdAndDelete(id);
  res.status(200).json("Comment deleted successfully");
});

const getAllComments = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(403, "You are not allowed to get all comments");
  }
  const limit = req.query.limit || 9;
  const skip = req.query.skip || 0;

  const comment = await Comment.find({})
    .limit(limit)
    .sort({ createdAt: -1 })
    .skip(skip)
    .populate("userId", "username email")
    .populate("postId", "slug");

  const totalComments = await Comment.countDocuments({});
  res.status(200).json({ comment, count: totalComments });
});

export {
  createComment,
  getAllPostComment,
  likeComment,
  editComment,
  deleteComment,
  getAllComments,
};
