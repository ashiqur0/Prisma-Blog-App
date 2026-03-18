import express, { NextFunction, Request, Response, Router } from "express";
import { postController } from "./post.controller";
import isAuthenticated, { UserRole } from "../../middleware/middleware";

const router = express.Router();

router.post("/", isAuthenticated(UserRole.USER), postController.createPost);
router.get("/:id", postController.getPostById);
router.get("/", postController.getAllPosts);

export const postRouter: Router = router;