import express, { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/middleware";

const router = express.Router();

router.get("/all", postController.getAllPosts);
router.get("/stats", auth(UserRole.ADMIN), postController.getStats);
router.post("/", auth(UserRole.USER, UserRole.ADMIN), postController.createPost);
router.get("/my-posts", auth(UserRole.ADMIN, UserRole.USER), postController.getMyPosts);
router.get("/:id", postController.getPostById);
router.patch("/:postId", auth(UserRole.ADMIN, UserRole.USER), postController.updatePost);
router.delete("/:postId", auth(UserRole.ADMIN, UserRole.USER), postController.deletePost);

export const postRouter: Router = router;