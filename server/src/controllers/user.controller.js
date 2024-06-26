import asyncHandler from "../utils/async.js";
import { ApiError } from "../utils/error.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

const updateUser = asyncHandler(async (req, res) => {
  console.log(req.user.id, req.params.userId);
  if (req.user.id !== req.params.userId) {
    throw new ApiError(403, "You are not allowed to update the user");
  }
  const { username, password, email } = req.body;

  const user = await User.findById(req.params.userId);
  await deleteOnCloudinary(user.avatar);

  let avatar = "";
  const path = req.file?.path;
  if (path) {
    avatar = await uploadOnCloudinary(path);
  }

  if (username) user.username = username;
  if (email) user.email = email;
  if (password) user.password = password;
  if (avatar) user.avatar = avatar.url;
  await user.save();

  const { password: pass, ...rest } = user._doc;
  res.status(200).json(rest);
});

const deleteUser = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    throw new ApiError(403, "You are not allowed to delete the user");
  }

  await User.findByIdAndDelete(req.params.userId);
  res.status(200).json("User has been deleted");
});

const signOut = (req, res) => {
  res.clearCookie("access_token").status(200).json("User has been signed out");
};

const getUser = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(403, "You are not allowed to get all users");
  }
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.sort === "asc" ? 1 : -1;

  const users = await User.find({})
    .sort({ createdAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  const usersWithoutPassword = users.map((user) => {
    const { password, ...rest } = user._doc;
    return rest;
  });

  const totalUsers = await User.countDocuments();
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  const lastMonthUsers = await User.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json({ usersWithoutPassword, totalUsers, lastMonthUsers });
});

const getSingleUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, `No user with id ${userId}`);
  }

  const { password, ...rest } = user._doc;
  res.status(200).json(rest);
});

export { updateUser, deleteUser, signOut, getUser, getSingleUser };
