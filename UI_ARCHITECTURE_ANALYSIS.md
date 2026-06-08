# Blog Application - UI Architecture, Workflow & Implementation Checklist

## 📊 Project Overview

**Blog Website** is a full-stack social blogging platform with:
- Posts/Articles with comments and interactions
- User profiles with followers/following system
- Stories feature (similar to Instagram stories)
- Admin dashboard for moderation
- Real-time feeds with different views

---

## 🏗️ Frontend Architecture

### Technology Stack
- **Framework**: React 19.1.1 + Vite
- **State Management**: Redux Toolkit + Redux Persist
- **Data Fetching**: React Query (TanStack Query) for infinite scroll
- **Styling**: Tailwind CSS 4.1.17
- **UI Icons**: Lucide React
- **Form Handling**: Quill Editor (for article creation)
- **HTTP Client**: Axios with custom instance
- **Routing**: React Router DOM v7

### Folder Structure
```
src/
├── pages/                    # Page components
│   ├── articles/            # Article/Story pages
│   ├── auth/                # Sign In/Sign Up
│   ├── dashboard/           # Main layout with header/navbar
│   └── profile/             # User profile pages
├── components/              # Reusable components
│   ├── posts/               # Post layout, feed, interactions
│   ├── posts/commentSection # Comment components
│   ├── MainLayout.jsx       # Layout wrapper
│   └── ProtectedRoutes.jsx  # Auth guard
├── hooks/                   # Custom React hooks (usePosts)
├── redux_slices/            # Redux state slices
├── redux_thunks/            # Async Redux actions
├── redux_apis/              # API call functions
├── utils/                   # Utilities (AxiosInstance)
└── data/                    # Static data
```

---

## 🔄 Data Flow & Workflow

### Authentication Flow
```
SignUp/SignIn Page
    ↓
loginThunk / registerThunk (Redux)
    ↓
API: POST /auth/signin or /auth/signup
    ↓
Store JWT token + user in Redux + localStorage (redux-persist)
    ↓
ProtectedRoute checks token → Navigate to Feed
```

### Feed Workflow
```
Feed Component
    ↓
usePosts() hook (React Query)
    ↓
Infinite Query: GET /feed/{type}?page={page}&limit=10
    ↓
IntersectionObserver triggers fetchNextPage when visible
    ↓
PostLayout renders each post
    ↓
User interactions (like, comment, save)
```

### Post Creation Workflow
```
AddPost Component (stub - needs implementation)
    ↓
FormData with title, caption, tags, images
    ↓
POST /posts (multipart/form-data)
    ↓
Images uploaded to Cloudinary via multer-storage-cloudinary
    ↓
Success → Navigate to Feed / Show toast
```

### Article/Story Workflow
```
CreateArticle Component
    ↓
Quill editor for rich content
    ↓
Select thumbnail image
    ↓
POST /stories (with thumbnail + content)
    ↓
ArticleFeed loads GET /stories/feed
    ↓
Click article → ArticleRead page
```

### Profile Workflow
```
ProfilePage Component
    ↓
getCurrentUserThunk() → GET /auth/current
    ↓
Display user info, posts, followers/following counts
    ↓
Click Edit → UpdateProfile with image
    ↓
PUT /users/profile (multipart/form-data)
    ↓
Redux state updated via editMyProfileThunk
```

### Follow/Unfollow Workflow
```
User clicks "Follow" button
    ↓
followThunk(targetUserId)
    ↓
POST /users/follow/:targetId
    ↓
Backend toggles follow relationship
    ↓
Redux state updated, UI reflects change
```

---

## 📋 Current Implementation Status

### ✅ Implemented Features
1. **Authentication**
   - Sign In & Sign Up pages with form validation
   - JWT token management
   - Redux auth state management
   - Protected routes
   - Persistent login (redux-persist)

2. **Feed**
   - Infinite scroll with React Query
   - Two feed types: "For You" & "Following"
   - Switch feed with floating menu button
   - Scroll-to-top FAB
   - Loading skeletons

3. **Post Layout (Display)**
   - Post images, title, caption
   - Author info with profile picture
   - Like/save/comment UI elements
   - Comment section (right panel on desktop)
   - Comment input with reply functionality
   - Comment deletion (for owner)

4. **Articles/Stories**
   - Create article with Quill editor
   - Article feed with card layout
   - Article read view
   - Pagination for articles
   - Tags display

5. **User Profile**
   - Display user info, bio, profile picture
   - Cover image
   - Followers/following counts
   - Posts grid view
   - Edit profile UI started

6. **Navigation**
   - Main layout with header & sidebar
   - Responsive navbar (mobile bottom, desktop sidebar)
   - Route protection

---

## ❌ Missing/Incomplete Features

### High Priority (Core Features)
1. **AddPost Component** - Completely stub, needs full implementation
2. **Post Interactions** - Like, save, comment mutations not implemented
3. **Follow/Unfollow** - UI present but mutations not wired
4. **User Profile Edit** - Form not fully implemented
5. **Comment Mutations** - Hooks exist but API calls incomplete
6. **Admin Dashboard** - No UI implemented

### Medium Priority (User Experience)
1. **Search Functionality** - No search page/component
2. **Notifications** - No notification system
3. **User Discovery** - No explore/discover page
4. **User Following Feed** - Following tab might not work correctly
5. **Story Interactions** - Like/comment/save for stories
6. **Saved Posts** - No saved posts view

### Low Priority (Polish)
1. **Moderation Tools** - User restriction UI
2. **Sharing** - Share post functionality
3. **Better Error Handling** - Toast notifications
4. **Loading States** - Better feedback
5. **Empty States** - Better empty state messages

---

## 🔗 API Integration Status

### Endpoints Implemented in Frontend
| Feature | Endpoint | Status | Component |
|---------|----------|--------|-----------|
| Sign In | POST /auth/signin | ✅ | SignIn.jsx |
| Sign Up | POST /auth/signup | ✅ | SignUp.jsx |
| Current User | GET /auth/current | ✅ | ProfilePage.jsx |
| Get Feed | GET /feed/{type} | ✅ | Feed.jsx |
| Get Articles | GET /stories/feed | ✅ | ArticleFeed.jsx |
| Create Article | POST /stories | ✅ | CreateArticle.jsx |
| Get User Posts | GET /posts/my | ✅ | useUserPosts hook |
| **Like Post** | PUT /posts/:id/like | ❌ | PostLayout.jsx (UI only) |
| **Save Post** | PUT /posts/:id/save | ❌ | PostLayout.jsx (UI only) |
| **Add Comment** | POST /posts/:id/comment | ⚠️ | Partial implementation |
| **Delete Comment** | DELETE /posts/:postId/comment/:id | ⚠️ | Partial implementation |
| **Create Post** | POST /posts | ❌ | AddPost.jsx (stub) |
| **Update Profile** | PUT /users/profile | ❌ | ProfilePage.jsx (stub) |
| **Follow User** | POST /users/follow/:id | ❌ | PostLayout.jsx (UI only) |
| Get Followers | GET /users/:id/followers | ❌ | Not implemented |
| Get Following | GET /users/:id/following | ❌ | Not implemented |
| Story Interactions | POST /stories/:id/{like,save,comment} | ❌ | Not implemented |
| Admin Routes | GET /admin/* | ❌ | Not implemented |

---

## 🎨 UI Component Structure

### Page Components
- `SignIn.jsx` - Login form ✅
- `SignUp.jsx` - Registration form ✅
- `Feed.jsx` - Main infinite scroll feed ✅
- `ProfilePage.jsx` - User profile display ⚠️ (partial)
- `ArticleFeed.jsx` - Article list view ✅
- `ArticleRead.jsx` - Article detail view ✅
- `CreateArticle.jsx` - Article editor ✅
- `AddPost.jsx` - Post creation ❌ (stub)
- `Home.jsx` - Dashboard wrapper ✅

### Sub-Components
- `PostLayout.jsx` - Post card with all interactions ⚠️ (UI only)
- `CommentItem.jsx` - Recursive comment display ✅
- `Interactions.jsx` - Like/Save/Comment buttons ✅
- `UserHeader.jsx` - Profile header in post ✅
- `ArticleCard.jsx` - Article preview card ✅
- `MainLayout.jsx` - App layout wrapper ✅
- `NavBar.jsx` - Navigation menu ✅
- `Header.jsx` - Top header bar ✅

---

## 🚨 Key Issues & Observations

1. **Post Images Display Bug**
   - PostLayout uses `post.images` (string) instead of proper array handling
   - Cloudinary returns array of `{url, public_id}` objects

2. **Missing API Wiring**
   - Interactions (like/save/comment) have UI but no API calls
   - State is local only, not persisted to backend

3. **Profile Data Issue**
   - `getCurrentUserThunk` might only return user ID, not full details
   - Profile page comments show "why its just id not any details?"

4. **Incomplete Hooks**
   - `useCommentMutation` and `useDeleteCommentMutation` exist but may not be fully integrated
   - No `useLikeMutation`, `useSaveMutation` hooks

5. **Missing Redux Slices**
   - No slice for managing post interactions (likes, saves)
   - No slice for comment management

6. **Article/Story Naming Confusion**
   - Backend calls them "stories" but frontend calls them "articles"
   - Endpoint: `/stories` but routes: `/articles`

---

## 🔐 Authentication & Protected Routes

### Current Implementation
```jsx
// ProtectedRoute checks for token
// If no token → redirect to /signin
// If token exists → allow access

// authSlice stores:
- user: { _id, username, email, profile, bio, role, ... }
- token: JWT string
- role: 'user' | 'author' | 'admin'
```

### Redux Persist
- Auth state persists to localStorage
- Survives page refresh

---

## 📱 Responsive Design Status

| Screen Size | Status | Notes |
|------------|--------|-------|
| Mobile | ✅ | Optimized for < 768px |
| Tablet | ✅ | Responsive layout |
| Desktop | ✅ | Full-featured layout |
| Post Layout | ✅ | Mobile: stacked, Desktop: side-by-side |
| Navigation | ✅ | Mobile: bottom bar, Desktop: sidebar |

---

## 🎯 State Management

### Redux Store Structure
```javascript
{
  auth: {
    user: { _id, username, email, profile, bio, role, ... },
    token: "jwt_token",
    role: "user|author|admin",
    isLoading: boolean,
    error: string | null
  },
  articles: {
    articles: [],
    isLoading: boolean,
    pagination: { page, totalPages },
    error: null
  },
  posts: {
    posts: [],
    loading: boolean,
    error: null
  },
  user: {
    users: [],
    error: null
  }
}
```

### React Query Cache
- `['posts', 'for-you']` - For you feed
- `['posts', 'following']` - Following feed
- `['userPosts']` - User's own posts
- `['articles']` - Article feed

---

## 🛠️ Development Setup

### Start Backend
```bash
cd blog-backend
npm run dev  # Runs on http://localhost:5000
```

### Start Frontend
```bash
cd frontend
npm run dev  # Runs on http://localhost:5173
```

### Environment Setup
- Backend `.env` requires: PORT, MONGODB_URI, JWT_SECRET, CLOUDINARY_*
- Frontend uses Vite, Axios auto-configured in `AxiosInstance.js`

