import express, { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/middleware";

const router = express.Router();

router.post("/", auth(UserRole.USER), postController.createPost);
router.get("/my-posts", auth(UserRole.ADMIN, UserRole.USER), postController.getMyPosts);
router.get("/all", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.patch("/:postId", auth(UserRole.ADMIN, UserRole.USER), postController.updatePost);

export const postRouter: Router = router;