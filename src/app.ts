import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRouter } from "./modules/comment/comment.routes";
import { postRouter } from "./modules/post/post.routes";
import errorHandler from "./middleware/globalErrorHandler";
import notFound from "./middleware/NotFound";

const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
    res.send("Welcome to the Prisma Blog App API!");
});

// apis
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use(notFound);
app.use(errorHandler);

export default app;