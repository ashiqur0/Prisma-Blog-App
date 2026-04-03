import { Stats } from "node:fs";
import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
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
        limit,
        skip,
        sortBy,
        sortOrder
    }: {
        search: string,
        tags: string[],
        isFeatured: boolean | undefined,
        status: PostStatus | undefined,
        authorId: string | undefined,
        page: number,
        limit: number,
        skip: number,
        sortBy: string,
        sortOrder: string
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

    const allPosts = await prisma.post.findMany({
        where: {
            AND: andConditions
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            _count: {
                select: { comments: true }
            }
        }
    });

    const total = await prisma.post.count({
        where: {
            AND: andConditions
        }
    });

    return {
        data: allPosts,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const getPostById = async (postId: string) => {
    // transaction: to ensure atomicity of read and update operations
    const result = await prisma.$transaction(async (tx) => {
        // update views count
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        });

        // return post details
        return await tx.post.findUnique({
            where: {
                id: postId
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        replies: {
                            where: {
                                status: CommentStatus.APPROVED
                            },
                            orderBy: { createdAt: "asc" },
                            include: {
                                replies: {
                                    where: { status: CommentStatus.APPROVED },
                                    orderBy: { createdAt: "asc" }
                                }
                            }
                        }
                    }
                },
                _count: {   // shows total number of comments for the post
                    select: { comments: true }
                }
            }
        });
    })
    return result;
}

const getMyPosts = async (authorId: string) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId,
            status: "ACTIVE"
        },
        select: { id: true }
    });

    const result = await prisma.post.findMany({
        where: {
            authorId
        },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { comments: true }
            }
        }
    });

    // const total = await prisma.post.aggregate({
    //     _count: { id: true },
    //     where: {
    //         authorId
    //     }
    // });

    return result;
}

const updatePost = async (postId: string, data: Partial<Post>, authorId: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            authorId: true
        }
    });

    if (!isAdmin && (postData.authorId !== authorId)) {
        throw new Error("Unauthorized");
    }

    if (!isAdmin) {
        delete data.isFeatured; // only admin can update featured status. delete isFeatured field from data if user is not admin
    }

    const result = await prisma.post.update({
        where: {
            id: postData.id
        },
        data
    })

    return result;
}

export const postServices = {
    createPost,
    getAllPosts,
    getPostById,
    getMyPosts,
    updatePost,
}