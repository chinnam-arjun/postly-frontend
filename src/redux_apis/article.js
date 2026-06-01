import axiosInstance from "../utils/AxiosInstance.js";

// Feed — followed users articles
export const getArticleFeedAPI = async (page = 1, limit = 10) => {
    const res = await axiosInstance.get(`/stories/feed?page=${page}&limit=${limit}`);
    return res.data;
};

// Single article
export const getArticleByIdAPI = async (storyId) => {
    const res = await axiosInstance.get(`/stories/${storyId}`);
    return res.data;
};

// Create article — FormData (title + content + thumbnail)
export const createArticleAPI = async (formData) => {
    const res = await axiosInstance.post(`/stories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// Update article
export const updateArticleAPI = async (storyId, formData) => {
    const res = await axiosInstance.put(`/stories/${storyId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// Delete article
export const deleteArticleAPI = async (storyId) => {
    const res = await axiosInstance.delete(`/stories/${storyId}`);
    return res.data;
};