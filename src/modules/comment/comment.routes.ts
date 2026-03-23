import expres, { Router } from 'express';
import { commentController } from './comments.controller';
import auth, { UserRole } from '../../middleware/middleware';

const router = expres.Router();

router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentController.createComment);
router.get("/:id", commentController.getCommentsById);

export const commentRouter: Router = router;