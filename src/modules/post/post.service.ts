import { Post, PostStatus } from "../../../generated/prisma/client";
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

const getAllPosts = async (
    {
        search,
        tags,
        isFeatured,
        status,
        authorId,
        page,
        limit
    }: {
        search: string,
        tags: string[],
        isFeatured: boolean | undefined,
        status: PostStatus | undefined,
        authorId: string | undefined,
        page: number,
        limit: number
    }) => {
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

    if (typeof isFeatured === "boolean") {
        andConditions.push({
            isFeatured
        });
    }

    if (status) {
        andConditions.push({
            status
        });
    }

    if (authorId) {
        andConditions.push({
            authorId
        });
    }

    const result = await prisma.post.findMany({
        where: {
            AND: andConditions
        },
        skip: (page - 1) * limit,
        take: limit
    });

    return result;
}

export const postServices = {
    createPost,
    getAllPosts,
}