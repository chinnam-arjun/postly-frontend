// import axiosInstance from '../utils/AxiosInstance';

// export const addPost = (formData) => {
//     axiosInstance.post("/posts/", formData);
// }

// export const deletePost = (postId)=> {
//     axiosInstance.delete("/posts/:postId");
// }

// export const editPost = (postId,formData) => {
//     axiosInstance.put("/posts/:postId",formData);
// }

// export const getAllPosts = () => {
//     axiosInstance.get("/posts/");
// }

// export const getSpecificUserPosts = (userId) => {
//     axiosInstance.get("/posts/user/:userId");
// }

// export const getMyPosts = () => {
//     axiosInstance.get("/posts/my");
// }

// //need  to add
// export const getSpecificPost = (postId) =>{
//     axiosInstance.get("/posts/:postId");
// }

import axiosInstance from "../utils/AxiosInstance";

export const getAllPosts =async () => {
    return await axiosInstance.get("/posts/",{
        headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    // console.log(" fetched posts ", res.data.posts);
    // return res.data.posts;
}

export const getSpecificUserPosts = async(userId)=>{
    return await axiosInstance.get(`/posts/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
}

export const getMyPosts = async ()=> {
    return await axiosInstance.get("/posts/my", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
}

export const addPost = async (formData) => {
    return await axiosInstance.post("/posts/", formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
}

export const editPost = async (postId,formData) => {
    return await axiosInstance.put(`/posts/${postId}`, formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
}

export const deletePost = async (postId) => {
    return await axiosInstance.delete(`/posts/${postId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
}