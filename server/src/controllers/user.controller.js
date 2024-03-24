import asyncHandler from "../utils/async.js";
import { ApiError } from "../utils/error.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

const updateUser = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.userId) {
    throw new ApiError(403, "You are not allowed to update the user");
  }

  if (req.body.password && req.body.password.length <= 4) {
    throw new ApiError(400, "Password must be at least 4 characters");
  }
  if (
    req.body.username &&
    (req.body.username.length < 7 || req.body.username.length > 20)
  ) {
    throw new ApiError(400, "Username must be between 7 and 20 characters");
  }
  if (req.body.username && req.body.username.includes(" ")) {
    throw new ApiError(400, "Username cannot contains space");
  }
  if (
    req.body.username &&
    req.body.username !== req.body.username.toLowerCase()
  ) {
    throw new ApiError(400, "Username must be lowercase");
  }

  let updateFields = {
    username: req.body.username,
    email: req.body.email,
    profilePicture: req.body.profilePicture,
  };
  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    updateFields.password = hashedPassword;
  }

  const user = await User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: updateFields,
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const { password, ...rest } = user._doc;
  res.status(200).json({ rest });
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.userId) {
    throw new ApiError(403, "You are not allowed to delete the user");
  }

  await User.findByIdAndDelete(req.params.userId);
  res.status(200).json("User has been deleted");
});

const signOut = (req, res) => {
  res.clearCookie("access_token").status(200).json("User has been signed out");
};

export { updateUser, deleteUser, signOut };
