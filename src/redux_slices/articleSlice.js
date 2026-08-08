/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import {
    getArticleFeedThunk,
    getMyArticlesThunk,
    getArticleByIdThunk,
    createArticleThunk,
    updateArticleThunk,
    deleteArticleThunk,
    toggleArticleLikeThunk,
    toggleArticleSaveThunk,
    getArticleCommentsThunk,
    addArticleCommentThunk,
    deleteArticleCommentThunk,
} from "../redux_thunks/articleThunk";

const articleSlice = createSlice({
    name: "articles",
    initialState: {
        articles: [],
        currentArticle: null,
        comments: [],
        pagination: null,
        isLoading: false,
        commentsLoading: false,
        error: null,
    },
    reducers: {
        clearCurrentArticle: (state) => {
            state.currentArticle = null;
            state.comments = [];
        },
    },
    extraReducers: (builder) => {
        builder

        // ── Feed ─────────────────────────────────────────
        .addCase(getArticleFeedThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getArticleFeedThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            // Load more — page 1 replace, page 2+ append
            if (action.payload.pagination?.page === 1) {
                state.articles = action.payload.stories;
            } else {
                state.articles = [...state.articles, ...action.payload.stories];
            }
            state.pagination = action.payload.pagination;
        })
        .addCase(getArticleFeedThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // ── My Articles ───────────────────────────────────
        .addCase(getMyArticlesThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getMyArticlesThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload.pagination?.page === 1) {
                state.articles = action.payload.stories;
            } else {
                state.articles = [...state.articles, ...action.payload.stories];
            }
            state.pagination = action.payload.pagination;
        })
        .addCase(getMyArticlesThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // ── Single Article ────────────────────────────────
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

        // ── Create ────────────────────────────────────────
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

        // ── Update ────────────────────────────────────────
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

        // ── Delete ────────────────────────────────────────
        .addCase(deleteArticleThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(deleteArticleThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.articles = state.articles.filter(
                a => a._id !== action.payload.storyId
            );
            state.currentArticle = null;
        })
        .addCase(deleteArticleThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // ── Toggle Like ───────────────────────────────────
        .addCase(toggleArticleLikeThunk.fulfilled, (state, action) => {
            const { storyId, likesCount } = action.payload;
            if (state.currentArticle?._id === storyId) {
                state.currentArticle.likesCount = likesCount;
                const userId = action.meta.arg; // not available here — handle in component
            }
            state.articles = state.articles.map(a =>
                a._id === storyId ? { ...a, likesCount } : a
            );
        })

        // ── Toggle Save ───────────────────────────────────
        .addCase(toggleArticleSaveThunk.fulfilled, (state, action) => {
            const { storyId, savesCount } = action.payload;
            if (state.currentArticle?._id === storyId) {
                state.currentArticle.savesCount = savesCount;
            }
            state.articles = state.articles.map(a =>
                a._id === storyId ? { ...a, savesCount } : a
            );
        })

        // ── Get Comments ──────────────────────────────────
        .addCase(getArticleCommentsThunk.pending, (state) => {
            state.commentsLoading = true;
        })
        .addCase(getArticleCommentsThunk.fulfilled, (state, action) => {
            state.commentsLoading = false;
            state.comments = action.payload.comments;
        })
        .addCase(getArticleCommentsThunk.rejected, (state) => {
            state.commentsLoading = false;
        })

        // ── Add Comment ───────────────────────────────────
        .addCase(addArticleCommentThunk.fulfilled, (state, action) => {
            state.comments = [...state.comments, action.payload.comment];
            if (state.currentArticle) {
                state.currentArticle.commentsCount++;
            }
        })

        // ── Delete Comment ────────────────────────────────
        .addCase(deleteArticleCommentThunk.fulfilled, (state, action) => {
            state.comments = state.comments.filter(
                c => c._id !== action.payload.commentId
            );
            if (state.currentArticle) {
                state.currentArticle.commentsCount--;
            }
        })
    },
});

export const { clearCurrentArticle } = articleSlice.actions;
export default articleSlice.reducer;