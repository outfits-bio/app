import { useState } from 'react'
import { api } from '@/trpc/react'
import { Avatar } from '../../ui/Avatar'
import { Button } from '../../ui/Button'
import type { PostProps } from './post'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { PiFloppyDisk, PiPaperPlaneRight, PiHeart, PiHeartFill } from 'react-icons/pi'
import Link from 'next/link'
import { handleErrors } from '@/utils/handle-errors.util'

type CommentType = {
    id: string
    content: string
    userId: string
    createdAt: Date
    user: {
        id: string
        image: string | null
        username: string | null
    }
    likeCount: number
    replyCount: number
}

export function CommentSection({ post }: PostProps) {
    const [commentText, setCommentText] = useState('')
    const ctx = api.useUtils()
    const { data: session } = useSession()

    const { data: comments, fetchNextPage, hasNextPage } = api.comment.getComments.useInfiniteQuery(
        { postId: post.id },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )

    const { mutate: sendPushNotification } = api.notifications.sendPushNotification.useMutation();

    const { mutate: addComment } = api.comment.addComment.useMutation({
        onSuccess: () => {
            setCommentText('')
            void ctx.comment.getComments.invalidate({ postId: post.id })

            sendPushNotification({
                userId: post.user.id,
                body: `${session?.user.username} replied to your post`,
            });
        },
        onError: (e) => handleErrors({ e, message: "Failed to add comment!" })
    })

    const handleSubmitComment = () => {
        if (commentText.trim()) {
            addComment({ postId: post.id, content: commentText })
        }
    }

    return (
        <div className="flex flex-col h-[500px]">
            <div className="flex-grow overflow-y-auto">
                {comments?.pages[0]?.comments.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>It's kinda empty here, start the conversation.</p>
                    </div>
                ) : (
                    <>
                        {comments?.pages.map((page) =>
                            page.comments.map((comment) => (
                                <Comment key={comment.id} comment={comment} postId={post.id} postOwnerId={post.user.id} />
                            ))
                        )}
                        {hasNextPage && (
                            <Button onClick={() => fetchNextPage()}>Load more comments</Button>
                        )}
                    </>
                )}
            </div>
            <div className="mt-4 flex">
                <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="pl-3 flex-grow rounded-md border border-stroke mr-2"
                />
                <Button onClick={handleSubmitComment} className="max-w-fit px-3">
                    <PiPaperPlaneRight className='text-xl' />
                </Button>
            </div>
        </div>
    )
}

function Comment({ comment, postId, postOwnerId }: { comment: CommentType; postId: string; postOwnerId: string }) {
    const [replyText, setReplyText] = useState('')
    const [showReplies, setShowReplies] = useState(false)
    const [showReplyInput, setShowReplyInput] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(comment.content)
    const ctx = api.useUtils()
    const { data: session } = useSession()

    const [isLiked, setIsLiked] = useState(false)
    const [localLikeCount, setLocalLikeCount] = useState(comment.likeCount)
    const { mutate: sendPushNotification } = api.notifications.sendPushNotification.useMutation();

    const { mutate: toggleLikeComment } = api.comment.toggleLikeComment.useMutation({
        onSuccess: (data) => {
            setIsLiked(data.isLiked)
            setLocalLikeCount(data.likeCount)
            void ctx.comment.getComments.invalidate({ postId })

            sendPushNotification({
                userId: comment.userId,
                body: `${session?.user.username} liked your comment`,
            });
        },
    })

    const { mutate: addReply } = api.comment.addReply.useMutation({
        onSuccess: () => {
            setReplyText('')
            setShowReplyInput(false)
            void ctx.comment.getReplies.invalidate({ commentId: comment.id })
            // Add this line to update the comment count
            void ctx.comment.getComments.invalidate({ postId })

            sendPushNotification({
                userId: comment.userId,
                body: `${session?.user.username} replied to your comment`,
            });
        },
        onError: (e) => handleErrors({ e, message: "Failed to add reply!" })
    })

    const { mutate: editComment } = api.comment.editComment.useMutation({
        onSuccess: (updatedComment) => {
            setIsEditing(false)
            void ctx.comment.getComments.invalidate({ postId })
            // Update the parent comment's replies if this is a subcomment
            if (comment.replyCount === 0) {
                void ctx.comment.getReplies.invalidate({ commentId: comment.id })
            }
            // Update the local comment state
            Object.assign(comment, updatedComment)
        },
        onError: (e) => handleErrors({ e, message: "Failed to edit comment!" })
    })

    const { mutate: deleteComment } = api.comment.deleteComment.useMutation({
        onSuccess: () => {
            void ctx.comment.getComments.invalidate({ postId })
            // Update the parent comment's replies if this is a subcomment
            if (comment.replyCount === 0) {
                void ctx.comment.getReplies.invalidate({ commentId: comment.id })
            }
            toast.success('Comment deleted')
        },
        onError: (e) => handleErrors({ e, message: "Failed to delete comment!" })
    })

    const { data: replies } = api.comment.getReplies.useQuery(
        { commentId: comment.id },
        { enabled: showReplies }
    )


    const handleSubmitReply = async () => {
        if (replyText.trim()) {
            addReply({ commentId: comment.id, content: replyText })
        }
    }

    const handleEditComment = () => {
        if (editText.trim() && editText !== comment.content) {
            editComment({ commentId: comment.id, content: editText })
        } else {
            setIsEditing(false)
        }
    }

    const handleDeleteComment = () => {
        deleteComment({ commentId: comment.id, postOwnerId: postOwnerId })
    }

    const handleToggleLike = () => {
        toggleLikeComment({ commentId: comment.id })
    }

    const canDeleteComment = (session?.user.id === comment.userId) || (session?.user.admin ?? (session?.user.id === postOwnerId))

    return (
        <div className="mb-4">
            <div className="flex items-start">
                <Avatar
                    image={comment.user.image}
                    id={comment.user.id}
                    username={comment.user.username}
                    size="xs"
                />
                <div className="ml-2 flex-grow">
                    <p className="font-bold">{comment.user.username}</p>
                    {isEditing ? (
                        <div className="flex">
                            <input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="pl-3 flex-grow rounded-md border border-stroke mr-2"
                            />
                            <Button onClick={handleEditComment} className="max-w-fit px-3">
                                <PiFloppyDisk className='text-xl' />
                            </Button>
                            <Button onClick={() => setIsEditing(false)} className="ml-2 w-fit">
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <p>
                            {comment.content.split(/(@\w+)/).map((part, index) => {
                                if (part.startsWith('@')) {
                                    const linkText = part.substring(1);
                                    return (
                                        <Link key={index} href={`/${linkText}`}>
                                            <strong>{part}</strong>
                                        </Link>
                                    );
                                }
                                return part;
                            })}
                        </p>
                    )}
                    <div className="mt-1 text-sm text-gray-500 flex items-center justify-between">
                        <div>
                            {comment.replyCount > 0 && (
                                <button onClick={() => setShowReplies(!showReplies)} className="mr-2">
                                    {showReplies ? 'Hide replies' : 'View replies'} ({comment.replyCount})
                                </button>
                            )}
                            <button onClick={() => setShowReplyInput(!showReplyInput)} className="mr-2">
                                Reply
                            </button>
                            {comment.userId === session?.user.id && (
                                <button onClick={() => setIsEditing(true)} className="mr-2">
                                    Edit
                                </button>
                            )}
                            {canDeleteComment && (
                                <button onClick={handleDeleteComment} className="mr-2">
                                    Delete
                                </button>
                            )}
                            <span className="cursor-default">
                                {(() => {
                                    const now = new Date();
                                    const createdAt = new Date(comment.createdAt);
                                    const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
                                    const diffInHours = Math.floor(diffInMinutes / 60);
                                    const diffInDays = Math.floor(diffInHours / 24);
                                    const diffInWeeks = Math.floor(diffInDays / 7);
                                    const diffInMonths = (now.getFullYear() - createdAt.getFullYear()) * 12 + now.getMonth() - createdAt.getMonth();

                                    if (diffInMinutes < 60) {
                                        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
                                    } else if (diffInHours < 24) {
                                        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
                                    } else if (diffInDays < 7) {
                                        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
                                    } else if (diffInWeeks < 4) {
                                        return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
                                    } else if (diffInMonths < 1) {
                                        return createdAt.toLocaleDateString();
                                    } else {
                                        return createdAt.toLocaleDateString();
                                    }
                                })()}
                            </span>
                        </div>
                        <button onClick={handleToggleLike} className="flex items-center">
                            {isLiked ? <PiHeartFill className="text-red-500" /> : <PiHeart />}
                            <span className="ml-1">{localLikeCount}</span>
                        </button>
                    </div>
                </div>
            </div>
            {showReplyInput && (
                <div className="mt-2 ml-8 flex">
                    <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Reply to this comment..."
                        className="pl-3 flex-grow rounded-md border border-stroke mr-2"
                    />
                    <Button onClick={handleSubmitReply} className="max-w-fit px-3">
                        <PiPaperPlaneRight className='text-xl' />
                    </Button>
                </div>
            )}
            {showReplies && (
                <div className="ml-8 mt-2">
                    {replies?.map((reply: CommentType) => (
                        <Comment key={reply.id} comment={reply} postId={postId} postOwnerId={postOwnerId} />
                    ))}
                </div>
            )}
        </div>
    )
}