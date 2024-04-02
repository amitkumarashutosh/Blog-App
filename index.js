import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const port = process.env.PORT || 3001;

//middlewares
app.use(express.json());
app.use(cookieParser());

import authRouter from "./server/src/routes/auth.route.js";
import userRouter from "./server/src/routes/user.route.js";
import postRouter from "./server/src/routes/post.route.js";
import commentRouter from "./server/src/routes/comment.route.js";

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "client/dist")));
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

//not found
import notFound from "./server/src/utils/notFound.js";

app.use(notFound);

//database
import connectDB from "./server/src/db/index.js";

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
