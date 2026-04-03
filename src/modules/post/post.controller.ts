import { Request, Response } from "express";
import { postServices } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helper/paginationSortingHelper";

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

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

        const result = await postServices.getAllPosts({ search, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder });

        if (result.data.length === 0) {
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

const getPostById = async (req: Request, res: Response) => {
    try {
        const PostId = req.params.id;

        const result = await postServices.getPostById(PostId as string);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Post retrieved successfully",
            result: result
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to get post",
            error: error.message
        })
    }
}

const getMyPosts = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const result = await postServices.getMyPosts(user.id);
        console.log({ result })
        res.status(200).json({
            success: true,
            message: "My posts retrieved successfully",
            result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Failed to get my posts",
            error: error.message
        });
    }
}

export const postController = {
    createPost,
    getAllPosts,
    getPostById,
    getMyPosts,
}