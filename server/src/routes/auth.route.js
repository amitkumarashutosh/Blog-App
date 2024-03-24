import express from "express";
import { signin, signup, google } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/signup").post(upload.single("avatar"), signup);
router.route("/signin").post(signin);
router.route("/google").post(google);

export default router;
