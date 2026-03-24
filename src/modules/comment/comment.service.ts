import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
    content: string;
    postId: string;
    authorId: string;
    parentId?: string;
}) => {
    const postData = await prisma.post.findUnique({
        where: {
            id: payload.postId
        }
    });

    let commentData = null;
    if (payload.parentId) {
        commentData = await prisma.comment.findUnique({
            where: {
                id: payload.parentId
            }
        });
    }

    if (!postData || !commentData) {
        return null;
    }

    const result = await prisma.comment.create({
        data: payload
    });

    return result;
}

const getCommentsById = async (commentId: string) => {
    const result = await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    });

    return result;
}

const getCommentsByAuthor = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: { createdAt: 'desc' },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                }
            }
        }
    });
};

const deleteComment = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        }
    });

    if (!commentData) {
        throw new Error("Comment not found or you don't have permission to delete this comment");
    }

    if (commentData.authorId !== authorId) {
        throw new Error("You don't have permission to delete this comment");
    }

    return await prisma.comment.delete({
        where: {
            id: commentId
        }
    });
}

export const commentService = {
    createComment,
    getCommentsById,
    getCommentsByAuthor,
    deleteComment,
    
}