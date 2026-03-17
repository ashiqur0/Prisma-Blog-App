import express, { Application } from "express";
import { postRouter } from "./modules/post/post.routes";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Welcome to the Prisma Blog App API!");
});

app.use("/posts", postRouter);

export default app;