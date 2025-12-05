import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddPost() {
  const [step, setStep] = useState(1);

  // Post fields
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);

  // Tag selection
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");

  const predefinedTags = [
    "tech",
    "coding",
    "nature",
    "travel",
    "food",
    "fitness",
    "blog",
    "education",
    "art",
    "life",
  ];

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      alert("You can upload a maximum of 5 images");
      return;
    }

    const fileURLs = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...fileURLs]);
  };

  // Remove image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Toggle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 3) {
        alert("You can select a maximum of 3 tags!");
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Add custom tag
  const addCustomTag = () => {
    if (!customTag.trim()) return;
    if (selectedTags.length >= 3) {
      alert("Maximum 3 tags allowed");
      return;
    }

    setSelectedTags([...selectedTags, customTag.trim()]);
    setCustomTag("");
  };

  // Final Submit
  const submitPost = () => {
    if (!title || !caption || images.length === 0) {
      alert("Fill all fields and upload at least one image!");
      return;
    }
    alert("Post submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-7"
      >
        {/* ===================== STEP 1 - ADD POST ===================== */}
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Create New Post
              </h2>

              {/* Title */}
              <label className="font-medium text-gray-700">
                Title
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter post title..."
                />
              </label>

              {/* Caption */}
              <label className="font-medium text-gray-700 mt-4 block">
                Caption
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full mt-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows="4"
                  placeholder="Write something..."
                />
              </label>

              {/* Image Upload */}
              <div className="mt-5">
                <label className="font-medium text-gray-700">
                  Upload Images (1–5)
                </label>

                <div className="mt-2 flex flex-wrap gap-4">
                  {/* Upload Button */}
                  {images.length < 5 && (
                    <label className="w-28 h-28 border-2 border-dashed border-gray-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 transition">
                      <span className="text-3xl text-gray-500">＋</span>
                      <span className="text-sm text-gray-500">Add</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}

                  {/* Image Previews */}
                  {images.map((img, i) => (
                    <div key={i} className="relative w-28 h-28">
                      <img
                        src={img.url}
                        className="w-full h-full rounded-xl object-cover shadow-md"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 text-sm flex items-center justify-center shadow-lg"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* NEXT BUTTON */}
              <button
                onClick={() => setStep(2)}
                disabled={!title || !caption || images.length === 0}
                className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300"
              >
                Next →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================== STEP 2 - TAG SELECTION ===================== */}
        <AnimatePresence>
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Choose Tags
              </h2>
              <p className="text-gray-600 mb-4">Select up to 3 tags</p>

              {/* Tag list */}
              <div className="flex flex-wrap gap-3 mb-5">
                {predefinedTags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full border text-sm transition ${
                      selectedTags.includes(tag)
                        ? "bg-blue-600 text-white border-blue-700"
                        : "border-gray-400 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* Custom Tag Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add custom tag..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                />
                <button
                  onClick={addCustomTag}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
              </div>

              {/* Selected Tags */}
              <div className="mt-5 flex gap-3 flex-wrap">
                {selectedTags.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="text-red-500 font-bold"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              {/* BUTTONS */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2 border rounded-lg hover:bg-gray-100"
                >
                  ← Back
                </button>

                <button
                  onClick={submitPost}
                  disabled={selectedTags.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Post
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
