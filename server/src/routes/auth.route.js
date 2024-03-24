import express from "express";
import { signup } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/signup").post(upload.single("avatar"), signup);

export default router;
