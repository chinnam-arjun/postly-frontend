import { createSlice } from "@reduxjs/toolkit";
import {
    getArticleFeedThunk,
    getArticleByIdThunk,
    createArticleThunk,
    updateArticleThunk,
    deleteArticleThunk,
} from "../redux_thunks/articleThunk";

const articleSlice = createSlice({
    name: "articles",
    initialState: {
        articles: [],          // feed articles list
        currentArticle: null,  // single article view
        pagination: null,      // feed pagination info
        isLoading: false,
        error: null,
    },
    reducers: {
        clearCurrentArticle: (state) => {
            state.currentArticle = null;
        },
    },
    extraReducers: (builder) => {
        builder
        // Feed
        .addCase(getArticleFeedThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getArticleFeedThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.articles = action.payload.stories;
            state.pagination = action.payload.pagination;
        })
        .addCase(getArticleFeedThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // Single Article
        .addCase(getArticleByIdThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getArticleByIdThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentArticle = action.payload.story;
        })
        .addCase(getArticleByIdThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // Create
        .addCase(createArticleThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(createArticleThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.articles = [action.payload.story, ...state.articles];
        })
        .addCase(createArticleThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // Update
        .addCase(updateArticleThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(updateArticleThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.articles = state.articles.map(a =>
                a._id === action.payload.story._id ? action.payload.story : a
            );
            state.currentArticle = action.payload.story;
        })
        .addCase(updateArticleThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // Delete
        .addCase(deleteArticleThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(deleteArticleThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.articles = state.articles.filter(
                a => a._id !== action.payload.storyId
            );
        })
        .addCase(deleteArticleThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
    },
});

export const { clearCurrentArticle } = articleSlice.actions;
export default articleSlice.reducer;