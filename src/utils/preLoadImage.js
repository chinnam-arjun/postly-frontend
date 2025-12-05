// pure function to preload next post images
export const preloadImages = (urls = []) => {
  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};
