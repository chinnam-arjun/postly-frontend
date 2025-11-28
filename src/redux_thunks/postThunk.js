// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { addPost, deletePost, editPost, getAllPosts, getMyPosts, getSpecificPost, getSpecificUserPosts } from "../redux_apis/post";
// import { register } from "swiper/element";

// export const addPostThunk = createAsyncThunk("posts/", async (formData)=>{
//     const res = await addPost(formData);
//     const data = res.data;
//     return data;
// })

// export const deletepostThunk = createAsyncThunk("posts/:postId", async (postId)=>{
//     const res = await deletePost(postId);
//     const data  = res.data;
//     return data;
// })

// export const editPostThunk = createAsyncThunk("posts/:postId", async (postId, formData)=>{
//     const res = await editPost(postId, formData);
//     const data = res.data;
//     return data;
// })

// export const getSpecificUserPostsThunk = createAsyncThunk("posts/user/:userId", async (userId) => {
//     const res = await getSpecificUserPosts(userId);
//     const data = res.data;
//     return data;
// })

// export const getAllPostThunk = createAsyncThunk("posts", async () => {
//     const res = await getAllPosts();
//     const data = res.data;
//     return data;
// })

// export const getMyPostsThunk = createAsyncThunk("posts/my", async () => {
//     const res = await getMyPosts();
//     const data = res.data;
//     return data;
// })

// //need to implement
// export const getSpecificPost = createAsyncThunk("[posts/:postId", async (postId)=>{
//     const res = await getSpecificPost(postId);
//     const data = res.data;
//     return data;
// })

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPosts,getSpecificUserPosts, getMyPosts } from "../redux_apis/post";

export const getAllPostsThunk = createAsyncThunk(
    "posts/",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAllPosts();
            return res.data.posts;//its the response structure 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to get posts")
        }
    }
)

export const getSpecificUserPostsThunk = createAsyncThunk(
    "posts/user/:userId",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await getSpecificUserPosts(userId);
            return res.data.posts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to get posts")
        }
    }
)

export const getMyPostsThunk = createAsyncThunk(
    "posts/my",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getMyPosts();
            return res.data.posts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to get posts")
        }
    }
)
