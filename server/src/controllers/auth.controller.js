import asyncHandler from "../utils/async.js";
import { ApiError } from "../utils/error.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError("All fields are required!");
  }

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

const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(500, "Incorrect Password!");
  }

  const token = user.createJWT();
  const { password: pass, ...rest } = user._doc;
  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .json(rest);
});

const google = asyncHandler(async (req, res) => {
  const { email, username, avatar } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const token = user.createJWT();
    const { password, ...rest } = user._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } else {
    const generatePassword = Math.random().toString(36).slice(-8);
    const user = await User.create({
      username:
        username.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4),
      email,
      password: generatePassword,
      avatar: avatar,
    });
    const token = user.createJWT();
    const { password, ...rest } = user._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  }
});

export { signin, signup, google };
