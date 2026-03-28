import React from 'react';
import { Heart, Trash2, Reply } from 'lucide-react';

const CommentItem = ({ 
    comment, 
    currentUserId, 
    onReply, 
    onDelete, 
    isReply = false 
}) => {
    // Check if the logged-in user is the one who wrote this comment
    const isOwner = comment.userId._id === currentUserId;

    const deleteMutation = useDeleteCommentMutation(postId);

const handleDelete = (id) => {
    if (window.confirm("Delete this comment?")) {
        deleteMutation.mutate(id);
    }
};

    return (
        <div className={`flex flex-col gap-2 ${isReply ? 'ml-10 mt-2 border-l-2 border-gray-100 dark:border-gray-800 pl-4' : 'mt-4'}`}>
            <div className="flex gap-3 group">
                <img 
                    src={comment.userId.profile} 
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-100" 
                    alt={comment.userId.username} 
                />
                
                <div className="flex flex-col grow">
                    {/* Comment Bubble */}
                    <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl rounded-tl-none">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-xs dark:text-white">
                                {comment.userId.username}
                            </span>
                            {isOwner && (
                                <button 
                                    onClick={() => onDelete(comment._id)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5 leading-snug">
                            {/* If it's a reply, we can prefix with @username logic if needed */}
                            {comment.content}
                        </p>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-4 mt-1 ml-2 text-[10px] font-bold text-gray-500 dark:text-gray-400">
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        <button className="hover:text-red-500 transition-colors flex items-center gap-1">
                            <Heart size={10} fill={comment.likesCount > 0 ? "currentColor" : "none"} />
                            {comment.likesCount > 0 ? comment.likesCount : 'Like'}
                        </button>
                        <button 
                            onClick={() => onReply(comment)} 
                            className="hover:text-blue-500 flex items-center gap-1"
                        >
                            <Reply size={10} />
                            Reply
                        </button>
                    </div>
                </div>
            </div>

            {/* Recursively render replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="flex flex-col">
                    {comment.replies.map((reply) => (
                        <CommentItem 
                            key={reply._id} 
                            comment={reply} 
                            currentUserId={currentUserId}
                            onReply={onReply}
                            onDelete={onDelete}
                            isReply={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
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