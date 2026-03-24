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

const getCommentsById = async (req: Request, res: Response) => {
    try {
        const commentId = req.params.id;
        const result = await commentService.getCommentsById(commentId as string);

        if (!result) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        res.status(200).json({
            message: "Comment fetched successfully",
            comment: result
        });        
    } catch (error) {
        res.status(500).json({ 
            message: "Internal server error",
            error: error
        });
    }
}

const getCommentsByAuthor = async (req: Request, res: Response) => {
    try {
        const authorId = req.params.authorId;
        const result = await commentService.getCommentsByAuthor(authorId as string);

        if (!result || result.length === 0) {
            return res.status(404).json({
                message: "Comments not found for the author"
            });
        }

        res.status(200).json({
            message: "Comments fetched successfully",
            comments: result
        });

    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

export const commentController = {
    createComment,
    getCommentsById,
    getCommentsByAuthor,
}