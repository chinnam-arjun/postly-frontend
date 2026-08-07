import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import MainLayout from './components/MainLayout';
import Feed from './components/posts/Feed';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import AddPost from './components/posts/AddPost';
import ProfilePage from './pages/profile/mine/ProfilePage';
import CreateArticle from './pages/articles/CreateArticle';
import ArticleFeed from './pages/articles/ArticleFeed';
import ArticleRead from './pages/articles/ArticleRead';
import EditArticle from './pages/articles/EditArticle';
import LibraryPage from './pages/library/LibraryPage';
import PostPage from './pages/PostPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/addpost" element={<AddPost />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/library" element={<LibraryPage />} />

            {/* Article / Lists Routes */}
            <Route path="/articles" element={<ArticleFeed />} />
            <Route path="/lists" element={<ArticleFeed />} />
            <Route path="/articles/create" element={<CreateArticle />} />
            <Route path="/lists/create" element={<CreateArticle />} />
            <Route path="/articles/:storyId" element={<ArticleRead />} />
            <Route path="/lists/:storyId" element={<ArticleRead />} />
            <Route path="/articles/:storyId/edit" element={<EditArticle />} />
            <Route path="/lists/:storyId/edit" element={<EditArticle />} />
            <Route path="/post/:postId" element={<PostPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App