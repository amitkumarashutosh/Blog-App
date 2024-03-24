import express from "express";
import {
  updateUser,
  deleteUser,
  signOut,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.route("/update/:userId").put(verifyToken, updateUser);
router.route("/delete/:userId").delete(verifyToken, deleteUser);
router.route("/signout").post(signOut);

export default router;