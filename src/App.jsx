import React from 'react'
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AddPost from './components/posts/AddPost';
import Feed from './components/posts/Feed';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Feed />} />
          <Route path="/addpost" element={<AddPost />} />
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App