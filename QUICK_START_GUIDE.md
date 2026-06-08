# 🚀 Quick Reference Guide - Implementation Guide

## Phase 1: Critical Features (Week 1-2)

### 1. Fix AddPost Component (HIGH EFFORT - 2-3 hours)
**Status**: 🔴 STUB - Need to implement  
**Location**: `src/components/posts/AddPost.jsx`

**What it should do**:
- Form with: title, caption, tags, multiple images
- Image preview before upload
- Form validation
- Submit to `POST /posts` with FormData
- Redirect to feed on success

**Quick Start Code**:
```jsx
import React, { useState } from 'react';
import axiosInstance from '../../utils/AxiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    tags: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('Max 5 images allowed');
      return;
    }
    
    setFormData({ ...formData, images: files });
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.caption.trim()) {
      toast.error('Title and caption required');
      return;
    }

    setIsLoading(true);
    const form = new FormData();
    form.append('title', formData.title);
    form.append('caption', formData.caption);
    form.append('tags', formData.tags);
    
    formData.images.forEach((img, i) => {
      form.append('images', img);
    });

    try {
      const response = await axiosInstance.post('/posts', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Post created!');
      navigate('/feed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-6">
        {/* Form fields here */}
      </form>
    </div>
  );
};

export default AddPost;
```

**Test It**:
1. Navigate to `/addpost`
2. Fill form and upload images
3. Click create
4. Should see success toast and redirect

---

### 2. Wire Like/Save/Comment Mutations (MEDIUM EFFORT - 2 hours)

**Step 1**: Create mutation hooks in `src/hooks/usePosts.js`:

```javascript
export const useLikeMutation = (postId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.put(`/posts/${postId}/like`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post liked!');
    },
    onError: () => toast.error('Failed to like post')
  });
};

export const useSaveMutation = (postId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.put(`/posts/${postId}/save`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => toast.error('Failed to save post')
  });
};
```

**Step 2**: Update `PostLayout.jsx` line ~85:

```javascript
const PostLayout = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const likeMutation = useLikeMutation(post._id);
  const saveMutation = useSaveMutation(post._id);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    await likeMutation.mutateAsync();
  };

  const handleSave = async () => {
    setIsSaved(!isSaved);
    await saveMutation.mutateAsync();
  };

  return (
    // ... 
    <Heart 
      onClick={handleLike}
      className={`cursor-pointer transition-all ${
        isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'
      }`}
      size={24}
    />
    // ...
    <Bookmark 
      onClick={handleSave}
      className={`cursor-pointer transition-all ${
        isSaved ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'
      }`}
      size={24}
    />
  );
};
```

**Test**:
1. Load a post in feed
2. Click heart - should fill red and show toast
3. Click bookmark - should fill yellow

---

### 3. Fix Post Images Display (LOW EFFORT - 30 min)

**Issue**: `post.images` is array but treated as string

**Location**: `src/components/posts/postLayout/PostLayout.jsx` line 79

**Fix**:
```javascript
// BEFORE
<img src={post.images} alt="Post content" className="w-full h-full object-contain" />

// AFTER
<img 
  src={Array.isArray(post.images) && post.images.length > 0 
    ? post.images[0]?.url || post.images[0] 
    : 'https://via.placeholder.com/600'
  } 
  alt="Post content" 
  className="w-full h-full object-contain" 
/>
```

**Test**: Load feed, images should display correctly

---

### 4. Fix Comment Structure (LOW EFFORT - 30 min)

**Issue**: Comment author info not displaying correctly

**Location**: `src/components/posts/postLayout/PostLayout.jsx` line 193-197

**Analysis**: API returns `comment.userId` as either string ID or user object  
**Fix**: Add safe navigation

```javascript
// BEFORE
<img src={comment.userId?.profile} className="w-7 h-7 rounded-full" alt="" />

// AFTER (with fallback)
<img 
  src={
    typeof comment.userId === 'object' 
      ? comment.userId?.profile || 'https://via.placeholder.com/28'
      : 'https://via.placeholder.com/28'
  }
  className="w-7 h-7 rounded-full" 
  alt="" 
/>

{/* Username */}
<span className="font-bold text-[11px]">
  {typeof comment.userId === 'object' 
    ? comment.userId?.username || 'Anonymous'
    : 'Unknown User'
  }
</span>
```

---

## Phase 2: Core Features (Week 3)

### 5. Implement Follow System (MEDIUM EFFORT - 1.5 hours)

**Create hook in `src/hooks/useFollow.js`**:

```javascript
export const useFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId) => {
      const response = await axiosInstance.post(`/users/follow/${targetUserId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('User followed!');
    },
    onError: () => toast.error('Failed to follow user')
  });
};
```

**Update PostLayout.jsx UserHeader section (~line 176)**:

```javascript
import { useFollowMutation } from '../../../hooks/useFollow'; // Add import

const UserHeader = ({ author, isFollowing, setIsFollowing }) => {
  const followMutation = useFollowMutation();

  const handleFollow = async () => {
    setIsFollowing(!isFollowing);
    try {
      await followMutation.mutateAsync(author._id);
    } catch {
      setIsFollowing(!isFollowing); // Rollback on error
    }
  };

  return (
    // ...
    <button 
      onClick={handleFollow}
      disabled={followMutation.isPending}
      className={`text-[10px] font-bold px-4 py-1.5 rounded-full transition-all ${
        isFollowing 
          ? 'bg-gray-800 text-gray-400 border border-gray-700' 
          : 'bg-blue-600 text-white'
      }`}
    >
      {followMutation.isPending ? '...' : (isFollowing ? 'Following' : 'Follow')}
    </button>
  );
};
```

---

### 6. Edit Profile Implementation (MEDIUM EFFORT - 2 hours)

**Location**: `src/pages/profile/mine/ProfilePage.jsx`

**Add EditProfileModal component**:

```javascript
const EditProfileModal = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    profile: null
  });
  const [preview, setPreview] = useState(user?.profile);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData();
    form.append('username', formData.username);
    form.append('bio', formData.bio);
    if (formData.profile) form.append('profile', formData.profile);

    try {
      const response = await axiosInstance.put('/users/profile', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Profile updated!');
      onSuccess(response.data);
      onClose();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username input */}
          <input 
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            placeholder="Username"
            className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-700"
            required
          />
          
          {/* Bio input */}
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            placeholder="Bio"
            maxLength={150}
            className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-700"
            rows="3"
          />
          
          {/* Profile picture input */}
          <div>
            {preview && <img src={preview} alt="Preview" className="w-20 h-20 rounded-full mb-2" />}
            <input 
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({...formData, profile: file});
                setPreview(URL.createObjectURL(file));
              }}
              className="w-full text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

**Add state and button to ProfilePage**:

```javascript
const [showEditModal, setShowEditModal] = useState(false);

return (
  <>
    <button onClick={() => setShowEditModal(true)} className="...">
      Edit profile
    </button>
    {showEditModal && (
      <EditProfileModal 
        user={user}
        onClose={() => setShowEditModal(false)}
        onSuccess={(data) => {/* Update Redux */}}
      />
    )}
  </>
);
```

---

## Phase 3: Nice-to-Have (Week 4)

### 7. Admin Dashboard - Stub

**Location**: New file `src/pages/admin/AdminDashboard.jsx`

**Minimal version**:
```javascript
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/admin/dashboard');
        setStats(response.data.stats);
      } catch (error) {
        toast.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
      
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Total Posts" value={stats.totalPosts} />
          <StatCard label="Total Stories" value={stats.totalStories} />
          <StatCard label="Restricted Users" value={stats.restrictedUsers} />
        </div>
      )}
    </div>
  );
};
```

---

## 🧪 Testing Each Feature

### Post Creation
```
1. Navigate to /addpost
2. Enter title: "Test Post"
3. Enter caption: "This is a test"
4. Enter tags: "test,demo"
5. Select 2 images
6. Click create
7. Should redirect to /feed with toast
8. Check feed - post should appear
```

### Like/Save
```
1. Load feed
2. Click heart - should fill red
3. Click bookmark - should fill yellow
4. Refresh page - state should persist (if backend saving)
5. Check post.likesCount increases
```

### Comments
```
1. Click comment icon
2. Type in comment input
3. Press "Post"
4. Comment should appear below post
5. Click trash icon to delete
6. Confirmation modal (optional)
7. Comment disappears
```

### Follow
```
1. On a post, click "Follow" on author
2. Button should show "Following"
3. Check following count increases
4. Click again - should unfollow
5. Navigate to profile - verify followers list
```

### Edit Profile
```
1. Go to /profile
2. Click "Edit Profile"
3. Change username, bio, upload photo
4. Click save
5. Profile should update
6. Refresh - changes persist
```

---

## 📞 Quick Debugging

| Issue | Solution |
|-------|----------|
| API call not working | Check AxiosInstance config, headers, URL |
| Redux state not updating | Check thunk fulfilled case, dispatch used |
| Images not loading | Check image URL format, CORS settings |
| Component not re-rendering | Check state/props updates, key props |
| Form validation failing | Check required fields, input types |
| Toast not showing | Ensure react-hot-toast initialized, Toaster in App |
| CORS error | Check backend ORIGIN env var, allowed origins |

---

## 🎯 Success Criteria

✅ Feature is complete when:
1. UI renders without errors
2. API calls succeed with correct data
3. Data updates in Redux/React Query
4. UI reflects state changes
5. Error handling with toast notifications
6. Responsive design works
7. Loading states visible
8. Tested on mobile/desktop

---

