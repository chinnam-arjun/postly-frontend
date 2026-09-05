import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify'
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
import { getUserById } from '../../redux_apis/user'

const s = {
    page: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem 4rem',
        fontFamily: "'DM Sans', sans-serif",
        minHeight: '100vh',
            color: 'var(--color-text-primary)',
    },
    // top bar
    topbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        paddingBottom: '1rem',
            borderBottom: '1px solid var(--color-border)', // border
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
            color: 'var(--color-text-secondary)', // gray-400
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
        background: 'var(--color-surface-muted)',
        color: 'var(--color-success)',
        border: '1px solid var(--color-border-strong)',
    },
    // title
    title: {
        fontFamily: "'Lora', serif",
        fontSize: '2.5rem',
        fontWeight: '700',
        color: 'var(--color-text-primary)', // gray-100
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
        borderBottom: '1px solid var(--color-border)', // border
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
        background: 'var(--color-surface-muted)', // gray-800
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--color-primary)',
        flexShrink: 0,
        overflow: 'hidden',
        border: '1px solid var(--color-border-strong)',
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
        color: 'var(--color-text-primary)',
    },
    authorMeta: {
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
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
        color: 'var(--color-text-secondary)',
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
        background: 'color-mix(in srgb, var(--color-danger) 10%, transparent)',
        border: 'none',
        color: 'var(--color-danger)',
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
        background: 'color-mix(in srgb, var(--color-warning) 10%, transparent)',
        border: 'none',
        color: 'var(--color-warning)',
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
        color: 'var(--color-text-secondary)',
        marginBottom: '4rem',
    },
    // divider
    divider: {
        height: '1px',
        background: 'var(--color-border)',
        marginBottom: '3rem',
    },
    // comments section
    commentsSection: {
        marginTop: '3rem',
    },
    commentsTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: 'var(--color-text-primary)',
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
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '12px 16px',
        color: 'var(--color-text-primary)',
        fontSize: '15px',
        fontFamily: "'DM Sans', sans-serif",
        outline: 'none',
        resize: 'none',
        transition: 'border-color 0.2s',
    },
    commentPostBtn: {
        background: 'var(--color-success)',
        border: 'none',
        color: 'var(--color-background)',
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
        background: 'var(--color-surface-muted)',
        border: 'none',
        color: 'var(--color-text-muted)',
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
        background: 'var(--color-surface-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '600',
        color: 'var(--color-primary)',
        flexShrink: 0,
        overflow: 'hidden',
        border: '1px solid var(--color-border-strong)',
    },
    commentBody: {
        flex: 1,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
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
        color: 'var(--color-text-primary)',
    },
    commentDate: {
        fontSize: '12px',
        color: 'var(--color-text-muted)',
    },
    commentText: {
        fontSize: '15px',
        color: 'var(--color-text-secondary)',
        lineHeight: '1.6',
    },
    commentDeleteBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--color-danger)',
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
        border: '1px solid color-mix(in srgb, var(--color-danger) 20%, transparent)',
        color: 'var(--color-danger)',
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
        color: 'var(--color-text-secondary)',
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
        .article-ql-content h1 { font-size: 1.6rem; font-weight: 600; margin: 1.5rem 0 0.75rem; color: var(--color-text-primary); }
        .article-ql-content h2 { font-size: 1.3rem; font-weight: 600; margin: 1.25rem 0 0.6rem; color: var(--color-text-primary); }
        .article-ql-content h3 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.5rem; color: var(--color-text-primary); }
        .article-ql-content p { margin: 0 0 1rem; color: var(--color-text-secondary); }
        .article-ql-content strong { color: var(--color-text-primary); }
        .article-ql-content blockquote { border-left: 3px solid var(--color-success); padding-left: 1rem; margin: 1rem 0; color: var(--color-text-muted); font-style: italic; }
        .article-ql-content pre { background: var(--color-surface-muted); border: 0.5px solid var(--color-border); border-radius: 8px; padding: 1rem; font-size: 0.9rem; overflow-x: auto; margin: 1rem 0; }
        .article-ql-content a { color: var(--color-success); text-decoration: underline; }
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

const createArticleMarkup = (html = '') => ({
    __html: DOMPurify.sanitize(html)
})

const ArticleRead = () => {
    const { storyId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { currentArticle, comments, isLoading, commentsLoading } = useSelector(state => state.articles)
    const { user } = useSelector(state => state.auth)
    const [resolvedAuthor, setResolvedAuthor] = useState(null)

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

    // If the article's author field is only an id, fetch author details
    useEffect(() => {
        let mounted = true
        const rawAuthor = currentArticle?.author || currentArticle?.user || currentArticle?.userId || currentArticle?.authorId
        if (rawAuthor && typeof rawAuthor === 'string') {
            getUserById(rawAuthor)
                .then(data => {
                    if (!mounted) return
                    // backend may return { user: {...} } or the user object directly
                    const u = data.user || data
                    setResolvedAuthor(u)
                })
                .catch(() => {
                    // ignore — keep Unknown
                })
        } else {
            setResolvedAuthor(null)
        }
        return () => { mounted = false }
    }, [currentArticle])

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
            navigate('/lists')
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

    const rawAuthor = currentArticle.author || currentArticle.user || currentArticle.userId || currentArticle.authorId || {}
    const author = typeof rawAuthor === 'object' ? rawAuthor : (resolvedAuthor || { _id: rawAuthor })
    const authorName = author.name || author.username || author.fullname || author.displayName || 'Unknown'
    const authorProfile = author.profile || author.profilepic || author.image || author.avatar || ''

    return (
        <div style={s.page}>
            {/* Top bar */}
            <div style={s.topbar}>
                <button style={s.backBtn} onClick={() => navigate('/lists')}>
                    ← Back to lists
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
                        {authorProfile
                            ? <img src={authorProfile} alt={authorName} style={s.avatarImg} />
                            : getInitials(authorName)
                        }
                    </div>
                    <div>
                        <div style={s.authorName}>{authorName}</div>
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
                    onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = 'https://via.placeholder.com/800x480'
                    }}
                />
            )}

            {/* Article content — Quill HTML */}
            <div
                style={s.articleContent}
                className="article-ql-content"
                dangerouslySetInnerHTML={createArticleMarkup(currentArticle.content)}
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