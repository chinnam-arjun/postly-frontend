/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, X, Reply, Trash2, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../utils/AxiosInstance';
import { useCommentMutation, useDeleteCommentMutation, useLikeCommentMutation } from '../../../hooks/usePosts.js';
import { toggleLikePostThunk, toggleSavePostThunk } from '../../../redux_thunks/postThunk.js';
import { followThunk } from '../../../redux_thunks/userThunk.js';
import { updateAuthorFollowing } from '../../../redux_slices/postSlice.js';
import { setFollowRelationship } from '../../../redux_slices/authSlice.js';

const normalizeUserIds = (value = []) => {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => typeof item === 'string' ? item : item?._id || item?.id)
        .filter(Boolean)
        .map(String);
};

const getAuthorId = (author) => (author?._id ? String(author._id) : '');

const getInitials = (name = '') => {
    if (!name) return '';
    return name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0].toUpperCase())
        .slice(0, 2)
        .join('');
};

const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return 'Just now';

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(months / 12);
    return `${years}y ago`;
};

const formatCount = (value) => {
    const count = Number(value ?? 0);
    if (Number.isNaN(count)) return '0';
    if (count < 1000) return `${count}`;
    if (count < 1000000) return `${(count / 1000).toFixed(count < 10000 ? 1 : 0).replace(/\.0$/, '')}k`;
    return `${(count / 1000000).toFixed(count < 10000000 ? 1 : 0).replace(/\.0$/, '')}m`;
};

const AuthorAvatar = ({ author, sizeClasses = 'w-8 h-8', iconSize = 14, borderClass = 'border-gray-700' }) => {
    const profileUrl = author?.profilepic || author?.profile || '';
    const initials = getInitials(author?.username);

    if (profileUrl) {
        return (
            <img
                src={profileUrl}
                className={`${sizeClasses} rounded-full object-cover border ${borderClass}`}
                alt={author?.username || 'Author avatar'}
            />
        );
    }

    return (
        <div className={`${sizeClasses} rounded-full border ${borderClass} bg-gray-800 text-gray-400 grid place-items-center`}> 
            {initials ? (
                <span className="text-[10px] font-bold uppercase">{initials}</span>
            ) : (
                <User size={iconSize} />
            )}
        </div>
    );
};

// const normalizeComment = (comment) => ({
//     ...comment,
//     content: comment.content || comment.text || '',
//     parentCommentId: comment.parentCommentId || null,
//     replies: Array.isArray(comment.replies) ? comment.replies.map(normalizeComment) : [],
// });

const buildCommentTree = (comments = []) => {
    const flattenReplies = (replies = []) => {
        const result = [];

        const dfs = (items) => {
            items.forEach((reply) => {
                const children = reply.replies || [];

                result.push({
                    ...reply,
                    replies: [], // stop recursive rendering
                });

                if (children.length) {
                    dfs(children);
                }
            });
        };

        dfs(replies);

        result.sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );

        return result;
    };

    return comments.map((comment) => ({
        ...comment,
        replies: flattenReplies(comment.replies || []),
    }));
};

const PostLayout = ({ post }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const reduxPost = useSelector((state) => state.posts.postsById?.[post._id] || null);
    const currentPost = reduxPost || post;
    const currentPostId = currentPost?._id;
    const currentUserId = user?._id;

    const [showCommentsMobile, setShowCommentsMobile] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const commentInputRef = useRef(null);

    const mediaItems = Array.isArray(currentPost?.images)
        ? currentPost.images
        : currentPost?.images
            ? [currentPost.images]
            : [];

    const getMediaUrl = (media) => {
        if (typeof media === 'string') return media;
        return media?.url || media?.secure_url || media?.src || '';
    };

    const currentImageUrl = mediaItems.length > 0 ? getMediaUrl(mediaItems[currentImageIndex]) : '';
    const [comments, setComments] = useState(currentPost?.comments || []);
    const commentTree = useMemo(() => buildCommentTree(comments), [comments]);
    const likesCount = currentPost?.likesCount ?? currentPost?.likes?.length ?? 0;
    const isLiked = Boolean(currentPost?.isLiked);
    const isSaved = Boolean(currentPost?.isSaved);

    const goToPreviousImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
    };

    const goToNextImage = () => {
        setCurrentImageIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
    };

    const commentMutation = useCommentMutation(currentPost._id);
    const deleteMutation = useDeleteCommentMutation(currentPost._id);
    const likeCommentMutation = useLikeCommentMutation(currentPost._id);

    const fetchCommentsForPost = useCallback(async () => {
        if (!currentPostId) return;
        try {
            const response = await axiosInstance.get(`/posts/${currentPostId}/comments`);
            console.log(response.data.comments);
            const data = response.data;
            if (Array.isArray(data.comments)) {
                setComments(data.comments);
            }
        } catch (err) {
            console.error('Failed to fetch post comments:', err);
        }
    }, [currentPostId]);

    const handleCommentAction = () => {
        if (window.innerWidth < 1024) setShowCommentsMobile(true);
        else commentInputRef.current?.focus();
    };

    const handleReplyClick = (comment) => {
        setReplyingTo(comment);
        setCommentText(`@${comment.userId?.username || comment.author?.username || 'user'} `);
        if (window.innerWidth < 1024) setShowCommentsMobile(true);
        setTimeout(() => commentInputRef.current?.focus(), 100);
    };

    const handlePostComment = async () => {
        if (!commentText.trim()) return;

        await commentMutation.mutateAsync(
            {
                content: commentText,
                parentCommentId: replyingTo?._id
            }
        );

        setCommentText("");
        setReplyingTo(null);
        fetchCommentsForPost();
    };

    const handleDeleteComment = (commentId) => {
        if (!commentId) return;
        if (!window.confirm('Delete this comment?')) return;
        deleteMutation.mutate(commentId, {
            onSuccess: () => fetchCommentsForPost(),
        });
    };

    const handleLikeComment = (commentId) => {
        if (!commentId || !currentUserId) return;
        likeCommentMutation.mutate(commentId, {
            onSuccess: () => fetchCommentsForPost(),
        });
    };

    const handleToggleLike = () => {
        if (!currentUserId) return;
        dispatch(toggleLikePostThunk(currentPost._id));
    };

    const renderComment = (comment) => (
        <CommentItem
            key={comment._id}
            comment={comment}
            currentUserId={currentUserId}
            onReply={handleReplyClick}
            onDelete={handleDeleteComment}
            onLike={handleLikeComment}
        />
    );

    const handleToggleSave = () => {
        if (!currentUserId) return;
        dispatch(toggleSavePostThunk(currentPost._id));
    };

    useEffect(() => {
        if (showCommentsMobile && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [showCommentsMobile]);

    useEffect(() => {
        if (currentPostId) {
            fetchCommentsForPost();
        }
    }, [fetchCommentsForPost, currentPostId]);

    return (
        <article className="w-full bg-gray-900 border border-gray-800/50 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-xl lg:h-[650px] relative">
            <div className="w-full lg:w-[60%] flex flex-col border-r border-gray-800/50 h-full">
                <div className="lg:hidden">
                    <UserHeader author={currentPost.author} />
                </div>

                <div className="hidden lg:flex px-4 border-b border-gray-800/50 h-14 items-center justify-between bg-gray-900/50">
                    <h2 className="text-sm font-bold text-gray-200 truncate">{currentPost.title}</h2>
                    <MoreHorizontal className="text-gray-500 cursor-pointer hover:text-gray-300 transition-colors" size={18} />
                </div>

                <div className="relative aspect-square lg:aspect-auto lg:grow bg-black flex items-center justify-center overflow-hidden">
                    {currentImageUrl ? (
                        <img
                            key={currentImageUrl}
                            src={currentImageUrl}
                            alt="Post content"
                            className="w-full h-full object-cover object-top"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-sm">
                            No image available
                        </div>
                    )}

                    {mediaItems.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={goToPreviousImage}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={goToNextImage}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                            >
                                <ChevronRight size={18} />
                            </button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {mediaItems.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`h-2 rounded-full transition-all ${
                                            index === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="p-4 flex items-center justify-between bg-gray-900">
                    <div className="flex items-center gap-5">
                        <Heart
                            onClick={handleToggleLike}
                            className={`cursor-pointer transition-all active:scale-125 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-gray-200'}`}
                            size={24}
                        />
                        <MessageCircle onClick={handleCommentAction} className="cursor-pointer text-gray-400 hover:text-gray-200" size={24} />
                        <Share2 className="cursor-pointer text-gray-400 hover:text-gray-200" size={22} />
                    </div>
                    <Bookmark
                        onClick={handleToggleSave}
                        className={`cursor-pointer transition-all ${isSaved ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400 hover:text-gray-200'}`}
                        size={24}
                    />
                </div>

                <div className="px-4 pb-4 bg-gray-900">
                    <p className="text-sm font-bold text-white mb-1">{likesCount} likes</p>
                    <p className="text-sm text-gray-400">
                        <span className="font-bold mr-2 text-gray-200">{currentPost.author?.username}</span>
                        {currentPost.caption}
                    </p>
                </div>
            </div>

            <div className={`
                w-full lg:w-[40%] flex flex-col h-full bg-gray-950/50
                ${showCommentsMobile ? 'fixed inset-0 z-60 pt-10 lg:pt-0' : 'hidden lg:flex'}
                lg:relative border-l border-gray-800/50
            `}>
                <div className="absolute top-4 right-4 lg:hidden z-70">
                    <X className="text-gray-400 cursor-pointer hover:text-white transition-colors" onClick={() => setShowCommentsMobile(false)} />
                </div>

                <UserHeader author={currentPost.author} />

                <div className="grow overflow-y-auto p-4 space-y-2 custom-scrollbar">
    {commentTree && commentTree.length > 0 ? (
        commentTree.map((comment) => (
            <div key={comment._id}>
                {/* Parent Comment */}
                <CommentItem
                    comment={comment}
                    currentUserId={currentUserId}
                    onReply={handleReplyClick}
                    onDelete={handleDeleteComment}
                    onLike={handleLikeComment}
                />

                {/* All Replies (Flattened) */}
                {comment.replies?.map((reply, index) => (
                    <CommentItem
                        key={reply._id || `${comment._id}-reply-${index}`}
                        comment={reply}
                        currentUserId={currentUserId}
                        onReply={handleReplyClick}
                        onDelete={handleDeleteComment}
                        onLike={handleLikeComment}
                        isReply={true}
                    />
                ))}
            </div>
        ))
    ) : (
        <div className="rounded-3xl border border-gray-800 bg-gray-900/70 p-6 text-center text-gray-400">
            No comments yet. Be the first to comment.
        </div>
    )}
</div>
                <div className="p-4 border-t border-gray-800/50 bg-gray-900">
                    {replyingTo && (
                        <div className="flex justify-between items-center mb-2 px-2 bg-blue-900/20 py-1 rounded-lg">
                            <span className="text-[10px] text-blue-400 font-bold">Replying to @{replyingTo.userId?.username || 'user'}</span>
                            <X size={12} className="cursor-pointer text-blue-400" onClick={() => { setReplyingTo(null); setCommentText(""); }} />
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

const UserHeader = ({ author }) => {
    const dispatch = useDispatch();
    const currentUserFollowingIds = useSelector((state) => state.auth.user?.followingIds || state.auth.user?.following || null);
    const currentUserFollowing = useMemo(() => normalizeUserIds(currentUserFollowingIds), [currentUserFollowingIds]);
    const authorId = getAuthorId(author);
    const [isFollowing, setIsFollowing] = useState(() => Boolean(author?.isFollowing) || currentUserFollowing.includes(authorId));
    const queryClient = useQueryClient();

    useEffect(() => {
        setIsFollowing(Boolean(author?.isFollowing) || currentUserFollowing.includes(authorId));
    }, [authorId, author?.isFollowing, currentUserFollowing]);

    const handleFollowToggle = async () => {
        if (!authorId) return;
        try {
            const actionResult = await dispatch(followThunk(authorId));
            const payload = actionResult?.payload ?? actionResult;

            let newFollowing = !isFollowing;
            if (typeof payload?.isFollowing === 'boolean') {
                newFollowing = payload.isFollowing;
            } else if (payload && Array.isArray(payload.following)) {
                newFollowing = normalizeUserIds(payload.following).includes(authorId);
            } else if (payload && payload.user && Array.isArray(payload.user.following)) {
                newFollowing = normalizeUserIds(payload.user.following).includes(authorId);
            } else if (typeof payload?.message === 'string') {
                const message = payload.message.toLowerCase();
                if (message.includes('follow')) newFollowing = true;
                if (message.includes('unfollow')) newFollowing = false;
            }

            setIsFollowing(newFollowing);
            dispatch(setFollowRelationship({ userId: authorId, isFollowing: newFollowing }));
            dispatch(updateAuthorFollowing({ userId: authorId, isFollowing: newFollowing }));
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        } catch (err) {
            console.error('follow error', err);
        }
    };

    return (
        <div className="p-4 flex items-center justify-between border-b border-gray-800/50 h-14 shrink-0 bg-gray-900">
            <div className="flex items-center gap-3">
                <AuthorAvatar author={author} sizeClasses="w-8 h-8" iconSize={14} borderClass="border-gray-700" />
                <div className="flex flex-col">
                    <span className="font-bold text-xs text-white">{author?.username}</span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider">Author</span>
                </div>
            </div>
            <button
                onClick={handleFollowToggle}
                className={`text-[10px] font-bold px-4 py-1.5 rounded-full transition-all ${isFollowing ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'}`}
            >
                {isFollowing ? 'Following' : 'Follow'}
            </button>
        </div>
    );
};

const CommentItem = ({ comment, currentUserId, onReply, onDelete, onLike, isReply = false }) => {
    const author = comment.userId || comment.author || {};
    const isOwner = author?._id === currentUserId || author === currentUserId;
    const parentName = comment.parentAuthorName || comment.parentAuthor || null;
    const content = comment.content || comment.text || '';

    return (
        <div className={`flex flex-col ${isReply ? 'ml-8 mt-2 border-l border-gray-800/50 pl-3' : 'mt-4'}`}>
            <div className="flex gap-2 group">
                <img src={author?.profile || author?.profilepic || 'https://via.placeholder.com/28'} className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-800" alt="" />
                <div className="flex flex-col grow">
                    <div className="bg-gray-800/40 p-2 rounded-xl rounded-tl-none border border-gray-800/30">
                        <div className="flex justify-between items-center mb-0.5">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-[11px] text-gray-300">{author?.username || 'Anonymous'}</span>
                                {parentName && <span className="text-[10px] text-gray-500">· replying to <span className="font-bold text-gray-300">@{parentName}</span></span>}
                            </div>
                            {isOwner && (
                                <Trash2 size={10} className="text-gray-500 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDelete(comment._id)} />
                            )}
                        </div>
                        <p className="text-xs text-gray-400 leading-snug">{content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 ml-1 text-[9px] font-bold text-gray-600">
                        <span>{formatTimeAgo(comment.createdAt)}</span>
                        <button
                            type="button"
                            onClick={() => onLike && onLike(comment._id)}
                            className="hover:text-red-400 transition-colors flex items-center gap-2"
                        >
                            <Heart size={12} className={`${(comment.isLiked || comment.likedByCurrentUser) ? 'text-red-500' : 'text-gray-400'}`} />
                            {comment.likesCount > 0 && (
                                <span className="text-[10px] text-gray-400">{formatCount(comment.likesCount)}</span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => onReply(comment)}
                            className="hover:text-blue-400 flex items-center gap-1 transition-colors"
                        >
                            <Reply size={10} /> Reply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostLayout;