import express from "express";
import {
  updateUser,
  deleteUser,
  signOut,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/:userId")
  .patch(verifyToken, upload.single("avatar"), updateUser)
  .get(verifyToken, getUser);
router.route("/:userId").delete(verifyToken, deleteUser);
router.route("/signout").post(signOut);

export default router;
