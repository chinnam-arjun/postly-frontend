//handles lazy-loading + animation of each image
/**
 * PostImageLazy.jsx

Responsible for:

Intersection observer

Lazy loading

Fade + scale animation

Placeholder
 */

// src/components/PostImageLazy.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const placeholderStyle = {
  width: "100%",
  height: "100%",
  background: "rgba(255,255,255,0.1)",
  borderRadius: "10px",
};

const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "10px",
};

export default function PostImageLazy({ src, alt = "post image", className = "" }) {
  const imgRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false); // When it enters viewport
  const [isLoaded, setIsLoaded] = useState(false);   // When actual image loads

  useEffect(() => {
    const element = imgRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={`w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden ${className}`}
    >

      {/* Placeholder until visible or loaded */}
      {!isLoaded && (
        <motion.div
          style={placeholderStyle}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        />
      )}

      {/* Lazy-loaded image */}
      {isVisible && (
        <motion.img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={imgStyle}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        />
      )}

    </div>
  );
}
