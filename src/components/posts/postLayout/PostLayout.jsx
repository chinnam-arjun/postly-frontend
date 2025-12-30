import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, X } from 'lucide-react';
import UserSection from './UserSection';
import Interactions from './Interactions';
// --- SUB-COMPONENT: USER SECTION ---
// const UserSection = ({ author, isFollowing, setIsFollowing, onMobileClose }) => (
//     <div className="p-4 flex items-center justify-between border-b dark:border-gray-800 h-16 shrink-0 bg-white dark:bg-gray-900">
//         <div className="flex items-center gap-3">
//             <img src={author.profilepic} className="w-9 h-9 rounded-full object-cover border border-gray-100" alt={author.username} />
//             <div className="flex flex-col">
//                 <span className="font-bold text-sm dark:text-white tracking-tight">{author.username}</span>
//                 <span className="text-[10px] text-gray-400">Original Poster</span>
//             </div>
//         </div>
//         <div className="flex items-center gap-2">
//             <button 
//                 onClick={() => setIsFollowing(!isFollowing)}
//                 className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${
//                     isFollowing ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white hover:bg-blue-700'
//                 }`}
//             >
//                 {isFollowing ? 'Following' : 'Follow'}
//             </button>
//             {onMobileClose && <X className="lg:hidden cursor-pointer dark:text-white" onClick={onMobileClose} />}
//         </div>
//     </div>
// );

// --- SUB-COMPONENT: INTERACTIONS ---
// const Interactions = ({ isLiked, setIsLiked, isSaved, setIsSaved, onCommentClick }) => (
//     <div className="p-4 flex items-center justify-between bg-white dark:bg-gray-900">
//         <div className="flex items-center gap-5">
//             <Heart 
//                 onClick={() => setIsLiked(!isLiked)}
//                 className={`cursor-pointer transition-transform active:scale-150 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-300'}`} 
//                 size={24} 
//             />
//             <MessageCircle 
//                 onClick={onCommentClick}
//                 className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-500" 
//                 size={24} 
//             />
//             <Share2 className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-green-500" size={22} />
//         </div>
//         <Bookmark 
//             onClick={() => setIsSaved(!isSaved)}
//             className={`cursor-pointer ${isSaved ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600 dark:text-gray-300'}`} 
//             size={24} 
//         />
//     </div>
// );

const PostLayout = ({ post }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const [showCommentsMobile, setShowCommentsMobile] = useState(false);
    // const [commentText, setCommentText] = useState("");
    // const [replyTo, setReplyTo] = useState(null); // Stores { username, commentId }
    const commentInputRef = useRef(null);

    const handleCommentAction = ()=>{
        if (window.innerWidth < 1024) {
            setShowCommentsMobile(true);
           
        }
        else{
            commentInputRef.current?.focus();
            setShowCommentsMobile(false);
        }
    }


    // const currentUserId = "694fe1d21cf5ec903185730e";

    // const handleReplyClick = (username, commentId) => {
    //     setReplyTo({ username, commentId });
    //     setCommentText(`@${username} `); // Add the mention to the input
    //     commentInputRef.current?.focus();
    // };

    // const handlePostComment = () => {
    //     // Logic to send to backend
    //     console.log("Posting:", commentText, "Reply to ID:", replyTo?.commentId);
    //     setCommentText("");
    //     setReplyTo(null);
    // };


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
                    <img src={post.images} alt="Post content" className="w-full h-full object-contain" />
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
                ${showCommentsMobile ? 'fixed inset-0 z-[60] lg:relative lg:inset-auto lg:z-0' : 'hidden lg:flex'} 
                lg:flex border-l dark:border-gray-800
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

                <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full border dark:border-gray-700">
                        <input 
                            ref={commentInputRef} // 3. Attach the ref here
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