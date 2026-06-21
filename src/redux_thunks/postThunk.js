
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllPosts,
  getSpecificUserPosts,
  getMyPosts,
  addPost,
  editPost,
  deletePost,
  toggleLikePost,
  toggleSavePost,
  getSavedPosts
} from "../redux_apis/post";

export const getAllPostsThunk = createAsyncThunk(
    "posts/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAllPosts();
            return res.data.posts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to get posts");
        }
    }
);

export const getSpecificUserPostsThunk = createAsyncThunk(
    "posts/getUserPosts",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await getSpecificUserPosts(userId);
            return res.data.posts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to get posts");
        }
    }
);

export const getMyPostsThunk = createAsyncThunk(
    "posts/getMine",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getMyPosts();
            return res.data.posts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to get posts");
        }
    }
);

export const addPostThunk = createAsyncThunk(
    "posts/add",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await addPost(formData);
            return res.data.post;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to add post");
        }
    }
);

export const editPostThunk = createAsyncThunk(
    "posts/edit",
    async ({ postId, formData }, { rejectWithValue }) => {
        try {
            const res = await editPost(postId, formData);
            return res.data.post;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to edit post");
        }
    }
);

export const deletepostThunk = createAsyncThunk(
    "posts/delete",
    async (postId, { rejectWithValue }) => {
        try {
            const res = await deletePost(postId);
            return res.data.post;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to delete post");
        }
    }
);

// postThunk.js
export const toggleLikePostThunk = createAsyncThunk(
    "posts/toggleLike",
    async (postId, { rejectWithValue }) => {
        try {
            const res = await toggleLikePost(postId);
            return { postId: res.data.postId, likesCount: res.data.likesCount, isLiked: res.data.isLiked };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to toggle like");
        }
    }
);

export const toggleSavePostThunk = createAsyncThunk(
    "posts/toggleSave",
    async (postId, { rejectWithValue }) => {
        try {
            const res = await toggleSavePost(postId);
            return { postId: res.data.postId, savesCount: res.data.savesCount, isSaved: res.data.isSaved };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to toggle save");
        }
    }
);

// postThunk.js
export const getSavedPostsThunk = createAsyncThunk(
    "posts/getSaved",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getSavedPosts();
            return res.data.posts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "failed to get saved posts");
        }
    }
);