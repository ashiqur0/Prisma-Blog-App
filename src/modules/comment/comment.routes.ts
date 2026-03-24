import expres, { Router } from 'express';
import { commentController } from './comments.controller';
import auth, { UserRole } from '../../middleware/middleware';

const router = expres.Router();

router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentController.createComment);
router.get("/:commentId", commentController.getCommentsById);
router.get("/author/:authorId", commentController.getCommentsByAuthor);
router.delete("/:commentId", auth(UserRole.USER, UserRole.ADMIN), commentController.deleteComment);
router.patch("/:commentId", auth(UserRole.USER, UserRole.ADMIN), commentController.updateComment);
router.patch("/:commentId/moderate", auth(UserRole.ADMIN), commentController.moderateComment);

export const commentRouter: Router = router;