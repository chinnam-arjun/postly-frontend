import React from 'react';
import { Heart, Trash2, Reply } from 'lucide-react';

const getIdString = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return String(value?._id || value?.id || '');
};

const commentIsLikedByCurrentUser = (comment, currentUserId) => {
    if (!comment) return false;
    if (comment.isLiked || comment.likedByCurrentUser) return true;

    const userIdString = getIdString(currentUserId);
    if (!userIdString) return false;

    const likes = Array.isArray(comment.likes) ? comment.likes : [];
    return likes.some((likeOwner) => getIdString(likeOwner) === userIdString);
};

const CommentItem = ({
    comment,
    currentUserId,
    onReply,
    onDelete,
    onLike,
    depth = 0,
}) => {
    const author = comment.userId || comment.author || {};
    const isOwner = author?._id === currentUserId || author === currentUserId;
    const content = comment.content || comment.text || '';
    const parentName = comment.parentAuthorName || comment.parentAuthor || null;

    return (
        <div className={`flex flex-col gap-2 ${depth > 0 ? 'pt-2' : 'mt-4'}`}>
                <div className={`flex gap-3 group ${depth > 0 ? 'pl-4 border-l border-border' : ''}`}>
                    <div className="w-8 h-8 shrink-0 overflow-hidden rounded-full bg-surface-muted text-center text-sm font-bold text-text-secondary">
                    {author?.profile ? (
                        <img
                            src={author.profile}
                            alt={author.username || 'User avatar'}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        (author?.username || 'U').charAt(0).toUpperCase()
                    )}
                </div>

                <div className="flex flex-col grow">
                    <div className="bg-surface-elevated border border-border px-3 py-2 rounded-2xl rounded-tl-none">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-sm text-text-primary">{author?.username || 'Anonymous'}</span>
                                {parentName && (
                                    <span className="text-xs text-info">replying to @{parentName}</span>
                                )}
                            </div>

                            {isOwner && (
                                <button
                                    type="button"
                                    onClick={() => onDelete && onDelete(comment._id)}
                                    className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-danger transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                            <p className="mt-2 text-sm leading-6 text-text-secondary whitespace-pre-wrap">
                            {content}
                        </p>
                    </div>

                        <div className="flex flex-wrap items-center gap-3 mt-2 ml-1 text-[10px] font-bold text-text-secondary">
                        <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}</span>
                        <button
                            type="button"
                            onClick={() => onLike && onLike(comment._id)}
                                className={`flex items-center gap-1 transition ${commentIsLikedByCurrentUser(comment, currentUserId) ? 'text-danger' : 'text-text-secondary'} hover:text-danger`}
                        >
                            <Heart size={12} />
                            {comment.likesCount > 0 && <span className="text-sm">{comment.likesCount}</span>}
                        </button>
                        <button
                            type="button"
                                onClick={() => onReply && onReply(comment)}
                                className="flex items-center gap-1 text-text-secondary hover:text-info transition"
                        >
                            <Reply size={12} />
                            Reply
                        </button>
                    </div>
                </div>
            </div>

            {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <div className="flex flex-col gap-2">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            currentUserId={currentUserId}
                            onReply={onReply}
                            onDelete={onDelete}
                            onLike={onLike}
                            depth={Math.min(depth + 1, 3)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
/**
 * Key UI/UX Improvements:
Thread Visualizer: Added ml-10 border-l-2 to the child replies. This creates a vertical line that visually connects the replies to the parent, making the "nested" structure easy to follow.

/**
 * {
  "_id": "1",
  "text": "Parent comment",
  "author": { "username": "user_a", "profilepic": "..." },
  "replies": [
    {
      "_id": "2",
      "text": "Reply to a",
      "parentAuthorName": "user_a",
      "author": { "username": "user_c", "profilepic": "..." },
      "replies": []
    }
  ]
}
 */