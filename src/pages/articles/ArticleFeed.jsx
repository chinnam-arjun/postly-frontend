import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getArticleFeedThunk } from '../../redux_thunks/articleThunk'

const styles = {
  page: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '1.5rem 1rem',
    fontFamily: "'DM Sans', sans-serif",
    minHeight: '100vh',
    backgroundColor: '#0d0f0e',
    color: '#e8ede9',
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '0.5px solid #2a2e2c',
  },
  pageTitle: {
    fontFamily: "'Lora', serif",
    fontSize: '18px',
    fontWeight: '600',
    color: '#e8ede9',
  },
  writeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#4caf6e',
    border: 'none',
    color: '#0d1a10',
    padding: '7px 16px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
  },

  // Article Card
  card: {
    background: '#141716',
    border: '0.5px solid #2a2e2c',
    borderRadius: '12px',
    marginBottom: '1rem',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  cardBody: {
    padding: '1rem 1.25rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  cardLeft: {
    flex: 1,
    minWidth: 0,
  },
  tagsRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginBottom: '8px',
  },
  tag: {
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    borderRadius: '999px',
    background: '#1e3328',
    color: '#4caf6e',
    border: '0.5px solid #2e4d2e',
  },
  articleTitle: {
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: "'Lora', serif",
    color: '#e8ede9',
    lineHeight: '1.4',
    marginBottom: '10px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  avatar: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: '#1a2535',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '9px',
    fontWeight: '500',
    color: '#60a5fa',
    flexShrink: 0,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  metaText: {
    fontSize: '12px',
    color: '#7a8a7d',
  },
  metaDot: {
    fontSize: '12px',
    color: '#4a5a4d',
  },
  interactions: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  action: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#7a8a7d',
  },
  cardThumb: {
    width: '90px',
    height: '72px',
    borderRadius: '8px',
    background: '#1a2535',
    flexShrink: 0,
    overflow: 'hidden',
    marginTop: '2px',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: '#2a3a4a',
  },

  // Empty state
  emptyState: {
    textAlign: 'center',
    padding: '4rem 1rem',
    background: '#141716',
    border: '0.5px solid #2a2e2c',
    borderRadius: '12px',
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: "'Lora', serif",
    color: '#e8ede9',
    marginBottom: '6px',
  },
  emptySub: {
    fontSize: '13px',
    color: '#7a8a7d',
    marginBottom: '1rem',
  },
  discoverBtn: {
    background: '#60a5fa',
    border: 'none',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: '999px',
    fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
  },

  // Loading skeleton
  skeleton: {
    background: '#141716',
    border: '0.5px solid #2a2e2c',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
  },
  skeletonLine: {
    background: '#1a1d1c',
    borderRadius: '4px',
    marginBottom: '8px',
  },

  // Load more
  loadMoreBtn: {
    width: '100%',
    background: 'none',
    border: '0.5px solid #2a2e2c',
    color: '#7a8a7d',
    padding: '12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
}

// Inject fonts
const injectFonts = () => {
  if (document.getElementById('article-feed-fonts')) return
  const link = document.createElement('link')
  link.id = 'article-feed-fonts'
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap'
  document.head.appendChild(link)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const readingTime = (content) => {
  if (!content) return '1 min read'
  const text = content.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).filter(Boolean).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

// Skeleton loader
const SkeletonCard = () => (
  <div style={styles.skeleton}>
    <div style={{ display: 'flex', gap: '1rem' }}>
      <div style={{ flex: 1 }}>
        <div style={{ ...styles.skeletonLine, height: '12px', width: '30%' }} />
        <div style={{ ...styles.skeletonLine, height: '18px', width: '90%' }} />
        <div style={{ ...styles.skeletonLine, height: '18px', width: '70%' }} />
        <div style={{ ...styles.skeletonLine, height: '12px', width: '40%', marginTop: '12px' }} />
      </div>
      <div style={{ ...styles.cardThumb, background: '#1a1d1c', flexShrink: 0 }} />
    </div>
  </div>
)

// Single Article Card
const ArticleCard = ({ article, onClick }) => {
  const author = article.author || {}

  return (
    <div style={styles.card} onClick={() => onClick(article._id)}>
      <div style={styles.cardBody}>
        <div style={styles.cardLeft}>
          {/* Tags */}
          {article.tags?.length > 0 && (
            <div style={styles.tagsRow}>
              {article.tags.slice(0, 3).map((tag, i) => (
                <span key={i} style={styles.tag}>{tag}</span>
              ))}
            </div>
          )}

          {/* Title */}
          <p style={styles.articleTitle}>{article.title}</p>

          {/* Meta */}
          <div style={styles.metaRow}>
            <div style={styles.avatar}>
              {author.profile
                ? <img src={author.profile} alt={author.username} style={styles.avatarImg} />
                : getInitials(author.username)
              }
            </div>
            <span style={styles.metaText}>{author.username || 'Unknown'}</span>
            <span style={styles.metaDot}>·</span>
            <span style={styles.metaText}>{readingTime(article.content)}</span>
            <span style={styles.metaDot}>·</span>
            <span style={styles.metaText}>{formatDate(article.createdAt)}</span>
          </div>

          {/* Interactions */}
          <div style={styles.interactions}>
            <span style={styles.action}>♥ {article.likesCount || 0}</span>
            <span style={styles.action}>💬 {article.commentsCount || 0}</span>
            <span style={styles.action}>🔖 {article.savesCount || 0}</span>
          </div>
        </div>

        {/* Thumbnail */}
        <div style={styles.cardThumb}>
          {article.thumbnailUrl
            ? <img src={article.thumbnailUrl} alt={article.title} style={styles.thumbImg} />
            : <div style={styles.thumbPlaceholder}>📄</div>
          }
        </div>
      </div>
    </div>
  )
}

const ArticleFeed = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { articles, isLoading, pagination } = useSelector(state => state.articles)

  useEffect(() => {
    injectFonts()
    dispatch(getArticleFeedThunk({ page: 1, limit: 10 }))
  }, [dispatch])

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.totalPages) {
      dispatch(getArticleFeedThunk({ page: pagination.page + 1, limit: 10 }))
    }
  }

  const handleCardClick = (storyId) => {
    navigate(`/articles/${storyId}`)
  }

  const hasMore = pagination && pagination.page < pagination.totalPages

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topbar}>
        <span style={styles.pageTitle}>Articles</span>
        <button style={styles.writeBtn} onClick={() => navigate('/articles/create')}>
          ✏️ Write article
        </button>
      </div>

      {/* Loading skeletons */}
      {isLoading && articles.length === 0 && (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      )}

      {/* Empty state */}
      {!isLoading && articles.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>👥</div>
          <p style={styles.emptyTitle}>No articles yet</p>
          <p style={styles.emptySub}>Follow people to see their articles here</p>
          <button style={styles.discoverBtn} onClick={() => navigate('/feed')}>
            Discover people to follow
          </button>
        </div>
      )}

      {/* Articles list */}
      {articles.map(article => (
        <ArticleCard
          key={article._id}
          article={article}
          onClick={handleCardClick}
        />
      ))}

      {/* Load more */}
      {hasMore && (
        <button
          style={styles.loadMoreBtn}
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          {isLoading ? 'Loading…' : 'Load more articles'}
        </button>
      )}
    </div>
  )
}

export default ArticleFeed