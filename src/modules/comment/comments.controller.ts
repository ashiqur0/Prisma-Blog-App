import { Request, Response } from "express"
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {
        const user = req.user!;
        req.body.authorId = user?.id;

        const result = await commentService.createComment(req.body);

        if (!result) {
            return res.status(400).json({
                message: "Invalid postId or parentId"
            });
        }

        res.status(201).json({
            message: "Comment created successfully",
            comment: result
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Internal server error",
            error: error
        });
    }
}

export const commentController = {
    createComment
}