import axiosInstance from "../utils/AxiosInstance.js";

// Feed — followed users articles
export const getArticleFeedAPI = async (page = 1, limit = 10) => {
    const res = await axiosInstance.get(`/stories/feed?page=${page}&limit=${limit}`);
    return res.data;
};

// Current user's articles
export const getMyArticlesAPI = async (page = 1, limit = 10) => {
    const res = await axiosInstance.get(`/stories/mine?page=${page}&limit=${limit}`);
    return res.data;
};

// Single article
export const getArticleByIdAPI = async (storyId) => {
    const res = await axiosInstance.get(`/stories/${storyId}`);
    return res.data;
};

// Create article — FormData (title + content + thumbnail)
export const createArticleAPI = async (formData) => {
    // Let axios/browser set the Content-Type (with boundary) for FormData
    const res = await axiosInstance.post(`/stories`, formData);
    return res.data;
};

// Update article
export const updateArticleAPI = async (storyId, formData) => {
    // Let axios/browser set the Content-Type (with boundary) for FormData
    const res = await axiosInstance.put(`/stories/${storyId}`, formData);
    return res.data;
};

// Delete article
export const deleteArticleAPI = async (storyId) => {
    const res = await axiosInstance.delete(`/stories/${storyId}`);
    return res.data;
};

// ── Interactions ──────────────────────────────────────

export const toggleArticleLikeAPI = async (storyId) => {
    const res = await axiosInstance.post(`/stories/${storyId}/like`);
    return res.data;
};

export const toggleArticleSaveAPI = async (storyId) => {
    const res = await axiosInstance.post(`/stories/${storyId}/save`);
    return res.data;
};

export const getSavedArticlesAPI = async () => {
    const res = await axiosInstance.get('/stories/saved');
    return res.data;
};

// ── Comments ──────────────────────────────────────────

export const getArticleCommentsAPI = async (storyId) => {
    const res = await axiosInstance.get(`/stories/${storyId}/comments`);
    return res.data;
};

export const addArticleCommentAPI = async (storyId, content) => {
    const res = await axiosInstance.post(`/stories/${storyId}/comment`, { content });
    return res.data;
};

export const deleteArticleCommentAPI = async (storyId, commentId) => {
    const res = await axiosInstance.delete(`/stories/${storyId}/comment/${commentId}`);
    return res.data;
};

export const getUserArticlesAPI = async (userId) => {
    const res = await axiosInstance.get(`/stories/user/${userId}`);
    return res.data;
};
