import { useState } from 'react'
import { api } from '~/trpc/react'
import { Avatar } from '../../ui/Avatar'
import { Button } from '../../ui/Button'
import type { PostProps } from './post'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { PiFloppyDisk, PiPaperPlaneRight } from 'react-icons/pi'

type CommentType = {
    id: string
    content: string
    userId: string
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

    const { data: comments, fetchNextPage, hasNextPage } = api.comment.getComments.useInfiniteQuery(
        { postId: post.id },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )

    const { mutate: addComment } = api.comment.addComment.useMutation({
        onSuccess: () => {
            setCommentText('')
            void ctx.comment.getComments.invalidate({ postId: post.id })
        },
    })

    const handleSubmitComment = () => {
        if (commentText.trim()) {
            addComment({ postId: post.id, content: commentText })
        }
    }

    return (
        <div className="flex flex-col h-[500px]">
            <div className="flex-grow overflow-y-auto">
                {comments?.pages.map((page) =>
                    page.comments.map((comment) => (
                        <Comment key={comment.id} comment={comment} postId={post.id} />
                    ))
                )}
                {hasNextPage && (
                    <Button onClick={() => fetchNextPage()}>Load more comments</Button>
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

function Comment({ comment, postId }: { comment: CommentType; postId: string }) {
    const [replyText, setReplyText] = useState('')
    const [showReplies, setShowReplies] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(comment.content)
    const ctx = api.useUtils()
    const { data: session } = useSession()

    const { data: replies } = api.comment.getReplies.useQuery(
        { commentId: comment.id },
        { enabled: showReplies }
    )

    const { mutate: addReply } = api.comment.addReply.useMutation({
        onSuccess: () => {
            setReplyText('')
            void ctx.comment.getReplies.invalidate({ commentId: comment.id })
        },
    })

    const { mutate: likeComment } = api.comment.likeComment.useMutation({
        onSuccess: () => {
            void ctx.comment.getComments.invalidate({ postId })
        },
    })

    const { mutate: editComment } = api.comment.editComment.useMutation({
        onSuccess: () => {
            setIsEditing(false)
            void ctx.comment.getComments.invalidate({ postId })
        },
    })

    const { mutate: deleteComment } = api.comment.deleteComment.useMutation({
        onSuccess: () => {
            void ctx.comment.getComments.invalidate({ postId })
        },
    })

    const handleSubmitReply = () => {
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
        toast.success('Comment deleted')
        deleteComment({ commentId: comment.id })
    }

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
                        <p>{comment.content}</p>
                    )}
                    <div className="mt-1 text-sm text-gray-500">
                        <button onClick={() => likeComment({ commentId: comment.id })}>
                            Like ({comment.likeCount})
                        </button>
                        <button onClick={() => setShowReplies(!showReplies)} className="ml-2">
                            {showReplies ? 'Hide replies' : 'View replies'} ({comment.replyCount})
                        </button>
                        {comment.userId === session?.user.id && (
                            <>
                                <button onClick={() => setIsEditing(true)} className="ml-2">
                                    Edit
                                </button>
                                <button onClick={handleDeleteComment} className="ml-2">
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {showReplies && (
                <div className="ml-8 mt-2">
                    {replies?.map((reply) => (
                        <Comment key={reply.id} comment={reply} postId={postId} />
                    ))}
                    <div className="mt-2 flex">
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
                </div>
            )}
        </div>
    )
}