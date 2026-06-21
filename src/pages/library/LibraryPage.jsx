// pages/library/LibraryPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedPostsThunk } from '../../redux_thunks/postThunk';
import PostLayout from '../../components/posts/postLayout/PostLayout';
import { Bookmark } from 'lucide-react';

const LibraryPage = () => {
    const dispatch = useDispatch();
    const { savedPosts, savedPostsLoading } = useSelector((state) => state.posts);

    useEffect(() => {
        dispatch(getSavedPostsThunk());
    }, [dispatch]);

    if (savedPostsLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (savedPosts.length === 0) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-3 text-gray-400">
                <Bookmark size={32} className="opacity-30" />
                <p className="text-sm">No saved posts yet</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                {savedPosts.map((post) => (
                    <PostLayout key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default LibraryPage;