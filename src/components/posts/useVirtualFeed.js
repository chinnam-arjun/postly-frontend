import { useState, useCallback } from "react";

export default function useVirtualFeed(posts) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, posts.length - 1));
  }, [posts.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const virtualPosts = [
    posts[currentIndex - 1] || null,
    posts[currentIndex],
    posts[currentIndex + 1] || null,
  ];

  return {
    currentIndex,
    setCurrentIndex,
    virtualPosts,
    goNext,
    goPrev,
  };
}
