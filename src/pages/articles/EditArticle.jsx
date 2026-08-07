import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { getArticleByIdThunk, updateArticleThunk } from '../../redux_thunks/articleThunk'
import { clearCurrentArticle } from '../../redux_slices/articleSlice'

const styles = {
  page: {
    maxWidth: '780px',
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
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '0.5px solid #2a2e2c',
  },
  logo: {
    fontFamily: "'Lora', serif",
    fontSize: '16px',
    color: '#7a8a7d',
    letterSpacing: '0.02em',
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  btnGhost: {
    background: 'none',
    border: '0.5px solid #353a38',
    color: '#7a8a7d',
    padding: '7px 16px',
    borderRadius: '999px',
    fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
  },
  btnUpdate: {
    background: '#4caf6e',
    border: 'none',
    color: '#0d1a10',
    padding: '7px 20px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
  },
  btnUpdateDisabled: {
    background: '#2a3d2e',
    border: 'none',
    color: '#4a6a50',
    padding: '7px 20px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'not-allowed',
  },
  coverZone: {
    width: '100%',
    height: '220px',
    borderRadius: '12px',
    border: '0.5px dashed #353a38',
    background: '#141716',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
  },
  coverPreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '12px',
  },
  coverOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
  },
  coverChangeText: {
    fontSize: '13px',
    color: '#fff',
  },
  coverLabel: { fontSize: '13px', color: '#7a8a7d' },
  coverHint: { fontSize: '11px', color: '#4a5a4d' },
  tagsSection: { marginBottom: '1.25rem' },
  tagsLabel: {
    fontSize: '11px',
    color: '#7a8a7d',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  tagsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  tagPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: '#1e3328',
    color: '#4caf6e',
    border: '0.5px solid #2e5a3a',
    borderRadius: '999px',
    padding: '4px 12px',
    fontSize: '12px',
  },
  tagRemoveBtn: {
    background: 'none',
    border: 'none',
    color: '#4caf6e',
    cursor: 'pointer',
    fontSize: '14px',
    lineHeight: '1',
    padding: '0',
  },
  tagInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#e8ede9',
    fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
    minWidth: '120px',
  },
  titleInput: {
    width: '100%',
    background: 'none',
    border: 'none',
    outline: 'none',
    fontFamily: "'Lora', serif",
    fontSize: '2rem',
    fontWeight: '600',
    color: '#e8ede9',
    lineHeight: '1.3',
    marginBottom: '1.5rem',
    resize: 'none',
    overflow: 'hidden',
  },
  editorWrapper: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '0.5px solid #2a2e2c',
  },
  footerBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  wordCount: { fontSize: '12px', color: '#7a8a7d' },
  errorMsg: { color: '#ef4444', fontSize: '13px' },
  centered: { textAlign: 'center', padding: '4rem 1rem', color: '#7a8a7d' },
}

const injectStyles = () => {
  if (document.getElementById('edit-article-styles')) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap'
  document.head.appendChild(link)

  const style = document.createElement('style')
  style.id = 'edit-article-styles'
  style.textContent = `
    .ea-editor .ql-toolbar.ql-snow {
      background: #141716;
      border: none !important;
      border-bottom: 0.5px solid #2a2e2c !important;
      padding: 10px 14px;
    }
    .ea-editor .ql-toolbar.ql-snow .ql-stroke { stroke: #7a8a7d; }
    .ea-editor .ql-toolbar.ql-snow .ql-fill { fill: #7a8a7d; }
    .ea-editor .ql-toolbar.ql-snow button:hover .ql-stroke,
    .ea-editor .ql-toolbar.ql-snow button.ql-active .ql-stroke { stroke: #4caf6e !important; }
    .ea-editor .ql-toolbar.ql-snow button:hover .ql-fill,
    .ea-editor .ql-toolbar.ql-snow button.ql-active .ql-fill { fill: #4caf6e !important; }
    .ea-editor .ql-toolbar.ql-snow .ql-picker-label { color: #7a8a7d; }
    .ea-editor .ql-container.ql-snow {
      background: #1a1d1c;
      border: none !important;
      font-family: 'Lora', serif;
    }
    .ea-editor .ql-editor {
      min-height: 320px;
      font-size: 1rem;
      line-height: 1.8;
      color: #e8ede9;
      padding: 1.5rem;
    }
    .ea-editor .ql-editor.ql-blank::before {
      color: #3a4a3d !important;
      font-style: italic;
    }
    .ea-editor .ql-snow .ql-picker-options { background: #1a1d1c; border: 0.5px solid #353a38; }
    .ea-editor .ql-snow .ql-picker-item { color: #7a8a7d; }
    .ea-editor .ql-snow .ql-picker-item:hover { color: #4caf6e; }
  `
  document.head.appendChild(style)
}

const EditArticle = () => {
  const { storyId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { currentArticle, isLoading } = useSelector(state => state.articles)
  const { user } = useSelector(state => state.auth)

  const [title, setTitle] = useState('')
  const [tags, setTags] = useState([])
  const [tagInputVal, setTagInputVal] = useState('')
  const [thumbnail, setThumbnail] = useState(null)           // new file selected
  const [thumbnailPreview, setThumbnailPreview] = useState(null) // preview URL
  const [wordCount, setWordCount] = useState(0)
  const [coverHovered, setCoverHovered] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [quillReady, setQuillReady] = useState(false)

  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const fileInputRef = useRef(null)
  const titleRef = useRef(null)

  // Fetch article on mount
  useEffect(() => {
    injectStyles()
    dispatch(getArticleByIdThunk(storyId))
    return () => dispatch(clearCurrentArticle())
  }, [storyId, dispatch])

  // Init Quill after article loaded
  useEffect(() => {
    if (!currentArticle || quillRef.current) return

    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder: 'Tell your story…',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
      },
    })

    // Pre-fill existing content
    quillRef.current.root.innerHTML = currentArticle.content || ''

    // Word count
    quillRef.current.on('text-change', () => {
      const text = quillRef.current.getText().trim()
      setWordCount(text ? text.split(/\s+/).filter(Boolean).length : 0)
    })

    // Pre-fill other fields
    setTitle(currentArticle.title || '')
    setTags(currentArticle.tags || [])
    setThumbnailPreview(currentArticle.thumbnailUrl || null)
    setQuillReady(true)

    // Initial word count
    const text = quillRef.current.getText().trim()
    setWordCount(text ? text.split(/\s+/).filter(Boolean).length : 0)

    return () => {
      if (editorRef.current) {
        const toolbar = editorRef.current.previousSibling
        if (toolbar && toolbar.classList.contains('ql-toolbar')) {
          toolbar.remove()
        }
      }
      quillRef.current = null
    }
  }, [currentArticle])

  // Not the author — redirect
  useEffect(() => {
    if (currentArticle && user && currentArticle.author?._id !== user._id) {
      navigate(`/articles/${storyId}`)
    }
  }, [currentArticle, user])

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setThumbnail(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInputVal.trim()) {
      e.preventDefault()
      const val = tagInputVal.trim().replace(',', '')
      if (val && !tags.includes(val) && tags.length < 5) {
        setTags(prev => [...prev, val])
      }
      setTagInputVal('')
    }
    if (e.key === 'Backspace' && !tagInputVal && tags.length > 0) {
      setTags(prev => prev.slice(0, -1))
    }
  }

  const removeTag = (index) => {
    setTags(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpdate = async () => {
    setValidationError('')
    if (!title.trim()) return setValidationError('Title is required')
    if (!quillRef.current || quillRef.current.getText().trim().length === 0) {
      return setValidationError('Content is required')
    }

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('content', quillRef.current.root.innerHTML)
    formData.append('tags', JSON.stringify(tags))

    // Only append thumbnail if user selected a new one
    if (thumbnail) {
      formData.append('thumbnail', thumbnail)
    }

    const result = await dispatch(updateArticleThunk({ storyId, formData }))
    if (updateArticleThunk.fulfilled.match(result)) {
      navigate(`/lists/${storyId}`)
    }
  }

  // Loading state
  if (isLoading && !currentArticle) {
    return (
      <div style={styles.page}>
        <div style={styles.centered}>Loading article…</div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topbar}>
        <span style={styles.logo}>edit · article</span>
        <div style={styles.topbarRight}>
          <button
            style={styles.btnGhost}
            onClick={() => navigate(`/lists/${storyId}`)}
          >
            Cancel
          </button>
          <button
            style={isLoading ? styles.btnUpdateDisabled : styles.btnUpdate}
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? 'Updating…' : 'Update'}
          </button>
        </div>
      </div>

      {/* Cover Image */}
      <div
        style={styles.coverZone}
        onClick={() => fileInputRef.current.click()}
        onMouseEnter={() => setCoverHovered(true)}
        onMouseLeave={() => setCoverHovered(false)}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleCoverChange}
          style={{ display: 'none' }}
        />
        {thumbnailPreview ? (
          <>
            <img src={thumbnailPreview} alt="cover" style={styles.coverPreview} />
            {coverHovered && (
              <div style={styles.coverOverlay}>
                <span style={styles.coverChangeText}>✏️ Change cover</span>
              </div>
            )}
          </>
        ) : (
          <>
            <span style={{ fontSize: '32px' }}>🖼️</span>
            <span style={styles.coverLabel}>Add cover image</span>
            <span style={styles.coverHint}>Recommended 1200 × 630px</span>
          </>
        )}
      </div>

      {/* Tags */}
      <div style={styles.tagsSection}>
        <div style={styles.tagsLabel}>Topics</div>
        <div style={styles.tagsRow}>
          {tags.map((tag, i) => (
            <span key={i} style={styles.tagPill}>
              {tag}
              <button style={styles.tagRemoveBtn} onClick={() => removeTag(i)}>×</button>
            </span>
          ))}
          {tags.length < 5 && (
            <input
              style={styles.tagInput}
              value={tagInputVal}
              onChange={e => setTagInputVal(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={tags.length === 0 ? 'Add topic… (press Enter)' : 'Add more…'}
              maxLength={24}
            />
          )}
        </div>
      </div>

      {/* Title */}
      <textarea
        ref={titleRef}
        style={styles.titleInput}
        placeholder="Article title…"
        value={title}
        onChange={handleTitleChange}
        rows={1}
      />

      {/* Quill Editor */}
      <div style={styles.editorWrapper} className="ea-editor">
        <div ref={editorRef} />
      </div>

      {/* Footer */}
      <div style={styles.footerBar}>
        <span style={styles.wordCount}>{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
        <span style={styles.errorMsg}>{validationError}</span>
      </div>
    </div>
  )
}

export default EditArticle