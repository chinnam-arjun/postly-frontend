import React from 'react'
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import Home from './pages/dashboard/Home';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import AddPost from './components/posts/AddPost';
import Feed from './components/posts/Feed';
import ProfilePage from './pages/profile/mine/ProfilePage';
import CreateArticle from './pages/articles/CreateArticle';      // ✅
import ArticleFeed from './pages/articles/ArticleFeed';          // ✅
import ArticleRead from './pages/articles/ArticleRead';          // ✅

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/addpost" element={<AddPost />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Article Routes ✅ */}
          <Route path="/articles" element={<ArticleFeed />} />
          <Route path="/articles/create" element={<CreateArticle />} />
          <Route path="/articles/:storyId" element={<ArticleRead />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App