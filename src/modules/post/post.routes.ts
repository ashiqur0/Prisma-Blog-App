import express, { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/middleware";

const router = express.Router();

router.post("/", auth(UserRole.USER), postController.createPost);
router.get("/:id", postController.getPostById);
router.get("/", postController.getAllPosts);

export const postRouter: Router = router;