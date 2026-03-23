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

export const commentService = {
    createComment
}