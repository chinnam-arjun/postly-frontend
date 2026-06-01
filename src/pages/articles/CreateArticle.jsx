import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { createArticleThunk } from '../../redux_thunks/articleThunk'

const CreateArticle = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoading, error } = useSelector(state => state.articles)

    const [title, setTitle] = useState('')
    const [thumbnail, setThumbnail] = useState(null)
    const [thumbnailPreview, setThumbnailPreview] = useState(null)
    const [content, setContent] = useState('')

    // Quill setup
    const editorRef = useRef(null)
    const quillRef = useRef(null)

    useEffect(() => {
        if (quillRef.current) return

        quillRef.current = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: 'Write your article here...',
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

        // Content change track cheyyadam
        quillRef.current.on('text-change', () => {
            setContent(quillRef.current.root.innerHTML)
        })

        return () => {
            if (editorRef.current) {
                const toolbar = editorRef.current.previousSibling
                if (toolbar && toolbar.classList.contains('ql-toolbar')) {
                    toolbar.remove()
                }
            }
            quillRef.current = null
        }
    }, [])

    // Thumbnail select cheyyadam
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setThumbnail(file)
        setThumbnailPreview(URL.createObjectURL(file))
    }

    // Submit
    const handlePublish = async () => {
        if (!title.trim()) return alert('Title required')
        if (!thumbnail) return alert('Cover image required')
        if (!content || quillRef.current.getText().trim().length === 0) {
            return alert('Article content required')
        }

        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)       // Quill HTML content
        formData.append('thumbnail', thumbnail)   // File object

        const result = await dispatch(createArticleThunk(formData))

        if (createArticleThunk.fulfilled.match(result)) {
            navigate('/articles')
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h1>Write Article</h1>

            {/* Cover Image */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label>Cover Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    style={{ display: 'block', marginTop: '0.5rem' }}
                />
                {thumbnailPreview && (
                    <img
                        src={thumbnailPreview}
                        alt="preview"
                        style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            maxHeight: '300px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                        }}
                    />
                )}
            </div>

            {/* Title */}
            <div style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Article Title..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{
                        width: '100%',
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        border: 'none',
                        borderBottom: '1px solid #ddd',
                        outline: 'none',
                        padding: '0.5rem 0',
                    }}
                />
            </div>

            {/* Quill Editor */}
            <div style={{ marginBottom: '2rem' }}>
                <div ref={editorRef} style={{ minHeight: '400px' }} />
            </div>

            {/* Error */}
            {error && (
                <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
            )}

            {/* Publish Button */}
            <button
                onClick={handlePublish}
                disabled={isLoading}
                style={{
                    backgroundColor: '#1a8917',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    borderRadius: '999px',
                    fontSize: '1rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
            >
                {isLoading ? 'Publishing...' : 'Publish'}
            </button>
        </div>
    )
}

export default CreateArticle