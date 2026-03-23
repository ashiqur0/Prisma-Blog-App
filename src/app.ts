import express, { Application } from "express";
import { postRouter } from "./modules/post/post.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { commentRouter } from "./modules/comment/comment.routes";

const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true
}));

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000", // client URL
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
    res.send("Welcome to the Prisma Blog App API!");
});

// apis
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

export default app;