import React from 'react'

const PostImages = () => {
  return (
    <div>PostImages</div>
  )
}

export default PostImages


// export default PostLayout;

// import React, { useState, useRef } from 'react'; // Add useRef
// import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, X } from 'lucide-react';
// import UserSection from './UserSection';
// import Interactions from './Interactions';

// const PostLayout = ({ post }) => {
//     const [isLiked, setIsLiked] = useState(false);
//     const [isSaved, setIsSaved] = useState(false);
//     const [isFollowing, setIsFollowing] = useState(false);
//     const [showCommentsMobile, setShowCommentsMobile] = useState(false);
    
//     // 1. Create the reference
//     const commentInputRef = useRef(null);

//     // 2. Intelligent Click Handler
//     const handleCommentAction = () => {
//         if (window.innerWidth < 1024) {
//             // It's a mobile/tablet: Show the layered view
//             setShowCommentsMobile(true);
//         } else {
//             // It's a laptop/desktop: Just focus the input
//             commentInputRef.current?.focus();
//             setShowCommentsMobile(false);
//         }
//     };

//     return (
//         <article className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-sm lg:h-[650px] relative">
            
//             {/* LEFT SIDE */}
//             <div className="w-full lg:w-[60%] flex flex-col border-r dark:border-gray-800 h-full">
//                 {/* ... (UserSection and Media) */}

//                 <Interactions 
//                     isLiked={isLiked} setIsLiked={setIsLiked} 
//                     isSaved={isSaved} setIsSaved={setIsSaved} 
//                     onCommentClick={handleCommentAction} // Use the new handler
//                 />
                
//                 {/* ... (Caption) */}
//             </div>

//             {/* RIGHT SIDE: Comments */}
//             {/* Logic Fix: only use 'fixed' if showCommentsMobile is true AND we are NOT on lg screens */}
//             <div className={`
//                 w-full lg:w-[40%] flex flex-col h-full bg-white dark:bg-gray-900
//                 ${showCommentsMobile ? 'fixed inset-0 z-[60] lg:relative lg:inset-auto lg:z-0' : 'hidden lg:flex'} 
//                 lg:flex border-l dark:border-gray-800
//             `}>
//                 <UserSection 
//                     author={post.author} 
//                     isFollowing={isFollowing} 
//                     setIsFollowing={setIsFollowing} 
//                     onMobileClose={() => setShowCommentsMobile(false)} 
//                 />

//                 {/* Comments List */}
//                 <div className="grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
//                     {post.comments.map(comment => (
//                         <div key={comment._id} className="flex gap-3 text-sm">
//                             {/* ... comment content */}
//                         </div>
//                     ))}
//                 </div>

//                 {/* Comment Input */}
//                 <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
//                     <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full border dark:border-gray-700 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
//                         <input 
//                             ref={commentInputRef} // 3. Attach the ref here
//                             type="text" 
//                             placeholder="Add a comment..." 
//                             className="w-full bg-transparent border-none focus:ring-0 text-sm dark:text-white"
//                         />
//                         <button className="text-blue-500 font-bold text-sm hover:text-blue-600">Post</button>
//                     </div>
//                 </div>
//             </div>
//         </article>
//     );
// }

// export default PostLayout;