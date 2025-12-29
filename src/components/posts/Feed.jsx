// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import PostLayout from './PostLayout/PostLayout';

// const Feed = () => {
//     const [posts, setPosts] = useState([]);
//     const [activeTab, setActiveTab] = useState('for-you'); // 'for-you' or 'following'
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // This function runs every time activeTab changes
//     const fetchFeedData = async (type) => {
//         setLoading(true);
//         setError(null);
//         try {
//             // Updated URL to use the /api/feed prefix to avoid the CastError
//             const response = await axios.get(`http://localhost:5000/feed/${type}`, {
//                 withCredentials: true,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NGZlMWQyMWNmNWVjOTAzMTg1NzMwZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY2ODQyODM1LCJleHAiOjE3Njc0NDc2MzV9.9bZm-cpmuHHs4lMKr-Sw_HqajsdK15WwL7DXOap0KLc`                   
//                 }//Authorization token should be dynamic based on logged in user
//             });
            
//             if (response.data.success) {
//                 setPosts(response.data.posts);
//             }
//         } catch (err) {
//             // console.error("Feed fetch error:", err);
//             // setError("Could not load posts. Please try again later.");
//             console.error("Feed fetch error status:", err.response?.status);
//     console.error("Feed fetch error data:", err.response?.data);
//     setError(err.response?.data?.message || "Could not load posts. Please try again later.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchFeedData(activeTab);
//     }, [activeTab]);

//     return (
//         <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 md:px-8 lg:px-12 py-6">
//             {/* --- Container --- */}
//             <div className="max-w-[1400px] mx-auto">                
//                 {/* --- Header & Tabs --- */}
//                 <div className="flex flex-col md:flex-row md:items-center justify-between ">
//                     <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Feed</h1>
                    
//                     <div className="inline-flex p-1 bg-gray-200 dark:bg-gray-800 rounded-xl">
//                         <button 
//                             className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
//                                 activeTab === 'for-you' 
//                                 ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' 
//                                 : 'text-gray-500 hover:text-gray-700'
//                             }`}
//                             onClick={() => setActiveTab('for-you')}
//                         >
//                             For You
//                         </button>
//                         <button 
//                             className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
//                                 activeTab === 'following' 
//                                 ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' 
//                                 : 'text-gray-500 hover:text-gray-700'
//                             }`}
//                             onClick={() => setActiveTab('following')}
//                         >
//                             Following
//                         </button>
//                     </div>
//                 </div>
//                 {/* --- Status Messages --- */}
//                 {loading && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {[1, 2, 3, 4, 5, 6].map((n) => (
//                             <div key={n} className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
//                         ))}
//                     </div>
//                 )}
//                 {error && (
//                     <div className="max-w-md mx-auto p-4 bg-red-100 text-red-700 rounded-lg text-center">
//                         {error}
//                     </div>
//                 )}
//                 {/* --- Posts Grid --- */}
//                 {!loading && !error && (
//                     <div className="posts-container">
//                         {posts.length > 0 ? (
//                             posts.map((post) => (
//                                 <PostLayout key={post._id} post={post} />
//                             ))
//                         ) : (
//                             <p className="no-posts">No posts found in this feed.</p>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );

//   }
// ;

// export default Feed;


import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import PostLayout from './PostLayout/PostLayout';
import { usePosts } from '../../hooks/usePosts';

const Feed = () => {
    const [activeTab, setActiveTab] = useState('for-you');
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = usePosts(activeTab);
    const { ref, inView } = useInView({ rootMargin: '600px' });

    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage();
    }, [inView, hasNextPage]);

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* --- FIXED STICKY HEADER --- */}
            <header className="sticky top-14
             z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Feed</h1>
                    
                    <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {['for-you', 'following'].map((tab) => (
                            <button 
                                key={tab}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                    activeTab === tab 
                                    ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'for-you' ? 'For You' : 'Following'}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto p-4 lg:p-8">
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
                        {[1, 2].map((n) => (
                            <div key={n} className="h-[500px] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                        {data?.pages.map((page, i) => (
                            <React.Fragment key={i}>
                                {page.posts?.map((post) => (
                                    <PostLayout key={post._id} post={post} />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                {/* Observer Trigger */}
                <div ref={ref} className="py-10 flex justify-center">
                    {isFetchingNextPage && <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                    {!hasNextPage && <p className="text-gray-400 text-sm italic">You've reached the end of the universe.</p>}
                </div>
            </main>
        </div>
    );
};

export default Feed;