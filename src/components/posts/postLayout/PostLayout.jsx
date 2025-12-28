// import React, { useState } from 'react'
// import PostImages from './PostImages'

// // import {Heart,MessageCircle,Save} from 'lucide-react'
// import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal,X } from 'lucide-react';
// const PostLayout = ({ post }) => {
//   const [isLiked, setIsLiked] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [showCommentsMobile, setShowCommentsMobile] = useState(false);
//   function formatPostTime(createdAt) {
//     const createdDate = new Date(createdAt);
//     const now = new Date();

//     const diffMs = now - createdDate;
//     const diffSeconds = Math.floor(diffMs / 1000);
//     const diffMinutes = Math.floor(diffSeconds / 60);
//     const diffHours = Math.floor(diffMinutes / 60);
//     const diffDays = Math.floor(diffHours / 24);

//     // If more than 24 hours, return formatted date
//     if (diffHours >= 24) {
//       return createdDate.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     }

//     // Less than 24 hours
//     if (diffHours > 0) {
//       return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
//     }

//     if (diffMinutes > 0) {
//       return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
//     }

//     return `${diffSeconds} second${diffSeconds > 1 ? 's' : ''} ago`;
//   }

//   return (
//     <article className="max-w-screen mx-auto my-6 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-sm lg:h-[700px]">
      
//       {/* SECTION 1: CONTENT (Left Side - Fixed 50% on Desktop) */}
//       <div className="w-full lg:w-1/2 flex flex-col border-r border-gray-100 bg-black h-full">
//         {/* Top: Title (Fixed Height) */}
//         <div className="p-4 border-b bg-white h-16 flex items-center justify-between">
//           <h2 className="text-md font-bold text-gray-800 truncate pr-4">{post.title}</h2>
//           <MoreHorizontal className="text-gray-400 cursor-pointer" size={20} />
//         </div>

//         {/* Middle: Image Container (Fixed Height/Ratio) */}
//         {/* 'flex-grow' ensures this fills the space between header and footer */}
//         <div className="relative grow bg-black flex items-center justify-center overflow-hidden">
//           <img 
//             src={post.images[0]} 
//             alt="Post content" 
//             className="w-full h-full object-contain" 
//           />
//         </div>

//         {/* Caption, Date & Actions (Fixed Bottom Area) */}
//         <div className="bg-white border-t border-gray-50">
//            {/* Actions Row */}
//            <div className="p-4 flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button onClick={() => setIsLiked(!isLiked)} className={`transition-all active:scale-125 ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}>
//                 <Heart fill={isLiked ? "currentColor" : "none"} size={24} />
//               </button>
//               <button onClick={() => setShowCommentsMobile(true)} className="text-gray-600 hover:text-blue-500 lg:hidden">
//                 <MessageCircle size={24} />
//               </button>
//               <button className="text-gray-600 hover:text-green-500"><Share2 size={22} /></button>
//             </div>
//             <button onClick={() => setIsSaved(!isSaved)} className={isSaved ? 'text-yellow-500' : 'text-gray-600'}>
//               <Bookmark fill={isSaved ? "currentColor" : "none"} size={24} />
//             </button>
//           </div>

//           {/* Caption Area (Scrollable if too long to prevent layout jump) */}
//           <div className="px-4 pb-4 max-h-32 overflow-y-auto">
//             <p className="text-sm font-semibold mb-1">{isLiked ? post.likesCount + 1 : post.likesCount} likes</p>
//             <p className="text-gray-700 text-sm leading-relaxed">
//               <span className="font-bold mr-2">{post.author.username}</span>
//               {post.caption}
//             </p>
//             <small className="text-[10px] text-gray-400 uppercase font-bold mt-2 block">
//               {formatPostTime(post.createdAt)}
//             </small>
//           </div>
//         </div>
//       </div>

//       {/* SECTION 2: USER & COMMENTS (Right Side - Fixed 50% on Desktop) */}
//       <div className={`
//         w-full lg:w-1/2 flex flex-col bg-white h-full
//         ${showCommentsMobile ? 'fixed inset-0 z-50' : 'hidden lg:flex'} 
//         lg:relative lg:inset-auto
//       `}>
        
//         {/* User Info Header (Fixed Height: 64px to match left side title) */}
//         <div className="p-4 flex items-center justify-between border-b h-16 shrink-0">
//           <div className="flex items-center gap-3">
//             <img src={post.author.profilepic} className="w-9 h-9 rounded-full object-cover border" alt="" />
//             <div className="flex flex-col">
//               <span className="font-bold text-sm tracking-tight">{post.author.username}</span>
//               <span className="text-[10px] text-gray-400">Original Poster</span>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <button 
//               onClick={() => setIsFollowing(!isFollowing)}
//               className={`text-xs font-bold w-24 py-2 rounded-lg transition-all ${
//                 isFollowing ? 'bg-gray-100 text-gray-800' : 'bg-blue-500 text-white'
//               }`}
//             >
//               {isFollowing ? 'Following' : 'Follow'}
//             </button>
//             <button onClick={() => setShowCommentsMobile(false)} className="lg:hidden p-1">
//               <X size={24} />
//             </button>
//           </div>
//         </div>

//         {/* Comments List (Fills the remaining height with scroll) */}
//         <div className="grow overflow-y-auto p-4 space-y-5 custom-scrollbar">
//           {post.comments.map(comment => (
//             <div key={comment._id} className="flex gap-3 text-sm group">
//               {/* <img src={comment.author.profilepic} className="w-8 h-8 rounded-full shrink-0" alt="" /> */}
//               <div className="flex flex-col">
//                 <p className="text-gray-800">
//                   {/* <span className="font-bold mr-2 text-xs">{comment.author.username}</span> */}
//                   {comment.text}
//                 </p>
//                 <div className="flex gap-3 mt-1 items-center">
//                    <span className="text-[10px] text-gray-400">2h</span>
//                    <button className="text-[10px] font-bold text-gray-500 hover:text-black">Reply</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Add Comment Input (Fixed at bottom) */}
//         <div className="p-4 border-t shrink-0 bg-white">
//           <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 focus-within:border-blue-300 transition-colors">
//             <input 
//               type="text" 
//               placeholder="Add a comment..." 
//               className="w-full bg-transparent border-none focus:ring-0 text-sm py-2"
//             />
//             <button className="text-blue-500 font-bold text-sm px-2 hover:text-blue-700 disabled:opacity-50">
//               Post
//             </button>
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }
 
// export default PostLayout




import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, X } from 'lucide-react';

// --- SUB-COMPONENT: USER SECTION ---
const UserSection = ({ author, isFollowing, setIsFollowing, onMobileClose }) => (
    <div className="p-4 flex items-center justify-between border-b dark:border-gray-800 h-16 shrink-0 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
            <img src={author.profilepic} className="w-9 h-9 rounded-full object-cover border border-gray-100" alt={author.username} />
            <div className="flex flex-col">
                <span className="font-bold text-sm dark:text-white tracking-tight">{author.username}</span>
                <span className="text-[10px] text-gray-400">Original Poster</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${
                    isFollowing ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                {isFollowing ? 'Following' : 'Follow'}
            </button>
            {onMobileClose && <X className="lg:hidden cursor-pointer dark:text-white" onClick={onMobileClose} />}
        </div>
    </div>
);

// --- SUB-COMPONENT: INTERACTIONS ---
const Interactions = ({ isLiked, setIsLiked, isSaved, setIsSaved, onCommentClick }) => (
    <div className="p-4 flex items-center justify-between bg-white dark:bg-gray-900">
        <div className="flex items-center gap-5">
            <Heart 
                onClick={() => setIsLiked(!isLiked)}
                className={`cursor-pointer transition-transform active:scale-150 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-300'}`} 
                size={24} 
            />
            <MessageCircle 
                onClick={onCommentClick}
                className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-500" 
                size={24} 
            />
            <Share2 className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-green-500" size={22} />
        </div>
        <Bookmark 
            onClick={() => setIsSaved(!isSaved)}
            className={`cursor-pointer ${isSaved ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600 dark:text-gray-300'}`} 
            size={24} 
        />
    </div>
);

const PostLayout = ({ post }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showCommentsMobile, setShowCommentsMobile] = useState(false);

    return (
        <article className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-sm lg:h-[650px]">
            
            {/* LEFT SIDE: Media & Main Info */}
            <div className="w-full lg:w-[60%] flex flex-col border-r dark:border-gray-800 h-full">
                {/* Mobile-only User Header */}
                <div className="lg:hidden">
                    <UserSection author={post.author} isFollowing={isFollowing} setIsFollowing={setIsFollowing} />
                </div>

                {/* Title (Desktop Only) */}
                <div className="hidden lg:flex p-4 border-b dark:border-gray-800 h-16 items-center justify-between">
                    <h2 className="text-sm font-bold text-gray-800 dark:text-white truncate">{post.title}</h2>
                    <MoreHorizontal className="text-gray-400" size={18} />
                </div>

                {/* Media Container */}
                <div className="relative aspect-square lg:aspect-auto lg:grow bg-black flex items-center justify-center">
                    <img src={post.images[0]} alt="Post content" className="w-full h-full object-contain" />
                </div>

                {/* Interaction Bar (Mobile Friendly) */}
                <Interactions 
                    isLiked={isLiked} setIsLiked={setIsLiked} 
                    isSaved={isSaved} setIsSaved={setIsSaved} 
                    onCommentClick={() => setShowCommentsMobile(true)}
                />

                {/* Caption Area */}
                <div className="px-4 pb-4">
                    <p className="text-sm font-bold dark:text-white mb-1">{isLiked ? post.likesCount + 1 : post.likesCount} likes</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 lg:line-clamp-none">
                        <span className="font-bold mr-2">{post.author.username}</span>
                        {post.caption}
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: Comments (Hidden on mobile unless clicked) */}
            <div className={`
                w-full lg:w-[40%] flex flex-col h-full bg-white dark:bg-gray-900
                ${showCommentsMobile ? 'fixed inset-0 z-[60]' : 'hidden lg:flex'} 
                lg:relative
            `}>
                <UserSection 
                    author={post.author} 
                    isFollowing={isFollowing} 
                    setIsFollowing={setIsFollowing} 
                    onMobileClose={() => setShowCommentsMobile(false)} 
                />

                <div className="grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {post.comments.map(comment => (
                        <div key={comment._id} className="flex gap-3 text-sm">
                            <div className="flex flex-col">
                                <p className="dark:text-gray-200">
                                    <span className="font-bold mr-2 text-xs">{post.author.username}</span>
                                    {comment.text}
                                </p>
                                <span className="text-[10px] text-gray-400 mt-1">2h • Reply</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comment Input */}
                <div className="p-4 border-t dark:border-gray-800">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full border dark:border-gray-700">
                        <input 
                            type="text" 
                            placeholder="Add a comment..." 
                            className="w-full bg-transparent border-none focus:ring-0 text-sm dark:text-white"
                        />
                        <button className="text-blue-500 font-bold text-sm">Post</button>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default PostLayout;