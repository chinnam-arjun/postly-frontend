import React, { useState, useEffect, useRef } from 'react'
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
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (quillRef.current) return

        quillRef.current = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: 'Start writing your article...',
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

        // Content change tracking
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

    // Thumbnail select
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setThumbnail(file)
        setThumbnailPreview(URL.createObjectURL(file))
    }

    const removeThumbnail = () => {
        setThumbnail(null)
        setThumbnailPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
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
            navigate('/lists')
        }
    }

    return (
        <main className="mx-auto px-4 sm:px-6 md:px-8" style={{ maxWidth: '800px' }}>
            {/* Top action row */}
            <div className="flex items-center justify-between py-4">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                        ← Back
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    {/* Placeholder for saved state - no autosave implemented */}
                    <div className="text-text-secondary text-sm hidden sm:block">Draft</div>
                    <button
                        onClick={handlePublish}
                        disabled={isLoading}
                        className="ui-button ui-button-primary"
                        aria-disabled={isLoading}
                    >
                        {isLoading ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            <article className="prose mx-auto">
                {/* Cover image */}
                <div className="mb-6">
                    {!thumbnailPreview ? (
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
                            >
                                + Add cover image
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <img src={thumbnailPreview} alt="cover preview" className="w-full rounded-md object-cover" style={{ maxHeight: 420 }} />
                            <div className="absolute top-3 right-3 flex gap-2">
                                <button onClick={() => fileInputRef.current?.click()} className="ui-button ui-button-secondary">Change</button>
                                <button onClick={removeThumbnail} className="ui-button ui-button-ghost">Remove</button>
                            </div>
                        </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleThumbnailChange} style={{ display: 'none' }} />
                </div>

                {/* Title */}
                <header className="mb-4">
                    <input
                        aria-label="Article title"
                        className="w-full bg-transparent text-text-primary placeholder:text-text-secondary focus:outline-none"
                        placeholder="Title your story..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.15 }}
                    />
                    {/* Subtitle omitted (no backend field) */}
                </header>

                {/* Quill Editor */}
                <section>
                    <div className="article-quill-wrapper">
                        <div ref={editorRef} className="article-ql-editor" style={{ minHeight: 400 }} />
                    </div>
                </section>
            </article>

            {/* Error */}
            {error && (
                <p className="text-danger mt-4">{error}</p>
            )}
        </main>
    )
}

export default CreateArticle