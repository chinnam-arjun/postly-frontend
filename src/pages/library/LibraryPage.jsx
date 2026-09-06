// pages/library/LibraryPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSavedPostsThunk } from '../../redux_thunks/postThunk';
import { getSavedArticlesThunk } from '../../redux_thunks/articleThunk';
import PostLayout from '../../components/posts/postLayout/PostLayout';
import { Bookmark, BookOpen } from 'lucide-react';

const ArticleCard = ({ article }) => {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(`/lists/${article._id}`)}
            className="w-full rounded-2xl border border-border bg-surface-elevated p-4 text-left shadow-[var(--shadow-soft)] transition hover:border-violet-500/50 hover:bg-surface-muted"
        >
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-border bg-surface-muted">
                        {article?.author?.profile || article?.user?.profile ? (
                            <img
                                src={article.author?.profile || article.user?.profile}
                                alt={article.author?.username || article.user?.username || 'Author'}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-text-primary">
                                {(article?.author?.username || article?.user?.username || 'A').slice(0, 1).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-text-primary">
                            {article?.author?.username || article?.user?.username || 'Unknown author'}
                        </p>
                        <p className="text-xs text-text-muted">Saved article</p>
                    </div>
                </div>
                <span className="rounded-full border border-border bg-surface-muted px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-text-muted">
                    Story
                </span>
            </div>

            <div className="mb-2 flex items-center gap-2 text-xs text-text-secondary">
                <span>{article?.tags?.[0] || 'General'}</span>
                <span>•</span>
                <span>{article?.readingTime || '3 min read'}</span>
            </div>

            <h3 className="line-clamp-2 text-lg font-semibold text-text-primary">{article?.title || 'Untitled article'}</h3>

            <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
                <span>♥ {article?.likesCount || 0}</span>
                <span>💬 {article?.commentsCount || 0}</span>
                <span>🔖 {article?.savesCount || 0}</span>
            </div>
        </button>
    );
};

const LibraryPage = () => {
    const dispatch = useDispatch();
    const { savedPosts, savedPostsLoading } = useSelector((state) => state.posts);
    const { savedArticles, savedArticlesLoading } = useSelector((state) => state.articles);

    useEffect(() => {
        dispatch(getSavedPostsThunk());
        dispatch(getSavedArticlesThunk());
    }, [dispatch]);

    const isLoading = savedPostsLoading || savedArticlesLoading;
    const hasSavedPosts = savedPosts.length > 0;
    const hasSavedArticles = savedArticles.length > 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!hasSavedPosts && !hasSavedArticles) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-3 text-gray-400">
                <Bookmark size={32} className="opacity-30" />
                <p className="text-sm">No saved posts or articles yet</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-4 lg:p-8">
            <div className="mx-auto max-w-4xl flex flex-col gap-8">
                {hasSavedPosts && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-text-primary">
                            <Bookmark size={18} className="text-violet-400" />
                            <h2 className="text-lg font-semibold">Saved posts</h2>
                        </div>
                        <div className="flex flex-col gap-6">
                            {savedPosts.map((post) => (
                                <PostLayout key={post._id} post={post} />
                            ))}
                        </div>
                    </section>
                )}

                {hasSavedArticles && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-text-primary">
                            <BookOpen size={18} className="text-violet-400" />
                            <h2 className="text-lg font-semibold">Saved articles</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            {savedArticles.map((article) => (
                                <ArticleCard key={article._id} article={article} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default LibraryPage;