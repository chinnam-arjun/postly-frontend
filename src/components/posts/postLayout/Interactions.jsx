import React from 'react';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';

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

export default Interactions;