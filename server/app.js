import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3001;

//middlewares
app.use(express.json());
app.use(cookieParser());

import authRouter from "./src/routes/auth.route.js";
import userRouter from "./src/routes/user.route.js";
import postRouter from "./src/routes/post.route.js";
import commentRouter from "./src/routes/comment.route.js";

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

//not foud
import notFound from "./src/utils/notFound.js";

app.use(notFound);

//database
import connectDB from "./src/db/index.js";

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
