import express, { Router } from "express";
import { postController } from "./post.controller";

const router = express.Router();

router.post("/", postController.createPost);
router.get("/:id", postController.getPostById);

export const postRouter: Router = router;