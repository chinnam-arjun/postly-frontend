import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import PostLayout from './PostLayout/PostLayout';
import { usePosts } from '../../hooks/usePosts';

const Feed = () => {
    const [activeTab, setActiveTab] = useState('for-you');
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading,  } = usePosts(activeTab);
    const { ref, inView } = useInView({ rootMargin: '600px' });

    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage();
    }, [inView, hasNextPage, fetchNextPage]);

    return (
        <div className="w-full min-h-screen bg-gray-950">
            {/* --- FIXED STICKY HEADER --- */}
            <header className="sticky top-0 z-40 w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Feed</h1>
                    
                    <div className="inline-flex p-1 bg-gray-900 rounded-lg border border-gray-800">
                        {['for-you', 'following'].map((tab) => (
                            <button 
                                key={tab}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                    activeTab === tab 
                                    ? 'bg-gray-800 text-purple-400 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-300'
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
                            <div key={n} className="h-[500px] bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
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