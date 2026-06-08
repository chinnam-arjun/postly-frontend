import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
    getArticleByIdThunk,
    toggleArticleLikeThunk,
    toggleArticleSaveThunk,
    getArticleCommentsThunk,
    addArticleCommentThunk,
    deleteArticleCommentThunk,
    deleteArticleThunk,
} from '../../redux_thunks/articleThunk'
import { clearCurrentArticle } from '../../redux_slices/articleSlice'

const s = {
    page: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem 4rem',
        fontFamily: "'DM Sans', sans-serif",
        minHeight: '100vh',
        color: '#e8ede9',
    },
    // top bar
    topbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #1f2937', // border-gray-800
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        color: '#9ca3af', // gray-400
        fontSize: '14px',
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer',
    },
    // tags
    tagsRow: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '1.5rem',
    },
    tag: {
        fontSize: '12px',
        fontWeight: '500',
        padding: '4px 12px',
        borderRadius: '999px',
        background: '#1e3328',
        color: '#4caf6e',
        border: '1px solid #2e4d2e',
    },
    // title
    title: {
        fontFamily: "'Lora', serif",
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#f3f4f6', // gray-100
        lineHeight: '1.3',
        marginBottom: '1.5rem',
    },
    // author row
    authorRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #1f2937', // border-gray-800
    },
    authorLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatar: {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: '#1f2937', // gray-800
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '600',
        color: '#60a5fa',
        flexShrink: 0,
        overflow: 'hidden',
        border: '1px solid #374151',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '50%',
    },
    authorName: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#f3f4f6',
    },
    authorMeta: {
        fontSize: '13px',
        color: '#9ca3af',
        marginTop: '2px',
    },
    // interactions bar
    interactionsBar: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        color: '#9ca3af',
        fontSize: '14px',
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '8px',
        transition: 'all 0.2s',
    },
    actionBtnActive: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: 'none',
        color: '#ef4444',
        fontSize: '14px',
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '8px',
    },
    actionBtnSaved: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(245, 158, 11, 0.1)',
        border: 'none',
        color: '#f59e0b',
        fontSize: '14px',
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '8px',
    },
    // cover
    coverImg: {
        width: '100%',
        maxHeight: '480px',
        objectFit: 'cover',
        borderRadius: '20px',
        marginBottom: '2.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    },
    // article content
    articleContent: {
        fontFamily: "'Lora', serif",
        fontSize: '1.125rem',
        lineHeight: '1.9',
        color: '#d1d5db',
        marginBottom: '4rem',
    },
    // divider
    divider: {
        height: '1px',
        background: '#1f2937',
        marginBottom: '3rem',
    },
    // comments section
    commentsSection: {
        marginTop: '3rem',
    },
    commentsTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#f3f4f6',
        marginBottom: '1.5rem',
    },
    // comment input
    commentInputRow: {
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        marginBottom: '2.5rem',
    },
    commentInput: {
        flex: 1,
        background: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '12px',
        padding: '12px 16px',
        color: '#f3f4f6',
        fontSize: '15px',
        fontFamily: "'DM Sans', sans-serif",
        outline: 'none',
        resize: 'none',
        transition: 'border-color 0.2s',
    },
    commentPostBtn: {
        background: '#4caf6e',
        border: 'none',
        color: '#0d1a10',
        padding: '12px 24px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'transform 0.2s',
    },
    commentPostBtnDisabled: {
        background: '#1f2937',
        border: 'none',
        color: '#4b5563',
        padding: '12px 24px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'not-allowed',
        whiteSpace: 'nowrap',
    },
    // comment item
    commentItem: {
        display: 'flex',
        gap: '12px',
        marginBottom: '1.5rem',
    },
    commentAvatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '600',
        color: '#60a5fa',
        flexShrink: 0,
        overflow: 'hidden',
        border: '1px solid #374151',
    },
    commentBody: {
        flex: 1,
        background: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '12px',
        padding: '12px 16px',
    },
    commentHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '6px',
    },
    commentUsername: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#f3f4f6',
    },
    commentDate: {
        fontSize: '12px',
        color: '#6b7280',
    },
    commentText: {
        fontSize: '15px',
        color: '#9ca3af',
        lineHeight: '1.6',
    },
    commentDeleteBtn: {
        background: 'none',
        border: 'none',
        color: '#ef4444',
        fontSize: '12px',
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer',
        marginTop: '8px',
        padding: '0',
        opacity: '0.7',
    },
    // delete article btn
    deleteBtn: {
        background: 'none',
        border: '1px solid #7f1d1d',
        color: '#ef4444',
        padding: '8px 18px',
        borderRadius: '999px',
        fontSize: '13px',
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    // loading / error
    centered: {
        textAlign: 'center',
        padding: '6rem 1rem',
        color: '#9ca3af',
    },
}

const injectFonts = () => {
    if (document.getElementById('article-read-fonts')) return
    const link = document.createElement('link')
    link.id = 'article-read-fonts'
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap'
    document.head.appendChild(link)

    // quill content styles
    const style = document.createElement('style')
    style.id = 'article-read-content-styles'
    style.textContent = `
        .article-ql-content h1 { font-size: 1.6rem; font-weight: 600; margin: 1.5rem 0 0.75rem; color: #e8ede9; }
        .article-ql-content h2 { font-size: 1.3rem; font-weight: 600; margin: 1.25rem 0 0.6rem; color: #e8ede9; }
        .article-ql-content h3 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.5rem; color: #e8ede9; }
        .article-ql-content p { margin: 0 0 1rem; }
        .article-ql-content strong { color: #e8ede9; }
        .article-ql-content blockquote { border-left: 3px solid #4caf6e; padding-left: 1rem; margin: 1rem 0; color: #7a8a7d; font-style: italic; }
        .article-ql-content pre { background: #141716; border: 0.5px solid #2a2e2c; border-radius: 8px; padding: 1rem; font-size: 0.9rem; overflow-x: auto; margin: 1rem 0; }
        .article-ql-content a { color: #4caf6e; text-decoration: underline; }
        .article-ql-content ul, .article-ql-content ol { padding-left: 1.5rem; margin: 0 0 1rem; }
        .article-ql-content li { margin-bottom: 0.4rem; }
        .article-ql-content img { max-width: 100%; border-radius: 8px; margin: 1rem 0; }
    `
    document.head.appendChild(style)
}

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const readingTime = (content) => {
    if (!content) return '1 min read'
    const text = content.replace(/<[^>]*>/g, '')
    const words = text.split(/\s+/).filter(Boolean).length
    return `${Math.max(1, Math.round(words / 200))} min read`
}

const ArticleRead = () => {
    const { storyId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { currentArticle, comments, isLoading, commentsLoading } = useSelector(state => state.articles)
    const { user } = useSelector(state => state.auth)

    const [commentText, setCommentText] = useState('')
    const [isLiked, setIsLiked] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [likesCount, setLikesCount] = useState(0)

    useEffect(() => {
        injectFonts()
        dispatch(getArticleByIdThunk(storyId))
        dispatch(getArticleCommentsThunk(storyId))

        return () => {
            dispatch(clearCurrentArticle())
        }
    }, [storyId, dispatch])

    // Sync like/save state when article loads
    useEffect(() => {
        if (currentArticle && user) {
            setIsLiked(currentArticle.likes?.includes(user._id) || false)
            setIsSaved(currentArticle.saves?.includes(user._id) || false)
            setLikesCount(currentArticle.likesCount || 0)
        }
    }, [currentArticle, user])

    const handleLike = async () => {
        // Optimistic update
        setIsLiked(prev => !prev)
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
        dispatch(toggleArticleLikeThunk(storyId))
    }

    const handleSave = () => {
        setIsSaved(prev => !prev)
        dispatch(toggleArticleSaveThunk(storyId))
    }

    const handleAddComment = async () => {
        if (!commentText.trim()) return
        await dispatch(addArticleCommentThunk({ storyId, content: commentText.trim() }))
        setCommentText('')
    }

    const handleDeleteComment = (commentId) => {
        if (window.confirm('Delete this comment?')) {
            dispatch(deleteArticleCommentThunk({ storyId, commentId }))
        }
    }

    const handleDeleteArticle = async () => {
        if (window.confirm('Delete this article?')) {
            await dispatch(deleteArticleThunk(storyId))
            navigate('/articles')
        }
    }

    const isAuthor = user && currentArticle?.author?._id === user._id

    if (isLoading) {
        return (
            <div style={s.page}>
                <div style={s.centered}>Loading article…</div>
            </div>
        )
    }

    if (!currentArticle) {
        return (
            <div style={s.page}>
                <div style={s.centered}>Article not found.</div>
            </div>
        )
    }

    const author = currentArticle.author || {}

    return (
        <div style={s.page}>
            {/* Top bar */}
            <div style={s.topbar}>
                <button style={s.backBtn} onClick={() => navigate('/articles')}>
                    ← Back to articles
                </button>
                {isAuthor && (
                    <>
                        <button onClick={() => navigate(`/articles/${storyId}/edit`)}>
                        Edit
                        </button>
                        <button style={s.deleteBtn} onClick={handleDeleteArticle}>
                            Delete article
                        </button>
                    </>
                )}
            </div>

            {/* Tags */}
            {currentArticle.tags?.length > 0 && (
                <div style={s.tagsRow}>
                    {currentArticle.tags.map((tag, i) => (
                        <span key={i} style={s.tag}>{tag}</span>
                    ))}
                </div>
            )}

            {/* Title */}
            <h1 style={s.title}>{currentArticle.title}</h1>

            {/* Author + interactions */}
            <div style={s.authorRow}>
                <div style={s.authorLeft}>
                    <div style={s.avatar}>
                        {author.profile
                            ? <img src={author.profile} alt={author.username} style={s.avatarImg} />
                            : getInitials(author.username)
                        }
                    </div>
                    <div>
                        <div style={s.authorName}>{author.username || 'Unknown'}</div>
                        <div style={s.authorMeta}>
                            {formatDate(currentArticle.createdAt)} · {readingTime(currentArticle.content)}
                        </div>
                    </div>
                </div>

                <div style={s.interactionsBar}>
                    <button
                        style={isLiked ? s.actionBtnActive : s.actionBtn}
                        onClick={handleLike}
                    >
                        {isLiked ? '♥' : '♡'} {likesCount}
                    </button>
                    <button style={s.actionBtn}>
                        💬 {currentArticle.commentsCount || 0}
                    </button>
                    <button
                        style={isSaved ? s.actionBtnSaved : s.actionBtn}
                        onClick={handleSave}
                    >
                        {isSaved ? '🔖' : '🔖'} {isSaved ? 'Saved' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Cover image */}
            {currentArticle.thumbnailUrl && (
                <img
                    src={currentArticle.thumbnailUrl}
                    alt={currentArticle.title}
                    style={s.coverImg}
                />
            )}

            {/* Article content — Quill HTML */}
            <div
                style={s.articleContent}
                className="article-ql-content"
                dangerouslySetInnerHTML={{ __html: currentArticle.content }}
            />

            <div style={s.divider} />

            {/* Comments */}
            <div style={s.commentsSection}>
                <p style={s.commentsTitle}>
                    Comments ({currentArticle.commentsCount || 0})
                </p>

                {/* Add comment */}
                <div style={s.commentInputRow}>
                    <textarea
                        style={s.commentInput}
                        placeholder="Write a comment…"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        rows={2}
                    />
                    <button
                        style={commentText.trim() ? s.commentPostBtn : s.commentPostBtnDisabled}
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                    >
                        Post
                    </button>
                </div>

                {/* Comments list */}
                {commentsLoading && (
                    <div style={{ color: '#7a8a7d', fontSize: '13px' }}>Loading comments…</div>
                )}

                {!commentsLoading && comments.length === 0 && (
                    <div style={{ color: '#4a5a4d', fontSize: '13px' }}>
                        No comments yet — be the first!
                    </div>
                )}

                {comments.map(comment => {
                    const isOwner = user && comment.userId?._id === user._id
                    const commentUser = comment.userId || {}
                    return (
                        <div key={comment._id} style={s.commentItem}>
                            <div style={s.commentAvatar}>
                                {commentUser.profile
                                    ? <img src={commentUser.profile} alt={commentUser.username} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    : getInitials(commentUser.username)
                                }
                            </div>
                            <div style={s.commentBody}>
                                <div style={s.commentHeader}>
                                    <span style={s.commentUsername}>{commentUser.username || 'Unknown'}</span>
                                    <span style={s.commentDate}>{formatDate(comment.createdAt)}</span>
                                </div>
                                <p style={s.commentText}>{comment.content}</p>
                                {isOwner && (
                                    <button
                                        style={s.commentDeleteBtn}
                                        onClick={() => handleDeleteComment(comment._id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ArticleRead