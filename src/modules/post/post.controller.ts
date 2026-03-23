import { Request, Response } from "express";
import { postServices } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

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

const getAllPosts = async (req: Request, res: Response) => {
    try {

        // searching and filtering
        const search = req.query.search as string || "";
        const tags = (req.query.tags as string)?.split(",") || [];
        const isFeatured = req.query.isFeatured === "true"
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined;
        const status = req.query.status as PostStatus || undefined;
        const authorId = req.query.authorId as string || undefined;

        // pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        // sorting
        const sortBy = req.query.sortBy as string | undefined;
        const sortOrder = req.query.sortOrder as string | undefined;

        const result = await postServices.getAllPosts({ search, tags, isFeatured, status, authorId, page, limit, sortBy, sortOrder });

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
    getAllPosts
}