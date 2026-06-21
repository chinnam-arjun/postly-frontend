import axiosInstance from "../utils/AxiosInstance";

export const getAllPosts = async () => {
    return await axiosInstance.get("/posts/", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
};

export const getSpecificUserPosts = async (userId) => {
    return await axiosInstance.get(`/posts/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
};

export const getMyPosts = async () => {
    return await axiosInstance.get("/posts/my", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
};

export const addPost = async (formData) => {
    return await axiosInstance.post("/posts/", formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
        }
    });
};

export const editPost = async (postId, formData) => {
    return await axiosInstance.put(`/posts/${postId}`, formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
        }
    });
};

export const deletePost = async (postId) => {
    return await axiosInstance.delete(`/posts/${postId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
};

export const toggleLikePost = async (postId) => {
    return await axiosInstance.put(`/posts/${postId}/like`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
};

export const toggleSavePost = async (postId) => {
    return await axiosInstance.put(`/posts/${postId}/save`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
};