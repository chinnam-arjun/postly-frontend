import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getArticleFeedAPI,
    getArticleByIdAPI,
    createArticleAPI,
    updateArticleAPI,
    deleteArticleAPI,
} from "../redux_apis/article.js";

export const getArticleFeedThunk = createAsyncThunk(
    "articles/getFeed",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const data = await getArticleFeedAPI(page, limit);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch feed");
        }
    }
);

export const getArticleByIdThunk = createAsyncThunk(
    "articles/getById",
    async (storyId, { rejectWithValue }) => {
        try {
            const data = await getArticleByIdAPI(storyId);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch article");
        }
    }
);

export const createArticleThunk = createAsyncThunk(
    "articles/create",
    async (formData, { rejectWithValue }) => {
        try {
            const data = await createArticleAPI(formData);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to create article");
        }
    }
);

export const updateArticleThunk = createAsyncThunk(
    "articles/update",
    async ({ storyId, formData }, { rejectWithValue }) => {
        try {
            const data = await updateArticleAPI(storyId, formData);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update article");
        }
    }
);

export const deleteArticleThunk = createAsyncThunk(
    "articles/delete",
    async (storyId, { rejectWithValue }) => {
        try {
            const data = await deleteArticleAPI(storyId);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to delete article");
        }
    }
);