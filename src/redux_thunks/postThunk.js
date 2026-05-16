
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { getAllPosts,getSpecificUserPosts, getMyPosts,addPost,editPost } from "../redux_apis/post";

// export const getAllPostsThunk = createAsyncThunk(
//     "posts/",
//     async (_, { rejectWithValue }) => {
//         try {
//             const res = await getAllPosts();
//             return res.data.posts;//its the response structure 
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || "failed to get posts")
//         }
//     }
// )

// export const getSpecificUserPostsThunk = createAsyncThunk(
//     "posts/user/:userId",
//     async (userId, { rejectWithValue }) => {
//         try {
//             const res = await getSpecificUserPosts(userId);
//             return res.data.posts;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || "failed to get posts")
//         }
//     }
// )

// export const getMyPostsThunk = createAsyncThunk(
//     "posts/my",
//     async (_, { rejectWithValue }) => {
//         try {
//             const res = await getMyPosts();
//             return res.data.posts;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || "failed to get posts")
//         }
//     }
// )

// export const addPostThunk = createAsyncThunk(
//     "posts",
//     async (formData, { rejectWithValue }) => {
//         try {
//             const res = await addPost(formData);
//             return res.data.post;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || "failed to add post")
//         }
//     }
// )

// export const editPostThunk = createAsyncThunk(
//     "posts/:postId",
//     async (postId, formData, { rejectWithValue }) => {
//         try {
//             const res = await editPost(postId, formData);
//             return res.data.post;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || "failed to edit post")
//         }
//     }
// )

// export const deletepostThunk = createAsyncThunk(
//     "posts/:postId",
//     async (postId, { rejectWithValue }) => {
//         try {
//             const res = await deletePost(postId);
//             return res.data.post;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || "failed to delete post")
//         }
//     }
// )

import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getAllPosts,
  getSpecificUserPosts,
  getMyPosts,
  addPost,
  editPost,
  deletePost
} from "../redux_apis/post";

// GET ALL POSTS
export const getAllPostsThunk = createAsyncThunk(
    "posts/",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAllPosts();
            return res.data.posts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to get posts");
        }
    }
);

// GET USER POSTS
export const getSpecificUserPostsThunk = createAsyncThunk(
    "posts/user/:userId",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await getSpecificUserPosts(userId);
            return res.data.posts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to get posts");
        }
    }
);

// GET MY POSTS
export const getMyPostsThunk = createAsyncThunk(
    "posts/my",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getMyPosts();
            return res.data.posts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to get posts");
        }
    }
);

// ADD POST
export const addPostThunk = createAsyncThunk(
    "posts/",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await addPost(formData);
            return res.data.post;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to add post");
        }
    }
);

// EDIT POST
export const editPostThunk = createAsyncThunk(
    "posts/:postId",
    async ({ postId, formData }, { rejectWithValue }) => {
        try {
            const res = await editPost(postId, formData);
            return res.data.post;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to edit post");
        }
    }
);

// DELETE POST
export const deletepostThunk = createAsyncThunk(
    "posts/:postId",
    async (postId, { rejectWithValue }) => {
        try {
            const res = await deletePost(postId);
            return res.data.post;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to delete post");
        }
    }
);
