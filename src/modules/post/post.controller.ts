import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {
        const result = await postServices.createPost(req.body);

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to create post",
            error: error.message
        })
    }
}

const getPostById = async (req: Request, res: Response) => {
    try {
        const result = await postServices.getPostById(req.params.id as string);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Post retrieved successfully",
            result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get post",
            error: error.message
        })
    }
}

export const postController = {
    createPost,
    getPostById,
}