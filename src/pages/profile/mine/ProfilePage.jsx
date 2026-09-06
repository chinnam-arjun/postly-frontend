/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getCurrentUserThunk } from '../../../redux_thunks/authThunk';
import { editMyProfileThunk } from '../../../redux_thunks/userThunk';
import { getMyArticlesThunk } from '../../../redux_thunks/articleThunk';
import { useUserPosts } from '../../../hooks/usePosts';
import { getSpecificUserPosts } from '../../../redux_apis/post';
import { getUserProfile } from '../../../redux_apis/user';
import { getUserArticlesAPI } from '../../../redux_apis/article';
import PostLayout from '../../../components/posts/postLayout/PostLayout';
import { Settings, Grid3X3, FileText, X, Heart, MessageCircle, Bookmark, CloudSnow } from 'lucide-react';

const ProfilePage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, token, isLoading: authLoading } = useSelector((state) => state.auth);
  const { isLoading: profileUpdating, error: profileError } = useSelector((state) => state.users);
  const { data: posts, isLoading: postsLoading, error: postsError } = useUserPosts();
  const { articles, isLoading: articlesLoading, error: articlesError } = useSelector((state) => state.articles);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(user?.profile || user?.profilepic || '');
  const [formValues, setFormValues] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    profile: user?.profile || user?.profilepic || ''
  });
  const [saveError, setSaveError] = useState(null);
  const [viewedUser, setViewedUser] = useState(null);
  const [viewedPosts, setViewedPosts] = useState([]);
  const [viewedArticles, setViewedArticles] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  const isOwnProfile = !userId || String(userId) === String(user?._id);
  const profileUser = isOwnProfile ? user : viewedUser;
  const showBackToSearch = !isOwnProfile && Boolean(location.state?.fromSearch);

  const goBackToSearchResults = () => {
    const savedContext = sessionStorage.getItem('postly-search-context');
    if (savedContext) {
      try {
        const parsed = JSON.parse(savedContext);
        if (parsed?.query || parsed?.activeTab) {
          navigate('/feed');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('postly-open-search', { detail: parsed }));
          }, 0);
          return;
        }
      } catch {
        // ignore and fall back
      }
    }

    if (window.history.length > 2) {
      navigate(-1);
      return;
    }
    navigate('/feed');
  };

  const createArticleMarkup = (html = '') => ({
    __html: DOMPurify.sanitize(html)
  });

  useEffect(() => {
    if (user) {
      setFormValues({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        profile: user.profile || user.profilepic || ''
      });
      setProfilePreview(user.profile || user.profilepic || '');
    }
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSaveError(null);
    try {
      const payload = new FormData();
      payload.append('name', formValues.name);
      payload.append('username', formValues.username);
      payload.append('bio', formValues.bio);
      if (profileFile) {
        payload.append('profile', profileFile);
      } else if (formValues.profile) {
        payload.append('profile', formValues.profile);
      }
      await dispatch(editMyProfileThunk(payload)).unwrap();
      setIsEditing(false);
      setProfileFile(null);
    } catch (error) {
      setSaveError(error?.message || 'Unable to save changes.');
    }
  };

  useEffect(() => {
    if (token && (!user || !user.username || !user.name)) {
      dispatch(getCurrentUserThunk());
    }
  }, [dispatch, token]);

  // Fetch articles when component mounts
  useEffect(() => {
    dispatch(getMyArticlesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (isOwnProfile || !userId) return undefined;
    let active = true;
    setViewLoading(true);
    Promise.all([getUserProfile(userId), getSpecificUserPosts(userId), getUserArticlesAPI(userId)])
      .then(([profileResponse, postsResponse, articlesResponse]) => {
        if (!active) return;
        setViewedUser(profileResponse.user || profileResponse);
        setViewedPosts(postsResponse.data?.posts || []);
        setViewedArticles(articlesResponse.stories || []);
      })
      .catch(() => active && setViewedUser(null))
      .finally(() => active && setViewLoading(false));
    return () => { active = false; };
  }, [isOwnProfile, userId]);

  const profilePosts = isOwnProfile ? posts : viewedPosts;
  const profileArticles = isOwnProfile ? articles : viewedArticles;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-gray-800 dark:border-gray-700 dark:border-t-gray-200" />
      </div>
    );
  }

  if (!profileUser || viewLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-3">

        {showBackToSearch && (
          <button
            type="button"
            onClick={goBackToSearchResults}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-muted"
          >
            <span aria-hidden="true">←</span>
            Back to search results
          </button>
        )}

        {/* ── Profile card ── */}
        <div className="bg-surface-elevated rounded-2xl overflow-hidden border border-border">

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
                  src={profileUser.profile || 'https://via.placeholder.com/150'}
                  alt={profileUser.username}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-border object-cover bg-surface-muted"
                />
                {/* online indicator */}
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full" />
              </div>

              {isOwnProfile && <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-surface-muted hover:bg-surface-elevated text-text-primary rounded-xl transition-colors"
              >
                <Settings size={15} />
                Edit profile
              </button>}
            </div>

            {/* Name + handle */}
            <h1 className="text-lg font-semibold text-text-primary leading-tight">
              {profileUser.name || profileUser.username}
            </h1>
            <p className="text-sm text-text-muted mb-2">@{profileUser.username}</p>

            {/* Bio */}
            {profileUser.bio && (
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {profileUser.bio}
              </p>
            )}

            {/* Stats strip */}
            <div className="flex border-t border-border pt-4 mt-1">
              {[
                { label: 'Posts', value: profilePosts?.length ?? 0 },
                { label: 'Followers', value: profileUser.followers?.length ?? profileUser.followersCount ?? 0 },
                { label: 'Following', value: profileUser.following?.length ?? profileUser.followingCount ?? 0 },
              ].map((s, i) => (
                <div key={s.label} className={`flex-1 text-center ${i !== 0 ? 'border-l border-gray-100 dark:border-gray-800' : ''}`}>
                  <p className="text-base font-semibold text-text-primary">
                    {s.value >= 1000 ? `${(s.value / 1000).toFixed(1)}k` : s.value}
                  </p>
                  <p className="text-xs text-text-muted uppercase tracking-wide mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs + content ── */}
        <div className="bg-surface-elevated rounded-2xl overflow-hidden border border-border">

          {/* Tab bar */}
          <div className="flex border-b border-border">
            {[
              { key: 'posts', label: 'Posts', Icon: Grid3X3 },
              { key: 'articles', label: 'Articles', Icon: FileText },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
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
              ) : profilePosts && profilePosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-0.5 p-0.5">
                  {profilePosts.map((post, idx) => (
                    <div
                      key={post._id}
                      onClick={() => setSelectedPost(post)}
                      className={`relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer group
                        ${idx === 0 ? 'rounded-tl-xl' : ''}
                        ${idx === 2 ? 'rounded-tr-xl' : ''}
                        ${idx === profilePosts.length - 1 && profilePosts.length % 3 === 0 ? 'rounded-br-xl' : ''}
                        ${idx === profilePosts.length - 3 && profilePosts.length % 3 === 0 ? 'rounded-bl-xl' : ''}
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
                <div className="py-16 flex flex-col items-center gap-3 text-text-muted">
                  <div className="w-14 h-14 rounded-full bg-surface-muted flex items-center justify-center">
                    <Grid3X3 size={24} className="text-text-secondary" />
                  </div>
                  <p className="text-sm">No posts yet</p>
                </div>
              )}
            </>
          )}
          {activeTab === 'articles' && (
            <>
              {articlesLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-700 dark:border-gray-700 dark:border-t-gray-300" />
                </div>
              ) : articlesError ? (
                <div className="py-16 text-center text-sm text-gray-400">
                  Failed to load articles
                </div>
              ) : profileArticles && profileArticles.length > 0 ? (
                <div className="grid grid-cols-3 gap-0.5 p-0.5">
                  {profileArticles.map((article, idx) => (
                    <div
                      key={article._id}
                      onClick={() => navigate(`/lists/${article._id}`)}
                      className={`relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer group
                        ${idx === 0 ? 'rounded-tl-xl' : ''}
                        ${idx === 2 ? 'rounded-tr-xl' : ''}
                        ${idx === profileArticles.length - 1 && profileArticles.length % 3 === 0 ? 'rounded-br-xl' : ''}
                        ${idx === profileArticles.length - 3 && profileArticles.length % 3 === 0 ? 'rounded-bl-xl' : ''}
                      `}
                    >
                      <img
                        src={article.thumbnailUrl || article.thumbnail || 'https://via.placeholder.com/300'}
                        alt={article.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = 'https://via.placeholder.com/300'
                        }}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* hover overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2">
                        <p className="text-white text-xs font-semibold text-center line-clamp-2">{article.title}</p>
                        <span className="flex items-center gap-1.5 text-white text-sm font-semibold">
                          <Heart size={16} fill="white" />
                          {article.likesCount ?? article.likes?.length ?? 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                  <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <FileText size={24} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-sm">No articles yet</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Edit profile modal ── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setIsEditing(false)}>
          <div className="w-full max-w-2xl bg-surface-elevated rounded-3xl border border-border shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Edit profile</h2>
                <p className="text-sm text-text-secondary">Update your display name, username, bio, and avatar.</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-surface-muted text-text-secondary hover:text-text-primary transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary" htmlFor="name">Full name</label>
                  <input
                    id="name"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-text-primary outline-none focus:border-primary"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary" htmlFor="username">Username</label>
                  <input
                    id="username"
                    name="username"
                    value={formValues.username}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-text-primary outline-none focus:border-primary"
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary" htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formValues.bio}
                  onChange={handleInputChange}
                  className="w-full min-h-[120px] resize-none rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-text-primary outline-none focus:border-primary"
                  placeholder="Tell people a little about yourself"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-[120px_1fr] items-center">
                <div className="rounded-3xl border border-border bg-surface-muted p-4 flex items-center justify-center overflow-hidden">
                  {profilePreview ? (
                    <img src={profilePreview} alt="Profile preview" className="h-24 w-24 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-muted text-text-muted">Preview</div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">Profile photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileFileChange}
                    className="w-full text-sm text-text-secondary file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                  <p className="text-xs text-text-muted">Leave empty to keep the existing photo.</p>
                </div>
              </div>

              {saveError && <p className="text-sm text-red-400">{saveError}</p>}
              {profileError && <p className="text-sm text-red-400">{profileError}</p>}

              <div className="flex flex-wrap items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-2xl border border-border bg-surface-muted px-5 py-3 text-sm font-medium text-text-primary hover:border-border-strong"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileUpdating}
                  className="rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {profileUpdating ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Post modal ── */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedPost(null)}
        >
          <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative shadow-2xl border border-gray-800">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
            <div className="overflow-y-auto max-h-[90vh]">
              <PostLayout post={{
                ...selectedPost,
                images: selectedPost.images,   // 👈 pass the full array, no transform needed
                author: {
                  ...selectedPost.author,
                  profilepic: selectedPost.author?.profilepic || selectedPost.author?.profile || 'https://via.placeholder.com/150'
                },
                comments: selectedPost.comments?.map(comment => ({
                  ...comment,
                  userId: comment.author || comment.userId
                })) || []
              }} 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
