import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, X, Reply, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useCommentMutation, useDeleteCommentMutation } from '../../../hooks/usePosts.js'; // Import your hooks

const PostLayout = ({ post }) => {
    // --- Get current user from Redux ---
    const { user } = useSelector((state) => state.auth);
    const currentUserId = user?._id;
    
    // --- States ---
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showCommentsMobile, setShowCommentsMobile] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    
    const commentInputRef = useRef(null);

    // --- Mutations ---
    const commentMutation = useCommentMutation(post._id);
    const deleteMutation = useDeleteCommentMutation(post._id);

    // --- Handlers ---
    const handleCommentAction = () => {
        if (window.innerWidth < 1024) setShowCommentsMobile(true);
        else commentInputRef.current?.focus();
    };

    const handleReplyClick = (comment) => {
        setReplyingTo(comment);
        setCommentText(`@${comment.userId?.username || 'user'} `);
        if (window.innerWidth < 1024) setShowCommentsMobile(true);
        setTimeout(() => commentInputRef.current?.focus(), 100);
    };

    const handlePostComment = () => {
        if (!commentText.trim()) return;
        commentMutation.mutate({
            content: commentText,
            parentCommentId: replyingTo?._id 
        }, {
            onSuccess: () => {
                setCommentText("");
                setReplyingTo(null);
            }
        });
    };

    // --- Scroll Lock Effect ---
    useEffect(() => {
        if (showCommentsMobile && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [showCommentsMobile]);

    return (
        <article className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-sm lg:h-[650px] relative">
            
            {/* LEFT SIDE: Media & Main Info */}
            <div className="w-full lg:w-[60%] flex flex-col border-r dark:border-gray-800 h-full">
                {/* Mobile User Header */}
                <div className="lg:hidden">
                    <UserHeader author={post.author} isFollowing={isFollowing} setIsFollowing={setIsFollowing} />
                </div>

                {/* Desktop Title */}
                <div className="hidden lg:flex p-4 border-b dark:border-gray-800 h-16 items-center justify-between bg-white dark:bg-gray-900">
                    <h2 className="text-sm font-bold text-gray-800 dark:text-white truncate">{post.title}</h2>
                    <MoreHorizontal className="text-gray-400 cursor-pointer" size={18} />
                </div>

                {/* Media */}
                <div className="relative aspect-square lg:aspect-auto lg:grow bg-black flex items-center justify-center">
                    <img src={post.images} alt="Post content" className="w-full h-full object-contain" />
                </div>

                {/* Interactions */}
                <div className="p-4 flex items-center justify-between bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-5">
                        <Heart 
                            onClick={() => setIsLiked(!isLiked)}
                            className={`cursor-pointer transition-all active:scale-125 ${isLiked ? 'text-red-500 fill-red-500' : 'dark:text-white'}`} 
                            size={24} 
                        />
                        <MessageCircle onClick={handleCommentAction} className="cursor-pointer dark:text-white" size={24} />
                        <Share2 className="cursor-pointer dark:text-white" size={22} />
                    </div>
                    <Bookmark 
                        onClick={() => setIsSaved(!isSaved)}
                        className={`cursor-pointer ${isSaved ? 'text-yellow-500 fill-yellow-500' : 'dark:text-white'}`} 
                        size={24} 
                    />
                </div>

                {/* Caption */}
                <div className="px-4 pb-4 bg-white dark:bg-gray-900">
                    <p className="text-sm font-bold dark:text-white mb-1">{isLiked ? post.likesCount + 1 : post.likesCount} likes</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-bold mr-2">{post.author.username}</span>
                        {post.caption}
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: Comments */}
            <div className={`
                w-full lg:w-[40%] flex flex-col h-full bg-white dark:bg-gray-900
                ${showCommentsMobile ? 'fixed inset-0 z-[60] pt-10 lg:pt-0' : 'hidden lg:flex'} 
                lg:relative border-l dark:border-gray-800
            `}>
                <div className="absolute top-4 right-4 lg:hidden z-[70]">
                    <X className="dark:text-white cursor-pointer" onClick={() => setShowCommentsMobile(false)} />
                </div>

                <UserHeader author={post.author} isFollowing={isFollowing} setIsFollowing={setIsFollowing} />

                {/* Comments List */}
                <div className="grow overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {post.comments?.map(comment => (
                        <CommentItem 
                            key={comment._id} 
                            comment={comment} 
                            currentUserId={currentUserId}
                            onReply={handleReplyClick}
                            onDelete={(id) => deleteMutation.mutate(id)}
                        />
                    ))}
                </div>

                {/* Comment Input Section */}
                <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
                    {replyingTo && (
                        <div className="flex justify-between items-center mb-2 px-2 bg-blue-50 dark:bg-blue-900/20 py-1 rounded-lg">
                            <span className="text-[10px] text-blue-500 font-bold">Replying to @{replyingTo.userId?.username || 'user'}</span>
                            <X size={12} className="cursor-pointer text-blue-500" onClick={() => {setReplyingTo(null); setCommentText("");}} />
                        </div>
                    )}
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full border dark:border-gray-700 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
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
                            disabled={commentMutation.isPending || !commentText.trim()}
                            className="text-blue-500 font-bold text-sm disabled:opacity-30"
                        >
                            {commentMutation.isPending ? "..." : "Post"}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

// --- Sub-Component: User Header ---
const UserHeader = ({ author, isFollowing, setIsFollowing }) => (
    <div className="p-4 flex items-center justify-between border-b dark:border-gray-800 h-16 shrink-0 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
            <img src={author.profilepic} className="w-9 h-9 rounded-full object-cover border" alt="" />
            <div className="flex flex-col">
                <span className="font-bold text-sm dark:text-white">{author.username}</span>
                <span className="text-[10px] text-gray-400">Post Author</span>
            </div>
        </div>
        <button 
            onClick={() => setIsFollowing(!isFollowing)}
            className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${isFollowing ? 'bg-gray-100 text-gray-800' : 'bg-blue-500 text-white'}`}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    </div>
);

// --- Sub-Component: Comment Item (Recursive) ---
const CommentItem = ({ comment, currentUserId, onReply, onDelete, isReply = false }) => {
    // userId is just a string ID from your backend, not a full user object
    const isOwner = comment.userId === currentUserId;
    console.log(comment.userId, currentUserId);

    return (
        <div className={`flex flex-col ${isReply ? 'ml-8 mt-2 border-l dark:border-gray-800 pl-3' : 'mt-4'}`}>
            <div className="flex gap-2 group">
                <img src={comment.userId?.profile || 'https://via.placeholder.com/28'} className="w-7 h-7 rounded-full object-cover shrink-0" alt="" />
                <div className="flex flex-col grow">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl rounded-tl-none">
                        <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-[11px] dark:text-gray-300">{comment.userId?.username || 'Anonymous'}</span>
                            {isOwner && (
                                <Trash2 size={10} className="text-gray-400 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100" onClick={() => onDelete(comment._id)} />
                            )}
                        </div>
                        <p className="text-xs text-gray-800 dark:text-gray-200 leading-snug">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 ml-1 text-[9px] font-bold text-gray-500">
                        <span>2h</span>
                        <button className="hover:text-red-500">Like</button>
                        <button onClick={() => onReply(comment)} className="hover:text-blue-500 flex items-center gap-1">
                            <Reply size={10} /> Reply
                        </button>
                    </div>
                </div>
            </div>
            {comment.replies?.map(reply => (
                <CommentItem key={reply._id} comment={reply} currentUserId={currentUserId} onReply={onReply} onDelete={onDelete} isReply={true} />
            ))}
        </div>
    );
};

export default PostLayout;