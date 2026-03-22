import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
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

const getAllPosts = async ({ search, tags }: { search: string, tags: string[] }) => {
    const andConditions: PostWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ]
        });
    }

    if (tags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: tags as string[]
            }
        });
    }

    const result = await prisma.post.findMany({
        where: {
            AND: andConditions
        }
    });

    return result;
}

export const postServices = {
    createPost,
    getPostById,
    getAllPosts,
}