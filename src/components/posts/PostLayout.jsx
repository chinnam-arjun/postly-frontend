//renders each single post (5 images, title, caption)
/**
 * PostLayout.jsx

Shows title, caption, all images (1–5)

Uses <PostImageLazy /> for each image

Handles framer-motion animations for entry/exit
 * 
 */

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Heart,
//   MessageCircle,
//   Send,
//   Bookmark,
//   MoreHorizontal,
// } from "lucide-react";

// export default function PostLayout({ post }) {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [showFullCaption, setShowFullCaption] = useState(false);

//   const nextImage = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % post.images.length);
//   };

//   const prevImage = () => {
//     setCurrentImageIndex(
//       (prevIndex) => (prevIndex - 1 + post.images.length) % post.images.length
//     );
//   };

//   return (
//     <div className="bg-white border rounded-lg shadow-md max-w-xl mx-auto my-4">
//       {/* Post Header */}
//       <div className="flex items-center justify-between p-4">
//         <div className="flex items-center">
//           <img
//             src={post.profilePic}
//             alt="Profile"
//             className="w-10 h-10 rounded-full object-cover border p-0.5"
//           />
//           <div className="ml-3">
//             <p className="text-sm font-semibold">{post.username}</p>
//             <p className="text-xs text-gray-500">{post.location}</p>
//           </div>
//         </div>
//         <MoreHorizontal className="w-5 h-5 text-gray-600 cursor-pointer" />
//       </div>

//       {/* Post Image Carousel */}
//       <div className="relative bg-black">
//         <img
//           src={post.images[currentImageIndex]}
//           alt="Post"
//           className="w-full max-h-[600px] object-contain"
//         />
//         {post.images.length > 1 && (
//           <>
//             <button
//               onClick={prevImage}
//               className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1"
//             >
//               &#10094;
//             </button>
//             <button
//               onClick={nextImage}
//               className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1"
//             >
//               &#10095;
//             </button>
//           </>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-between items-center p-4">
//         <div className="flex space-x-4">
//           <Heart className="w-6 h-6 cursor-pointer hover:text-red-500" />
//           <MessageCircle className="w-6 h-6 cursor-pointer hover:text-gray-500" />
//           <Send className="w-6 h-6 cursor-pointer hover:text-gray-500" />
//         </div>
//         <Bookmark className="w-6 h-6 cursor-pointer hover:text-gray-500" />
//       </div>

//       {/* Likes */}
//       <div className="px-4">
//         <p className="text-sm font-semibold">{post.likes} likes</p>
//       </div>

//       {/* Caption */}
//       <div className="px-4 py-2">
//         <p className="text-sm">
//           <span className="font-semibold">{post.username}</span>{" "}
//           {showFullCaption
//             ? post.caption
//             : `${post.caption.substring(0, 100)}...`}
//           {!showFullCaption && (
//             <button
//               onClick={() => setShowFullCaption(true)}
//               className="text-gray-500 text-sm ml-1"
//             >
//               more
//             </button>
//           )}
//         </p>
//       </div>

//       {/* Comments */}
//       <div className="px-4 py-2">
//         {post.comments.slice(0, 2).map((comment, index) => (
//           <p key={index} className="text-sm">
//             <span className="font-semibold">{comment.username}</span>{" "}
//             {comment.text}
//           </p>
//         ))}
//         {post.comments.length > 2 && (
//           <p className="text-gray-500 text-sm cursor-pointer">
//             View all {post.comments.length} comments
//           </p>
//         )}
//       </div>

//       {/* Add Comment */}
//       <div className="border-t p-4">
//         <div className="flex">
//           <input
//             type="text"
//             placeholder="Add a comment..."
//             className="w-full outline-none bg-transparent text-sm"
//           />
//           <button className="text-blue-500 font-semibold text-sm">Post</button>
//         </div>
//       </div>
      
//       {/* Timestamp */}
//       <div className="px-4 pb-2">
//         <p className="text-gray-400 text-xs uppercase">{post.timestamp}</p>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { motion } from "framer-motion";
import PostImageLazy from "./PostImageLazy";

export default function PostLayout({ post }) {
  const { author, title, caption, images, tags, likesCount, commentsCount } = post;

  return (
    <motion.div
      className="w-full h-full flex flex-col px-4 py-6 border-b border-gray-800 overflow-y-auto"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="w-full flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
          {author.username[0].toUpperCase()}
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">{author.username}</h3>
          <span className="text-gray-400 text-sm">@bloguser</span>
        </div>
      </div>

      <h2 className="text-white text-xl font-bold mb-2">{title}</h2>

      <p className="text-gray-300 mb-4">{caption}</p>

      <div className="w-full overflow-x-auto flex gap-4 scrollbar-hide snap-x snap-mandatory">
        {images.map((img, i) => (
          <div key={i} className="min-w-full snap-center">
            <PostImageLazy src={img.url} />
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        {tags?.map((tag, i) => (
          <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between mt-5 text-gray-400">
        <span>❤️ {likesCount}</span>
        <span>💬 {commentsCount}</span>
      </div>
    </motion.div>
  );
}
/**
 *
  export default function PostLayout({ post }) {
  return (
    <div className="w-full h-screen flex flex-col snap-start overflow-hidden">

      
      <div className="p-4">
        <h1 className="text-xl font-bold">{post.title}</h1>
        <p className="text-gray-300">{post.caption}</p>
      </div>

    
      <div className="flex-1 overflow-hidden">
        <ImageCarousel images={post.images} />
      </div>

      
      <div className="p-4">
        <PostFooter post={post} />
      </div>

    </div>
  );
}

 */