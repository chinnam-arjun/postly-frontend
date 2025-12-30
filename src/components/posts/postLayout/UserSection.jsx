import React from 'react';
import { X } from 'lucide-react';

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
export default UserSection;