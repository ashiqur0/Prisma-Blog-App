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

export const postController = {
    createPost,
}