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
