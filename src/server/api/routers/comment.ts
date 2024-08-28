import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { NotificationType, PrismaClient } from 'database'
import { filterBadWords } from '@/utils/username.util'

async function deleteCommentAndReplies(prisma: PrismaClient, commentId: string) {
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: { replies: true },
    })

    if (!comment) return

    // Recursively delete all replies
    for (const reply of comment.replies) {
        await deleteCommentAndReplies(prisma, reply.id)
    }

    // Delete the comment itself
    await prisma.comment.delete({ where: { id: commentId } })
}

export const commentRouter = createTRPCRouter({
    getComments: protectedProcedure
        .input(
            z.object({
                postId: z.string(),
                cursor: z.string().nullish(),
                limit: z.number().min(1).max(100).default(20),
            })
        )
        .query(async ({ ctx, input }) => {
            const { postId, cursor, limit } = input
            const comments = await ctx.prisma.comment.findMany({
                where: { postId, parentId: null },
                take: limit + 1,
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: true,
                    _count: { select: { replies: true, likes: true } },
                },
            })

            let nextCursor: typeof cursor | undefined = undefined
            if (comments.length > limit) {
                const nextItem = comments.pop()
                nextCursor = nextItem!.id
            }

            return {
                comments: comments.map((comment) => ({
                    ...comment,
                    replyCount: comment._count.replies,
                    likeCount: comment._count.likes,
                })),
                nextCursor,
            }
        }),

    getReplies: protectedProcedure
        .input(z.object({ commentId: z.string() }))
        .query(async ({ ctx, input }) => {
            const replies = await ctx.prisma.comment.findMany({
                where: { parentId: input.commentId },
                orderBy: { createdAt: 'asc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            image: true,
                        },
                    },
                    _count: { select: { replies: true, likes: true } },
                },
            })

            return replies.map((reply) => ({
                ...reply,
                replyCount: reply._count.replies,
                likeCount: reply._count.likes,
            }))
        }),

    addComment: protectedProcedure
        .input(z.object({ postId: z.string(), content: z.string() }))
        .mutation(async ({ ctx, input }) => {
            if (filterBadWords(input.content)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Comment contains bad words",
                });
            }

            const comment = await ctx.prisma.comment.create({
                data: {
                    content: input.content,
                    postId: input.postId,
                    userId: ctx.session.user.id,
                },
                include: { post: { select: { userId: true } } },
            })

            await ctx.prisma.notification.create({
                data: {
                    type: NotificationType.POST_COMMENT,
                    targetUserId: comment.post.userId,
                    userId: ctx.session.user.id,
                    postId: input.postId,
                },
            })

            return comment
        }),

    addReply: protectedProcedure
        .input(z.object({ commentId: z.string(), content: z.string() }))
        .mutation(async ({ ctx, input }) => {
            if (filterBadWords(input.content)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Reply contains bad words",
                });
            }

            const parentComment = await ctx.prisma.comment.findUnique({
                where: { id: input.commentId },
                select: { userId: true, postId: true },
            })

            if (!parentComment) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Parent comment not found' })
            }

            const reply = await ctx.prisma.comment.create({
                data: {
                    content: input.content,
                    userId: ctx.session.user.id,
                    parentId: input.commentId,
                    postId: parentComment.postId,
                },
            })

            await ctx.prisma.notification.create({
                data: {
                    type: NotificationType.COMMENT_REPLY,
                    targetUserId: parentComment.userId,
                    userId: ctx.session.user.id,
                    postId: parentComment.postId,
                },
            })

            return reply
        }),

    toggleLikeComment: protectedProcedure
        .input(z.object({ commentId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { commentId } = input;

            const existingLike = await ctx.prisma.commentLike.findUnique({
                where: {
                    userId_commentId: {
                        userId: ctx.session.user.id,
                        commentId: commentId,
                    },
                },
            });

            if (existingLike) {
                // Unlike
                await ctx.prisma.commentLike.delete({
                    where: { id: existingLike.id },
                });
            } else {
                // Like
                await ctx.prisma.commentLike.create({
                    data: {
                        userId: ctx.session.user.id,
                        commentId: commentId,
                    },
                });
            }

            // Get the updated like count
            const updatedComment = await ctx.prisma.comment.findUnique({
                where: { id: commentId },
                include: { _count: { select: { likes: true } } },
            });

            return {
                success: true,
                likeCount: updatedComment?._count.likes ?? 0,
                isLiked: !existingLike,
            };
        }),

    editComment: protectedProcedure
        .input(z.object({ commentId: z.string(), content: z.string() }))
        .mutation(async ({ ctx, input }) => {
            if (filterBadWords(input.content)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Comment contains bad words",
                });
            }

            const comment = await ctx.prisma.comment.findUnique({
                where: { id: input.commentId },
                select: { userId: true },
            })

            if (!comment) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
            }

            if (comment.userId !== ctx.session.user.id) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only edit your own comments' })
            }

            const updatedComment = await ctx.prisma.comment.update({
                where: { id: input.commentId },
                data: { content: input.content },
            })

            return updatedComment
        }),

    deleteComment: protectedProcedure
        .input(z.object({ commentId: z.string(), postOwnerId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const comment = await ctx.prisma.comment.findUnique({
                where: { id: input.commentId },
                include: { replies: true },
            })

            if (!comment) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
            }

            if (comment.userId !== ctx.session.user.id && ctx.session.user.id !== input.postOwnerId && !ctx.session.user.admin) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only delete your own comments or comments on your own posts' })
            }

            // Delete all replies recursively
            await deleteCommentAndReplies(ctx.prisma, input.commentId)

            return { success: true }
        }),
})