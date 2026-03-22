import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const result = await postServices.createPost(req.body, req.user.id);

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

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string || "";
        const tags = req.query.tags as string[];
        const result = await postServices.getAllPosts({ search, tags });

        if (result.length === 0) {
            return res.status(404).json({
                success: true,
                message: "No posts found",
                result: result
            })
        }

        res.status(200).json({
            success: true,
            message: "Posts retrieved successfully",
            result: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failded to get posts",
            error: error.message
        })
    }
}

export const postController = {
    createPost,
    getPostById,
    getAllPosts
}