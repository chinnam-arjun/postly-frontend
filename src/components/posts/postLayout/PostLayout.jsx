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
        <article className="w-full bg-gray-900 border border-gray-800/50 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-xl lg:h-[650px] relative">
            
            {/* LEFT SIDE: Media & Main Info */}
            <div className="w-full lg:w-[60%] flex flex-col border-r border-gray-800/50 h-full">
                {/* Mobile User Header */}
                <div className="lg:hidden">
                    <UserHeader author={post.author} isFollowing={isFollowing} setIsFollowing={setIsFollowing} />
                </div>

                {/* Desktop Title */}
                <div className="hidden lg:flex px-4 border-b border-gray-800/50 h-14 items-center justify-between bg-gray-900/50">
                    <h2 className="text-sm font-bold text-gray-200 truncate">{post.title}</h2>
                    <MoreHorizontal className="text-gray-500 cursor-pointer hover:text-gray-300 transition-colors" size={18} />
                </div>

                {/* Media */}
                <div className="relative aspect-square lg:aspect-auto lg:grow bg-black flex items-center justify-center">
                    <img src={post.images} alt="Post content" className="w-full h-full object-contain" />
                </div>

                {/* Interactions */}
                <div className="p-4 flex items-center justify-between bg-gray-900">
                    <div className="flex items-center gap-5">
                        <Heart 
                            onClick={() => setIsLiked(!isLiked)}
                            className={`cursor-pointer transition-all active:scale-125 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-gray-200'}`} 
                            size={24} 
                        />
                        <MessageCircle onClick={handleCommentAction} className="cursor-pointer text-gray-400 hover:text-gray-200" size={24} />
                        <Share2 className="cursor-pointer text-gray-400 hover:text-gray-200" size={22} />
                    </div>
                    <Bookmark 
                        onClick={() => setIsSaved(!isSaved)}
                        className={`cursor-pointer transition-all ${isSaved ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400 hover:text-gray-200'}`} 
                        size={24} 
                    />
                </div>

                {/* Caption */}
                <div className="px-4 pb-4 bg-gray-900">
                    <p className="text-sm font-bold text-white mb-1">{isLiked ? post.likesCount + 1 : post.likesCount} likes</p>
                    <p className="text-sm text-gray-400">
                        <span className="font-bold mr-2 text-gray-200">{post.author.username}</span>
                        {post.caption}
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: Comments */}
            <div className={`
                w-full lg:w-[40%] flex flex-col h-full bg-gray-950/50
                ${showCommentsMobile ? 'fixed inset-0 z-[60] pt-10 lg:pt-0' : 'hidden lg:flex'} 
                lg:relative border-l border-gray-800/50
            `}>
                <div className="absolute top-4 right-4 lg:hidden z-[70]">
                    <X className="text-gray-400 cursor-pointer hover:text-white transition-colors" onClick={() => setShowCommentsMobile(false)} />
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
                <div className="p-4 border-t border-gray-800/50 bg-gray-900">
                    {replyingTo && (
                        <div className="flex justify-between items-center mb-2 px-2 bg-blue-900/20 py-1 rounded-lg">
                            <span className="text-[10px] text-blue-400 font-bold">Replying to @{replyingTo.userId?.username || 'user'}</span>
                            <X size={12} className="cursor-pointer text-blue-400" onClick={() => {setReplyingTo(null); setCommentText("");}} />
                        </div>
                    )}
                    <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full border border-gray-700 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                        <input 
                            ref={commentInputRef}
                            type="text" 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..." 
                            className="w-full bg-transparent border-none focus:ring-0 text-sm text-white"
                        />
                        <button 
                            onClick={handlePostComment}
                            disabled={commentMutation.isPending || !commentText.trim()}
                            className="text-blue-400 font-bold text-sm disabled:opacity-30"
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
    <div className="p-4 flex items-center justify-between border-b border-gray-800/50 h-14 shrink-0 bg-gray-900">
        <div className="flex items-center gap-3">
            <img src={author.profilepic} className="w-8 h-8 rounded-full object-cover border border-gray-700" alt="" />
            <div className="flex flex-col">
                <span className="font-bold text-xs text-white">{author.username}</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">Author</span>
            </div>
        </div>
        <button 
            onClick={() => setIsFollowing(!isFollowing)}
            className={`text-[10px] font-bold px-4 py-1.5 rounded-full transition-all ${isFollowing ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'}`}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    </div>
);

// --- Sub-Component: Comment Item (Recursive) ---
const CommentItem = ({ comment, currentUserId, onReply, onDelete, isReply = false }) => {
    // userId is just a string ID from your backend, not a full user object
    const isOwner = comment.userId === currentUserId;

    return (
        <div className={`flex flex-col ${isReply ? 'ml-8 mt-2 border-l border-gray-800/50 pl-3' : 'mt-4'}`}>
            <div className="flex gap-2 group">
                <img src={comment.userId?.profile || 'https://via.placeholder.com/28'} className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-800" alt="" />
                <div className="flex flex-col grow">
                    <div className="bg-gray-800/40 p-2 rounded-xl rounded-tl-none border border-gray-800/30">
                        <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-[11px] text-gray-300">{comment.userId?.username || 'Anonymous'}</span>
                            {isOwner && (
                                <Trash2 size={10} className="text-gray-500 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDelete(comment._id)} />
                            )}
                        </div>
                        <p className="text-xs text-gray-400 leading-snug">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 ml-1 text-[9px] font-bold text-gray-600">
                        <span>2h</span>
                        <button className="hover:text-red-400 transition-colors">Like</button>
                        <button onClick={() => onReply(comment)} className="hover:text-blue-400 flex items-center gap-1 transition-colors">
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