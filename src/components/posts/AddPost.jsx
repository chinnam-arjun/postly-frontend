import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ImagePlus, X, ChevronLeft, ChevronRight,
  CheckCircle2, Tag, Loader2,
} from 'lucide-react';
import { addPostThunk } from '../../redux_thunks/postThunk';

// ─── constants ───────────────────────────────────────────────
const MAX_IMAGES = 5;
const MAX_TAGS   = 10;
const STEPS = ['Images', 'Details', 'Tags', 'Preview'];

// ─── tiny helpers ─────────────────────────────────────────────
const readAsDataURL = (file) =>
  new Promise((res) => {
    const r = new FileReader();
    r.onload = (e) => res(e.target.result);
    r.readAsDataURL(file);
  });

// ─── Step indicators ─────────────────────────────────────────
const StepBar = ({ current }) => (
  <div className="flex items-center gap-0 mb-8">
    {STEPS.map((label, i) => {
      const done    = i < current;
      const active  = i === current;
      const isLast  = i === STEPS.length - 1;
      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300
              ${done   ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : ''}
              ${active ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 ring-4 ring-gray-200 dark:ring-gray-700' : ''}
              ${!done && !active ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : ''}
            `}>
              {done ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span className={`text-xs font-medium ${active ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {!isLast && (
            <div className={`flex-1 h-px mx-2 mb-4 transition-all duration-500 ${i < current ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Step 1: Images ──────────────────────────────────────────
const StepImages = ({ images, setImages }) => {
  const inputRef = useRef();

  const handleFiles = async (files) => {
    const remaining = MAX_IMAGES - images.length;
    const selected  = Array.from(files).slice(0, remaining);
    const previews  = await Promise.all(
      selected.map(async (file) => ({ file, preview: await readAsDataURL(file) }))
    );
    setImages((prev) => [...prev, ...previews]);
  };

  const remove = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Add photos</h2>
        <p className="text-sm text-gray-400">Upload up to {MAX_IMAGES} images. First image will be the cover.</p>
      </div>

      {/* Upload zone */}
      {images.length < MAX_IMAGES && (
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl py-12 flex flex-col items-center gap-3 text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ImagePlus size={22} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Click to upload images</p>
            <p className="text-xs mt-0.5">PNG, JPG, WEBP · max {MAX_IMAGES} total</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </button>
      )}

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100 dark:bg-gray-800">
              <img src={img.preview} alt="" className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded-md">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-400 text-right">{images.length}/{MAX_IMAGES} images added</p>
      )}
    </div>
  );
};

// ─── Step 2: Details ─────────────────────────────────────────
const StepDetails = ({ title, setTitle, caption, setCaption }) => (
  <div className="space-y-5">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Post details</h2>
      <p className="text-sm text-gray-400">Give your post a title and an optional caption.</p>
    </div>

    {/* Title */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Title <span className="text-red-400">*</span>
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What's this post about?"
        maxLength={100}
        className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 transition"
      />
      <p className="text-xs text-gray-400 text-right">{title.length}/100</p>
    </div>

    {/* Caption */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Caption</label>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Write a caption..."
        rows={4}
        maxLength={500}
        className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 transition resize-none"
      />
      <p className="text-xs text-gray-400 text-right">{caption.length}/500</p>
    </div>
  </div>
);

// ─── Step 3: Tags ────────────────────────────────────────────
const StepTags = ({ tags, setTags }) => {
  const [input, setInput] = useState('');

  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase().replace(/^#/, '');
    if (!tag || tags.includes(tag) || tags.length >= MAX_TAGS) return;
    setTags((prev) => [...prev, tag]);
  };

  const handleKey = (e) => {
    if (['Enter', ','].includes(e.key)) {
      e.preventDefault();
      addTag(input);
      setInput('');
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const remove = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Add tags</h2>
        <p className="text-sm text-gray-400">Press Enter or comma to add. Up to {MAX_TAGS} tags.</p>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="e.g. design, react, travel"
            disabled={tags.length >= MAX_TAGS}
            className="w-full pl-9 pr-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 transition disabled:opacity-50"
          />
        </div>
        <button
          type="button"
          onClick={() => { addTag(input); setInput(''); }}
          disabled={!input.trim() || tags.length >= MAX_TAGS}
          className="px-4 py-3 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-40 transition"
        >
          Add
        </button>
      </div>

      {/* Chips */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full">
              #{tag}
              <button type="button" onClick={() => remove(tag)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {tags.length === 0 && (
        <div className="py-8 text-center text-gray-400">
          <Tag size={28} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">No tags yet — tags help people discover your post</p>
        </div>
      )}

      <p className="text-xs text-gray-400 text-right">{tags.length}/{MAX_TAGS} tags</p>
    </div>
  );
};

// ─── Step 4: Preview ─────────────────────────────────────────
const StepPreview = ({ images, title, caption, tags, user }) => {
  const [slide, setSlide] = useState(0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Preview</h2>
        <p className="text-sm text-gray-400">This is how your post will appear in the feed.</p>
      </div>

      {/* Post card preview */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">

        {/* Image carousel */}
        {images.length > 0 && (
          <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
            <img src={images[slide].preview} alt="" className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setSlide((s) => Math.max(0, s - 1))}
                  disabled={slide === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center disabled:opacity-30 transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setSlide((s) => Math.min(images.length - 1, s + 1))}
                  disabled={slide === images.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center disabled:opacity-30 transition"
                >
                  <ChevronRight size={16} />
                </button>
                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button key={i} type="button" onClick={() => setSlide(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === slide ? 'bg-white w-3' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Post body */}
        <div className="p-4 space-y-3">
          {/* Author row */}
          <div className="flex items-center gap-2.5">
            <img
              src={user?.profilepic || 'https://via.placeholder.com/40'}
              alt=""
              className="w-8 h-8 rounded-full object-cover bg-gray-200"
            />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username}</span>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white">{title || 'Post title'}</h3>
          {caption && <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{caption}</p>}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t) => (
                <span key={t} className="text-xs text-blue-500 font-medium">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main AddPost ─────────────────────────────────────────────
const AddPost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { isLoading, error: reduxError } = useSelector((s) => s.posts);

  const [step, setStep] = useState(0);
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');

  const canNext = () => {
    if (step === 0) return images.length > 0;
    if (step === 1) return title.trim().length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('caption', caption.trim());
    formData.append('tags', JSON.stringify(tags));
    images.forEach((img) => formData.append('images', img.file));

    const result = await dispatch(addPostThunk(formData));

    if (addPostThunk.fulfilled.match(result)) {
      navigate('/profile');
    } else {
      setError(result.payload || 'Failed to create post');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">New Post</h1>
          <div className="w-12" />
        </div>

        {/* Card */}
        <div className="bg-surface rounded-2xl border border-border p-6">
          <StepBar current={step} />

          {/* Step content */}
          {step === 0 && <StepImages images={images} setImages={setImages} />}
          {step === 1 && <StepDetails title={title} setTitle={setTitle} caption={caption} setCaption={setCaption} />}
          {step === 2 && <StepTags tags={tags} setTags={setTags} />}
          {step === 3 && <StepPreview images={images} title={title} caption={caption} tags={tags} user={user} />}

          {/* Error */}
          {(error || reduxError) && (
            <p className="mt-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2.5 rounded-xl">
              {error || reduxError}
            </p>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-3 text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Back
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="flex-1 py-3 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-40 transition flex items-center justify-center gap-2"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 py-3 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-60 transition flex items-center justify-center gap-2"
              >
                {isLoading ? <><Loader2 size={16} className="animate-spin" /> Publishing…</> : 'Publish post'}
              </button>
            )}
          </div>
        </div>

        {/* Step hint */}
        <p className="text-center text-xs text-text-secondary mt-4">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  );
};

export default AddPost;