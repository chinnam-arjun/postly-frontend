//main feed wrapper (tracks currentIndex)

/**
 * Feed.jsx

Controls the full-screen vertical scrolling

Handles which post is active (currentIndex)

Calls useVirtualPosts to only render 3 posts

Triggers usePrefetchImages to preload next/prev images

Controls snap scrolling behavior
 */
// Feed.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { posts as staticPosts } from "../../data/posts";

import useVirtualFeed from "./useVirtualFeed";
import usePrefetchImages from "./usePrefetchImages";
import PostLayout from "./PostLayout";

export default function Feed() {
  const {
    currentIndex,
    setCurrentIndex,
    virtualPosts,
    goNext,
    goPrev,
  } = useVirtualFeed(staticPosts);

  // Prefetch next/prev images
  usePrefetchImages(staticPosts, currentIndex);

  // Handle scroll (wheel)
  const handleWheel = (e) => {
    if (e.deltaY > 0) goNext();
    else goPrev();
  };

  // Handle touch
  let startY = 0;

  const handleTouchStart = (e) => {
    startY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;

    if (startY - endY > 50) goNext();
    else if (endY - startY > 50) goPrev();
  };

  return (
    <div
      className="w-full h-screen overflow-hidden bg-black"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-full">
        {virtualPosts.map((post, i) =>
          post ? (
            <motion.div
              key={post._id}
              className={`absolute w-full h-full top-0`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              style={{ transform: `translateY(${(i - 1) * 100}%)` }}
            >
              <PostLayout
                post={post}
                index={currentIndex + (i - 1)}
                totalPosts={staticPosts.length}
              />
            </motion.div>
          ) : null
        )}
      </div>
    </div>
  );
}
