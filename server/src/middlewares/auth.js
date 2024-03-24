import jwt from "jsonwebtoken";
import { ApiError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    throw new ApiError(401, "Uaunauthorized!");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      throw new ApiError(401, "Uaunauthorized!");
    }

    req.user = user;
    next();
  });
};
