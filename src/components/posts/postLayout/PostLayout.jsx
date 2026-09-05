/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, X, Reply, Trash2, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../utils/AxiosInstance';
import { useCommentMutation, useDeleteCommentMutation, useLikeCommentMutation } from '../../../hooks/usePosts.js';
import { toggleLikePostThunk, toggleSavePostThunk } from '../../../redux_thunks/postThunk.js';
import { followThunk } from '../../../redux_thunks/userThunk.js';
import { updateAuthorFollowing } from '../../../redux_slices/postSlice.js';
import { setFollowRelationship } from '../../../redux_slices/authSlice.js';
import SharePostButton from '../SharePostButton.jsx';

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

const getIdString = (value) => {
    if (!value && value !== 0) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return String(value?._id || value?.id || '');
};

const commentIsLikedByCurrentUser = (comment, currentUserIdString) => {
    if (!comment) return false;
    if (comment.isLiked || comment.likedByCurrentUser) return true;
    const likes = Array.isArray(comment.likes) ? comment.likes : [];
    if (!currentUserIdString) return false;
    return likes.some((likeOwner) => getIdString(likeOwner) === currentUserIdString);
};

const AuthorAvatar = ({ author, sizeClasses = 'w-8 h-8', iconSize = 14, borderClass = 'border-border' }) => {
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
        <div className={`${sizeClasses} rounded-full border ${borderClass} bg-surface-muted text-text-muted grid place-items-center`}> 
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
    const currentUserIdString = getIdString(currentUserId);
    const isLiked = Boolean(
        currentPost?.isLiked ||
        (Array.isArray(currentPost?.likes) && currentPost.likes.some((userId) => getIdString(userId) === currentUserIdString))
    );
    const isSaved = Boolean(
        currentPost?.isSaved ||
        (Array.isArray(currentPost?.saves) && currentPost.saves.some((userId) => getIdString(userId) === currentUserIdString))
    );

    const normalizedTags = useMemo(() => {
        const raw = currentPost?.tags;
        if (!raw) return [];
        if (Array.isArray(raw)) {
            // Handle malformed cases where tags were stored as a single JSON string but split into array parts
            const looksLikeJsonPieces = raw.some((it) => typeof it === 'string' && (it.includes('[') || it.includes(']')));
            if (looksLikeJsonPieces) {
                try {
                    const joined = raw.join(',');
                    const parsed = JSON.parse(joined);
                    if (Array.isArray(parsed)) return parsed.map((p) => String(p).replace(/^#/, '').trim()).filter(Boolean);
                } catch (e) {
                    // ignore and fall back to per-item parsing
                }
            }
            return raw.flatMap((item) => {
                if (typeof item === 'string') {
                    const t = item.trim();
                    if (t.startsWith('[') && (t.includes('"') || t.includes("'"))) {
                        try {
                            const parsed = JSON.parse(t);
                            return Array.isArray(parsed) ? parsed.map((p) => String(p)) : [t];
                        } catch (e) {
                            return [t];
                        }
                    }
                    return [t];
                }
                if (typeof item === 'object' && item) {
                    if (item.tag) return [String(item.tag)];
                    if (item.name) return [String(item.name)];
                    return [String(item)];
                }
                return [];
            }).map((x) => String(x).replace(/^#/, '').trim()).filter(Boolean);
        }
        if (typeof raw === 'string') {
            try {
                const p = JSON.parse(raw);
                if (Array.isArray(p)) return p.map((t) => String(t).replace(/^#/, '').trim()).filter(Boolean);
            } catch (e) {
                // fallthrough
            }
            return raw.split(/[ ,]+/).map((t) => String(t).replace(/^#/, '').trim()).filter(Boolean);
        }
        return [];
    }, [currentPost?.tags]);

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
        <article className="w-full bg-surface border border-border-strong rounded-[2rem] overflow-hidden flex flex-col lg:flex-row shadow-[var(--shadow-medium)] lg:h-[650px] relative">
            <div className="w-full lg:w-[60%] flex flex-col border-r border-slate-800/50 h-full">
                <div className="lg:hidden">
                    <UserHeader author={currentPost.author} />
                </div>

                <div className="hidden lg:flex px-4 border-b border-border h-14 items-center justify-between bg-surface-elevated">
                    <h2 className="text-sm font-bold text-text-primary truncate">{currentPost.title}</h2>
                    <MoreHorizontal className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors" size={18} />
                </div>

                <div className="relative aspect-square lg:aspect-auto lg:grow bg-surface-muted flex items-center justify-center overflow-hidden">
                    {currentImageUrl ? (
                        <img
                            key={currentImageUrl}
                            src={currentImageUrl}
                            alt="Post content"
                            className="w-full h-full object-cover object-top"
                        />
                    ) : (
                        <div className="w-full h-full bg-surface-muted flex items-center justify-center text-text-secondary text-sm">
                            No image available
                        </div>
                    )}

                    {mediaItems.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={goToPreviousImage}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-overlay hover:opacity-90 text-text-primary rounded-full p-2"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={goToNextImage}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-overlay hover:opacity-90 text-text-primary rounded-full p-2"
                            >
                                <ChevronRight size={18} />
                            </button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {mediaItems.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`h-2 rounded-full transition-all ${index === currentImageIndex ? 'w-6 bg-surface' : 'w-2 bg-surface-muted'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="p-4 flex items-center justify-between bg-surface border-t border-border backdrop-blur-sm">
                    <div className="flex items-center gap-4 rounded-full bg-surface-muted p-2 shadow-inner border border-border">
                        <Heart
                            onClick={handleToggleLike}
                            className={`cursor-pointer transition-all active:scale-110 ${isLiked ? 'text-danger fill-danger' : 'text-text-secondary hover:text-text-primary'}`}
                            size={24}
                        />
                        <MessageCircle onClick={handleCommentAction} className="cursor-pointer text-text-secondary hover:text-text-primary" size={24} />
                        <SharePostButton post={currentPost} />
                    </div>
                    <Bookmark
                        onClick={handleToggleSave}
                        className={`cursor-pointer transition-all ${isSaved ? 'text-warning fill-warning' : 'text-text-secondary hover:text-text-primary'}`}
                        size={24}
                    />
                </div>

                <div className="px-4 pb-6 bg-surface">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-text-secondary mb-1">{likesCount} likes</p>
                            <p className="text-sm leading-6 text-text-secondary">
                                <span className="font-semibold text-text-primary mr-2">{currentPost.author?.username}</span>
                                {currentPost.caption}
                            </p>
                        </div>
                    </div>
                    {normalizedTags && normalizedTags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {normalizedTags.map((tag, index) => (
                                <span
                                    key={`${tag}-${index}`}
                                    className="inline-flex items-center rounded-full bg-surface-muted px-3 py-1 text-[11px] text-info font-semibold ring-1 ring-border"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={`w-full lg:w-[40%] flex flex-col h-full bg-surface backdrop-blur-xl ${showCommentsMobile ? 'fixed inset-0 z-60 pt-10 lg:pt-0' : 'hidden lg:flex'} lg:relative border-l border-border`}>
                <div className="absolute top-4 right-4 lg:hidden z-70">
                    <X className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors" onClick={() => setShowCommentsMobile(false)} />
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
        <div className="rounded-3xl border border-border bg-surface-muted p-6 text-center text-text-secondary">
            No comments yet. Be the first to comment.
        </div>
    )}
</div>
                <div className="p-4 border-t border-border bg-surface-elevated">
                    {replyingTo && (
                        <div className="flex justify-between items-center mb-2 px-2 bg-blue-900/20 py-1 rounded-lg">
                            <span className="text-[10px] text-blue-400 font-bold">Replying to @{replyingTo.userId?.username || 'user'}</span>
                            <X size={12} className="cursor-pointer text-blue-400" onClick={() => { setReplyingTo(null); setCommentText(""); }} />
                        </div>
                    )}
                    <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-full border border-border focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                        <input
                            ref={commentInputRef}
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-transparent border-none focus:ring-0 text-sm text-text-primary"
                        />
                        <button
                            onClick={handlePostComment}
                            disabled={commentMutation.isPending || !commentText.trim()}
                            className="text-primary font-bold text-sm disabled:opacity-30"
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
        <div className="p-4 flex items-center justify-between border-b border-border h-14 shrink-0 bg-surface-elevated">
            <div className="flex items-center gap-3">
                <AuthorAvatar author={author} sizeClasses="w-8 h-8" iconSize={14} borderClass="border-gray-700" />
                <div className="flex flex-col">
                    <span className="font-bold text-xs text-text-primary">{author?.username}</span>
                    <span className="text-[9px] text-text-muted uppercase tracking-wider">Author</span>
                </div>
            </div>
            <button
                onClick={handleFollowToggle}
                className={`text-[10px] font-bold px-4 py-1.5 rounded-full transition-all ${isFollowing ? 'bg-surface-muted text-text-secondary border border-border' : 'bg-primary text-white shadow-lg'}`}
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
    const currentUserIdString = getIdString(currentUserId);

    return (
        <div className={`flex flex-col ${isReply ? 'ml-8 mt-2 border-l border-border pl-3' : 'mt-4'}`}>
            <div className="flex gap-2 group">
                <img src={author?.profile || author?.profilepic || 'https://via.placeholder.com/28'} className="w-7 h-7 rounded-full object-cover shrink-0 border border-border" alt="" />
                <div className="flex flex-col grow">
                    <div className="bg-surface-muted dark:bg-slate-900/70 p-2 rounded-3xl rounded-tl-none border border-border">
                        <div className="flex justify-between items-center mb-0.5">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-[11px] text-text-primary">{author?.username || 'Anonymous'}</span>
                                {parentName && <span className="text-[10px] text-text-muted">· replying to <span className="font-bold text-text-primary">@{parentName}</span></span>}
                            </div>
                            {isOwner && (
                                <Trash2 size={10} className="text-text-secondary hover:text-danger cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDelete(comment._id)} />
                            )}
                        </div>
                        <p className="text-xs text-text-secondary leading-snug">{content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 ml-1 text-[9px] font-bold text-text-muted">
                        <span>{formatTimeAgo(comment.createdAt)}</span>
                        <button
                            type="button"
                            onClick={() => onLike && onLike(comment._id)}
                            className="hover:text-red-400 transition-colors flex items-center gap-2"
                        >
                            <Heart size={12} className={`${commentIsLikedByCurrentUser(comment, currentUserIdString) ? 'text-danger' : 'text-text-secondary'}`} />
                            {comment.likesCount > 0 && (
                                <span className="text-[10px] text-text-secondary">{formatCount(comment.likesCount)}</span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => onReply(comment)}
                            className="hover:text-info flex items-center gap-1 transition-colors"
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