import asyncHandler from "../utils/async.js";
import { ApiError } from "../utils/error.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError("All fields are required!");
  }

  console.log(req.file);
  let avatar = "";
  const path = req.file?.path;
  if (path) {
    avatar = await uploadOnCloudinary(path);
  }

  const user = await User.create({
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar?.url,
  });
  const { password: pass, ...rest } = user._doc;
  res.status(201).json(rest);
});

export { signup };
