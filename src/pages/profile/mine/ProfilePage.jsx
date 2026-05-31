/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUserThunk } from '../../../redux_thunks/authThunk';

import { useUserPosts } from '../../../hooks/usePosts';
import PostLayout from '../../../components/posts/postLayout/PostLayout';
import { Settings, Grid3X3, FileText, X, Heart, MessageCircle, Bookmark, CloudSnow } from 'lucide-react';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);
  const { data: posts, isLoading: postsLoading, error: postsError } = useUserPosts();
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (!user) dispatch(getCurrentUserThunk());
  }, [dispatch, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-gray-800 dark:border-gray-700 dark:border-t-gray-200" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Unable to load profile</p>
      </div>
    );
  }

  console.log(user)//why its just id not any details ?
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-3">

        {/* ── Profile card ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">

          {/* Cover */}
          <div className="h-36 sm:h-44 bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 relative">
            {/* subtle texture overlay */}
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
          </div>

          <div className="px-5 pb-5">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-10 mb-3">
              <div className="relative">
                <img
                  src={user.username || 'https://via.placeholder.com/150'}
                  alt={user.username}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-gray-900 object-cover bg-gray-100 dark:bg-gray-800"
                />
                {/* online indicator */}
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full" />
              </div>

              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl transition-colors">
                <Settings size={15} />
                Edit profile
              </button>
            </div>

            {/* Name + handle */}
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
              {user.username}
            </h1>
            <p className="text-sm text-gray-400 mb-2">@{user.username}</p>

            {/* Bio */}
            {user.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {user.bio}
              </p>
            )}

            {/* Stats strip */}
            <div className="flex border-t border-gray-100 dark:border-gray-800 pt-4 mt-1">
              {[
                { label: 'Posts', value: posts?.length ?? 0 },
                { label: 'Followers', value: user.followers?.length ?? 0 },
                { label: 'Following', value: user.following?.length ?? 0 },
              ].map((s, i) => (
                <div key={s.label} className={`flex-1 text-center ${i !== 0 ? 'border-l border-gray-100 dark:border-gray-800' : ''}`}>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {s.value >= 1000 ? `${(s.value / 1000).toFixed(1)}k` : s.value}
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs + content ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">

          {/* Tab bar */}
          <div className="flex border-b border-gray-100 dark:border-gray-800">
            {[
              { key: 'posts', label: 'Posts', Icon: Grid3X3 },
              { key: 'articles', label: 'Articles', Icon: FileText },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === key
                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* Posts tab */}
          {activeTab === 'posts' && (
            <>
              {postsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-700 dark:border-gray-700 dark:border-t-gray-300" />
                </div>
              ) : postsError ? (
                <div className="py-16 text-center text-sm text-gray-400">
                  Failed to load posts
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-0.5 p-0.5">
                  {posts.map((post, idx) => (
                    <div
                      key={post._id}
                      onClick={() => setSelectedPost(post)}
                      className={`relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer group
                        ${idx === 0 ? 'rounded-tl-xl' : ''}
                        ${idx === 2 ? 'rounded-tr-xl' : ''}
                        ${idx === posts.length - 1 && posts.length % 3 === 0 ? 'rounded-br-xl' : ''}
                        ${idx === posts.length - 3 && posts.length % 3 === 0 ? 'rounded-bl-xl' : ''}
                      `}
                    >
                      <img
                        src={post.images?.[0]?.url || 'https://via.placeholder.com/300'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* hover overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                        <span className="flex items-center gap-1.5 text-white text-sm font-semibold">
                          <Heart size={16} fill="white" />
                          {post.likesCount ?? post.likes?.length ?? 0}
                        </span>
                        <span className="flex items-center gap-1.5 text-white text-sm font-semibold">
                          <MessageCircle size={16} fill="white" stroke="white" />
                          {post.commentsCount ?? post.comments?.length ?? 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                  <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Grid3X3 size={24} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-sm">No posts yet</p>
                </div>
              )}
            </>
          )}

          {/* Articles tab */}
          {activeTab === 'articles' && (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
              <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <FileText size={24} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-sm">Articles coming soon</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Post modal ── */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedPost(null)}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative shadow-2xl">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
            <div className="overflow-y-auto max-h-[90vh]">
              <PostLayout post={{
                ...selectedPost,
                images: Array.isArray(selectedPost.images) ? selectedPost.images[0]?.url : selectedPost.images,
                author: {
                  ...selectedPost.author,
                  profilepic: selectedPost.author?.profilepic || selectedPost.author?.profile || 'https://via.placeholder.com/150',
                },
                comments: selectedPost.comments?.map(comment => ({
                  ...comment,
                  userId: comment.author || comment.userId,
                })) || [],
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
