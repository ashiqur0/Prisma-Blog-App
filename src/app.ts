import express, { Application } from "express";
import { postRouter } from "./modules/post/post.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
    res.send("Welcome to the Prisma Blog App API!");
});

app.use("/posts", postRouter);

export default app;