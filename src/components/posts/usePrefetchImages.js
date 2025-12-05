//helper hook for next/previous post preloading
/**
 * usePrefetchImages.js

Handles:

Preload next post images

Preload previous post images

Triggered automatically on scroll
 */
import { useEffect } from "react";
import { preloadImages } from "../../utils/preLoadImage";

export default function usePrefetchImages(posts, currentIndex) {
  useEffect(() => {
    if (!posts.length) return;

    const next = posts[currentIndex + 1];
    const prev = posts[currentIndex - 1];

    if (next?.images) preloadImages(next.images.map((i) => i.url));
    if (prev?.images) preloadImages(prev.images.map((i) => i.url));
  }, [currentIndex, posts]);
}
