import React from 'react';
import { Heart, Trash2, Reply } from 'lucide-react';

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
            <div className={`flex gap-3 group ${depth > 0 ? 'pl-4 border-l border-gray-800/40' : ''}`}>
                <div className="w-8 h-8 shrink-0 overflow-hidden rounded-full bg-slate-700 text-center text-sm font-bold text-white">
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
                    <div className="bg-gray-900 border border-gray-800 px-3 py-2 rounded-2xl rounded-tl-none">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-sm text-white">{author?.username || 'Anonymous'}</span>
                                {parentName && (
                                    <span className="text-xs text-blue-300">replying to @{parentName}</span>
                                )}
                            </div>

                            {isOwner && (
                                <button
                                    type="button"
                                    onClick={() => onDelete && onDelete(comment._id)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-gray-300 whitespace-pre-wrap">
                            {content}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-2 ml-1 text-[10px] font-bold text-gray-500">
                        <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}</span>
                        <button
                            type="button"
                            onClick={() => onLike && onLike(comment._id)}
                            className={`flex items-center gap-1 transition ${(comment.isLiked || comment.likedByCurrentUser) ? 'text-red-500' : 'text-gray-400'} hover:text-red-400`}
                        >
                            <Heart size={12} />
                            {comment.likesCount > 0 && <span className="text-sm">{comment.likesCount}</span>}
                        </button>
                        <button
                            type="button"
                            onClick={() => onReply && onReply(comment)}
                            className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition"
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

Bubble Style: Used bg-gray-50 with rounded-2xl for comments to separate the text from the actions (like/reply). This looks much cleaner than plain text.

Contextual Delete: The delete button only appears if you hover over the comment AND you either wrote that comment or you own the post.

Reply State: If you click "Reply", a small "Replying to @user" bar appears above the input box so the user knows where their comment is going.
 */

/**
 * 
 * const PostLayout = ({ post }) => {
    // ... existing states (isLiked, etc.)
    const [commentText, setCommentText] = useState("");
    const [replyTo, setReplyTo] = useState(null); // Stores { username, commentId }
    const commentInputRef = useRef(null);

    // Mock Current User (Replace with your Auth context)
    const currentUserId = "694fe1d21cf5ec903185730e";

    const handleReplyClick = (username, commentId) => {
        setReplyTo({ username, commentId });
        setCommentText(`@${username} `); // Add the mention to the input
        commentInputRef.current?.focus();
    };

    const handlePostComment = () => {
        // Logic to send to backend
        console.log("Posting:", commentText, "Reply to ID:", replyTo?.commentId);
        setCommentText("");
        setReplyTo(null);
    };

    return (
        <article className="...">
            

            
            <div className={`w-full lg:w-[40%] flex flex-col h-full bg-white dark:bg-gray-900 ...`}>
                <UserSection author={post.author}  />

               
                <div className="grow overflow-y-auto p-4 custom-scrollbar bg-white dark:bg-gray-900">
                    {post.comments.map(comment => (
                        <CommentItem 
                            key={comment._id} 
                            comment={comment} 
                            postAuthorId={post.author._id}
                            currentUserId={currentUserId}
                            onReply={handleReplyClick}
                            onDelete={(id) => console.log("Delete", id)}
                            onLike={(id) => console.log("Like", id)}
                        />
                    ))}
                </div>

                <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
                    {replyTo && (
                        <div className="flex justify-between items-center mb-2 px-2 text-xs">
                            <span className="text-gray-500">Replying to <span className="font-bold">@{replyTo.username}</span></span>
                            <button onClick={() => {setReplyTo(null); setCommentText("");}} className="text-gray-400 hover:text-black">Cancel</button>
                        </div>
                    )}

                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-2xl border dark:border-gray-700 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                        <input 
                            ref={commentInputRef}
                            type="text" 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..." 
                            className="w-full bg-transparent border-none focus:ring-0 text-sm dark:text-white"
                        />
                        <button 
                            onClick={handlePostComment}
                            disabled={!commentText.trim()}
                            className="text-blue-500 font-bold text-sm hover:text-blue-600 disabled:opacity-50"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};
 */


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