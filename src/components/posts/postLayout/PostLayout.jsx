import React, { useState } from 'react'
import PostImages from './PostImages'

// import {Heart,MessageCircle,Save} from 'lucide-react'
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal,X } from 'lucide-react';
const PostLayout = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCommentsMobile, setShowCommentsMobile] = useState(false);
  function formatPostTime(createdAt) {
    const createdDate = new Date(createdAt);
    const now = new Date();

    const diffMs = now - createdDate;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // If more than 24 hours, return formatted date
    if (diffHours >= 24) {
      return createdDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }

    // Less than 24 hours
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }

    if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }

    return `${diffSeconds} second${diffSeconds > 1 ? 's' : ''} ago`;
  }

  return (
    <article className="max-w-screen mx-auto my-6 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-sm lg:h-[700px]">
      
      {/* SECTION 1: CONTENT (Left Side - Fixed 50% on Desktop) */}
      <div className="w-full lg:w-1/2 flex flex-col border-r border-gray-100 bg-black h-full">
        {/* Top: Title (Fixed Height) */}
        <div className="p-4 border-b bg-white h-16 flex items-center justify-between">
          <h2 className="text-md font-bold text-gray-800 truncate pr-4">{post.title}</h2>
          <MoreHorizontal className="text-gray-400 cursor-pointer" size={20} />
        </div>

        {/* Middle: Image Container (Fixed Height/Ratio) */}
        {/* 'flex-grow' ensures this fills the space between header and footer */}
        <div className="relative grow bg-black flex items-center justify-center overflow-hidden">
          <img 
            src={post.images[0]} 
            alt="Post content" 
            className="w-full h-full object-contain" 
          />
        </div>

        {/* Caption, Date & Actions (Fixed Bottom Area) */}
        <div className="bg-white border-t border-gray-50">
           {/* Actions Row */}
           <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsLiked(!isLiked)} className={`transition-all active:scale-125 ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}>
                <Heart fill={isLiked ? "currentColor" : "none"} size={24} />
              </button>
              <button onClick={() => setShowCommentsMobile(true)} className="text-gray-600 hover:text-blue-500 lg:hidden">
                <MessageCircle size={24} />
              </button>
              <button className="text-gray-600 hover:text-green-500"><Share2 size={22} /></button>
            </div>
            <button onClick={() => setIsSaved(!isSaved)} className={isSaved ? 'text-yellow-500' : 'text-gray-600'}>
              <Bookmark fill={isSaved ? "currentColor" : "none"} size={24} />
            </button>
          </div>

          {/* Caption Area (Scrollable if too long to prevent layout jump) */}
          <div className="px-4 pb-4 max-h-32 overflow-y-auto">
            <p className="text-sm font-semibold mb-1">{isLiked ? post.likesCount + 1 : post.likesCount} likes</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              <span className="font-bold mr-2">{post.author.username}</span>
              {post.caption}
            </p>
            <small className="text-[10px] text-gray-400 uppercase font-bold mt-2 block">
              {formatPostTime(post.createdAt)}
            </small>
          </div>
        </div>
      </div>

      {/* SECTION 2: USER & COMMENTS (Right Side - Fixed 50% on Desktop) */}
      <div className={`
        w-full lg:w-1/2 flex flex-col bg-white h-full
        ${showCommentsMobile ? 'fixed inset-0 z-50' : 'hidden lg:flex'} 
        lg:relative lg:inset-auto
      `}>
        
        {/* User Info Header (Fixed Height: 64px to match left side title) */}
        <div className="p-4 flex items-center justify-between border-b h-16 shrink-0">
          <div className="flex items-center gap-3">
            <img src={post.author.profilepic} className="w-9 h-9 rounded-full object-cover border" alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight">{post.author.username}</span>
              <span className="text-[10px] text-gray-400">Original Poster</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFollowing(!isFollowing)}
              className={`text-xs font-bold w-24 py-2 rounded-lg transition-all ${
                isFollowing ? 'bg-gray-100 text-gray-800' : 'bg-blue-500 text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button onClick={() => setShowCommentsMobile(false)} className="lg:hidden p-1">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Comments List (Fills the remaining height with scroll) */}
        <div className="grow overflow-y-auto p-4 space-y-5 custom-scrollbar">
          {post.comments.map(comment => (
            <div key={comment._id} className="flex gap-3 text-sm group">
              {/* <img src={comment.author.profilepic} className="w-8 h-8 rounded-full shrink-0" alt="" /> */}
              <div className="flex flex-col">
                <p className="text-gray-800">
                  {/* <span className="font-bold mr-2 text-xs">{comment.author.username}</span> */}
                  {comment.text}
                </p>
                <div className="flex gap-3 mt-1 items-center">
                   <span className="text-[10px] text-gray-400">2h</span>
                   <button className="text-[10px] font-bold text-gray-500 hover:text-black">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Comment Input (Fixed at bottom) */}
        <div className="p-4 border-t shrink-0 bg-white">
          <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 focus-within:border-blue-300 transition-colors">
            <input 
              type="text" 
              placeholder="Add a comment..." 
              className="w-full bg-transparent border-none focus:ring-0 text-sm py-2"
            />
            <button className="text-blue-500 font-bold text-sm px-2 hover:text-blue-700 disabled:opacity-50">
              Post
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
 
export default PostLayout