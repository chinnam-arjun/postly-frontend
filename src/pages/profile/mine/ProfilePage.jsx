import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUserThunk } from '../../../redux_thunks/authThunk';
import { useUserPosts } from '../../../hooks/usePosts';
import PostLayout from '../../../components/posts/postLayout/PostLayout';
import { Settings, Grid3X3, FileText, X } from 'lucide-react';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);
  const { data: posts, isLoading: postsLoading, error: postsError } = useUserPosts();
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    // Fetch current user data if not available
    if (!user) {
      dispatch(getCurrentUserThunk());
    }
  }, [dispatch, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Unable to load profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {/* Cover Photo Placeholder */}
          <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-4 relative">
              {/* Avatar */}
              <div className="relative mb-4 sm:mb-0">
                <img
                  src={user.profilepic || 'https://via.placeholder.com/150'}
                  alt={user.username}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 ml-0 sm:ml-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {user.username}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      @{user.username}
                    </p>
                  </div>

                  {/* Edit Profile Button */}
                  <button className="mt-4 sm:mt-0 px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                    <Settings size={16} />
                    Edit Profile
                  </button>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {posts?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {user.followers?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {user.following?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {user.bio}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b dark:border-gray-700">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'posts'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Grid3X3 size={18} />
              Posts
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'articles'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FileText size={18} />
              Articles
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'posts' && (
              <div>
                {postsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : postsError ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    Failed to load posts
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedPost(post)}
                      >
                        <img
                          src={post.images?.[0]?.url || 'https://via.placeholder.com/300'}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No posts yet
                  </div>
                )}
              </div>
            )}

            {activeTab === 'articles' && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Articles feature coming soon
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="max-h-[90vh] overflow-y-auto">
              <PostLayout post={{
                ...selectedPost,
                images: Array.isArray(selectedPost.images) ? selectedPost.images[0]?.url : selectedPost.images,
                author: {
                  ...selectedPost.author,
                  profilepic: selectedPost.author?.profilepic || selectedPost.author?.profile || 'https://via.placeholder.com/150'
                },
                comments: selectedPost.comments?.map(comment => ({
                  ...comment,
                  userId: comment.author || comment.userId
                })) || []
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;