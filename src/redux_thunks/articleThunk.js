import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getArticleFeedAPI,
    getMyArticlesAPI,
    getArticleByIdAPI,
    createArticleAPI,
    updateArticleAPI,
    deleteArticleAPI,
    toggleArticleLikeAPI,
    toggleArticleSaveAPI,
    getSavedArticlesAPI,
    getArticleCommentsAPI,
    addArticleCommentAPI,
    deleteArticleCommentAPI,
} from "../redux_apis/article.js";

export const getArticleFeedThunk = createAsyncThunk(
    "articles/getFeed",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            return await getArticleFeedAPI(page, limit);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch feed");
        }
    }
);

export const getMyArticlesThunk = createAsyncThunk(
    "articles/getMine",
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            return await getMyArticlesAPI(page, limit);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch your articles");
        }
    }
);

export const getArticleByIdThunk = createAsyncThunk(
    "articles/getById",
    async (storyId, { rejectWithValue }) => {
        try {
            return await getArticleByIdAPI(storyId);
        } catch (err) {
            return rejectWithValue({
                status: err.response?.status,
                code: err.response?.data?.code,
                message: err.response?.data?.message || "Failed to fetch article",
                author: err.response?.data?.author || null,
            });
        }
    }
);

export const createArticleThunk = createAsyncThunk(
    "articles/create",
    async (formData, { rejectWithValue }) => {
        try {
            return await createArticleAPI(formData);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to create article");
        }
    }
);

export const updateArticleThunk = createAsyncThunk(
    "articles/update",
    async ({ storyId, formData }, { rejectWithValue }) => {
        try {
            return await updateArticleAPI(storyId, formData);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update article");
        }
    }
);

export const deleteArticleThunk = createAsyncThunk(
    "articles/delete",
    async (storyId, { rejectWithValue }) => {
        try {
            await deleteArticleAPI(storyId);
            return { storyId };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to delete article");
        }
    }
);

// ── Interactions ──────────────────────────────────────

export const toggleArticleLikeThunk = createAsyncThunk(
    "articles/toggleLike",
    async (storyId, { rejectWithValue }) => {
        try {
            const data = await toggleArticleLikeAPI(storyId);
            return { storyId, likesCount: data.likesCount };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to toggle like");
        }
    }
);

export const toggleArticleSaveThunk = createAsyncThunk(
    "articles/toggleSave",
    async (storyId, { rejectWithValue }) => {
        try {
            const data = await toggleArticleSaveAPI(storyId);
            return { storyId, savesCount: data.savesCount, isSaved: data.isSaved };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to toggle save");
        }
    }
);

export const getSavedArticlesThunk = createAsyncThunk(
    "articles/getSaved",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getSavedArticlesAPI();
            const stories = Array.isArray(data) ? data : data?.stories || data?.savedStories || [];
            return stories;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch saved articles");
        }
    }
);

// ── Comments ──────────────────────────────────────────

export const getArticleCommentsThunk = createAsyncThunk(
    "articles/getComments",
    async (storyId, { rejectWithValue }) => {
        try {
            return await getArticleCommentsAPI(storyId);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch comments");
        }
    }
);

export const addArticleCommentThunk = createAsyncThunk(
    "articles/addComment",
    async ({ storyId, content }, { rejectWithValue }) => {
        try {
            return await addArticleCommentAPI(storyId, content);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to add comment");
        }
    }
);

export const deleteArticleCommentThunk = createAsyncThunk(
    "articles/deleteComment",
    async ({ storyId, commentId }, { rejectWithValue }) => {
        try {
            await deleteArticleCommentAPI(storyId, commentId);
            return { commentId };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to delete comment");
        }
    }
);