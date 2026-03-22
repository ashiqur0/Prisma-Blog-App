import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    });

    return result;
}

const getPostById = async (id: string) => {
    const result = await prisma.post.findUnique({
        where: { id }
    });

    return result;
}

const getAllPosts = async (payload: {search: string}) => {
    const result = await prisma.post.findMany({
        where: {
            title: {
                contains: payload.search,
                mode: "insensitive"
            }
        }
    });

    return result;
}

export const postServices = {
    createPost,
    getPostById,
    getAllPosts,
}