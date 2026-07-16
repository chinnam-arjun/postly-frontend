import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import PostLayout from './PostLayout/PostLayout';
import { usePosts } from '../../hooks/usePosts';
import { setPosts } from '../../redux_slices/postSlice';
import { ChevronUp, Filter, Check } from 'lucide-react';

const normalizeUserIds = (value = []) => {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => typeof item === 'string' ? item : item?._id || item?.id)
        .filter(Boolean)
        .map(String);
};

const Feed = () => {
    const [activeTab, setActiveTab] = useState('for-you');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const currentUserFollowing = useSelector((state) => normalizeUserIds(state.auth.user?.followingIds || state.auth.user?.following || []));
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePosts(activeTab);
    const { ref, inView } = useInView({ rootMargin: '600px' });
    const menuRef = useRef(null);

    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage();
    }, [inView, hasNextPage, fetchNextPage]);

    useEffect(() => {
        if (data?.pages) {
            const allPosts = data.pages.flatMap((page) => page.posts || []);
            const filteredPosts = allPosts.filter((post) => {
                const authorId = post?.author?._id ? String(post.author._id) : '';
                const isFollowedAuthor = Boolean(post?.author?.isFollowing) || currentUserFollowing.includes(authorId);
                return activeTab === 'following' ? isFollowedAuthor : !isFollowedAuthor;
            });
            dispatch(setPosts(filteredPosts));
        }
    }, [activeTab, currentUserFollowing, data, dispatch]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full min-h-screen bg-gray-950">
            <main className="max-w-[1400px] mx-auto p-4 lg:p-8">
                <div className="max-w-4xl mx-auto mb-8 mt-4">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {activeTab === 'for-you' ? 'For You' : 'Following'}
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">Discover your next favorite story</p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
                        {[1, 2].map((n) => (
                            <div key={n} className="h-[500px] bg-gray-900 animate-pulse rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                        {activeTab === 'following' && (!data?.pages?.some((page) => (page.posts || []).some((post) => {
                            const authorId = post?.author?._id ? String(post.author._id) : '';
                            return Boolean(post?.author?.isFollowing) || currentUserFollowing.includes(authorId);
                        })) ) ? (
                            <div className="rounded-3xl border border-gray-800 bg-gray-900/70 p-8 text-center">
                                <p className="text-lg font-semibold text-white">No posts from people you follow yet.</p>
                                <p className="mt-2 text-sm text-gray-500">Follow some creators and their latest posts will appear here.</p>
                            </div>
                        ) : (
                            data?.pages.map((page, i) => (
                                <React.Fragment key={i}>
                                    {page.posts?.filter((post) => {
                                        const authorId = post?.author?._id ? String(post.author._id) : '';
                                        const isFollowedAuthor = Boolean(post?.author?.isFollowing) || currentUserFollowing.includes(authorId);
                                        return activeTab === 'following' ? isFollowedAuthor : !isFollowedAuthor;
                                    }).sort((a, b) => {
                                        const aTime = new Date(a?.createdAt || 0).getTime();
                                        const bTime = new Date(b?.createdAt || 0).getTime();
                                        return bTime - aTime;
                                    }).map((post) => (
                                        <PostLayout key={post._id} post={post} />
                                    ))}
                                </React.Fragment>
                            ))
                        )}
                    </div>
                )}

                <div ref={ref} className="py-10 flex justify-center">
                    {isFetchingNextPage && <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                    {!hasNextPage && <p className="text-gray-600 text-sm italic font-medium">You've reached the end of the universe.</p>}
                </div>
            </main>

            <div className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-50 flex flex-col items-end gap-3">
                {isMenuOpen && (
                    <div
                        ref={menuRef}
                        className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-2 mb-2 w-48 animate-in fade-in slide-in-from-bottom-4 duration-200"
                    >
                        {['for-you', 'following'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setIsMenuOpen(false);
                                    scrollToTop();
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === tab
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                }`}
                            >
                                <span>{tab === 'for-you' ? 'For You' : 'Following'}</span>
                                {activeTab === tab && <Check size={16} />}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <button
                        onClick={scrollToTop}
                        className="w-12 h-12 bg-gray-900 text-gray-400 rounded-full flex items-center justify-center shadow-xl hover:bg-gray-800 hover:text-white transition-all active:scale-90 border border-gray-800"
                    >
                        <ChevronUp size={24} />
                    </button>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
                            isMenuOpen
                                ? 'bg-white text-black rotate-90'
                                : 'bg-gradient-to-tr from-blue-600 to-purple-600 text-white hover:shadow-purple-500/20 hover:scale-105'
                        }`}
                    >
                        <Filter size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Feed;
