import { createSlice } from "@reduxjs/toolkit";
import {
    getAllPostsThunk,
    getMyPostsThunk,
    getSpecificUserPostsThunk,
    addPostThunk,
    editPostThunk,
    deletepostThunk,
    toggleLikePostThunk,
    toggleSavePostThunk,
    getSavedPostsThunk
} from "../redux_thunks/postThunk";

const normalizePosts = (posts = []) => {
    return posts.reduce((acc, post) => {
        if (post?._id) acc[post._id] = post;
        return acc;
    }, {});
};

const applyPosts = (state, payload) => {
    const posts = Array.isArray(payload) ? payload : payload?.posts || [];
    state.posts = posts;
    state.postsById = normalizePosts(posts);
};

const postSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [],
        postsById: {},
        savedPosts: [],
        savedPostsById: {},
        isLoading: false,
        savedPostsLoading: false,
        error: null
    },
    reducers: {
        setPosts: (state, action) => {
            applyPosts(state, action.payload);
        },
        updatePostInStore: (state, action) => {
            const updatedPost = action.payload;
            if (!updatedPost?._id) return;
            state.postsById[updatedPost._id] = updatedPost;
            state.posts = state.posts.map((post) =>
                post._id === updatedPost._id ? updatedPost : post
            );
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPostsThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllPostsThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                applyPosts(state, action.payload);
                state.error = null;
            })
            .addCase(getAllPostsThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getSpecificUserPostsThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getSpecificUserPostsThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                applyPosts(state, action.payload);
                state.error = null;
            })
            .addCase(getSpecificUserPostsThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getMyPostsThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getMyPostsThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                applyPosts(state, action.payload);
                state.error = null;
            })
            .addCase(getMyPostsThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(addPostThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addPostThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const post = action.payload;
                if (post?._id) {
                    state.posts = [post, ...state.posts];
                    state.postsById[post._id] = post;
                }
                state.error = null;
            })
            .addCase(addPostThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(editPostThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editPostThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedPost = action.payload;
                if (updatedPost?._id) {
                    state.posts = state.posts.map((post) =>
                        post._id === updatedPost._id ? updatedPost : post
                    );
                    state.postsById[updatedPost._id] = updatedPost;
                }
                state.error = null;
            })
            .addCase(editPostThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(deletepostThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deletepostThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const deletedPost = action.payload;
                if (deletedPost?._id) {
                    state.posts = state.posts.filter((post) => post._id !== deletedPost._id);
                    delete state.postsById[deletedPost._id];
                }
                state.error = null;
            })
            .addCase(deletepostThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(toggleLikePostThunk.fulfilled, (state, action) => {
                const { postId, likesCount, isLiked } = action.payload;
                if (!postId) return;
                if (state.postsById[postId]) {
                    state.postsById[postId].likesCount = likesCount;
                    state.postsById[postId].isLiked = isLiked;
                }
                state.posts = state.posts.map((post) =>
                    post._id === postId ? { ...post, likesCount, isLiked } : post
                );
                // mirror into savedPosts if it exists there too
                if (state.savedPostsById[postId]) {
                    state.savedPostsById[postId].likesCount = likesCount;
                    state.savedPostsById[postId].isLiked = isLiked;
                    state.savedPosts = state.savedPosts.map((post) =>
                        post._id === postId ? { ...post, likesCount, isLiked } : post
                    );
                }
            })
            .addCase(toggleSavePostThunk.fulfilled, (state, action) => {
                const { postId, savesCount, isSaved } = action.payload;
                if (!postId) return;

                // update in main feed
                if (state.postsById[postId]) {
                    state.postsById[postId].savesCount = savesCount;
                    state.postsById[postId].isSaved = isSaved;
                }
                state.posts = state.posts.map((post) =>
                    post._id === postId ? { ...post, savesCount, isSaved } : post
                );

                // if unsaved, remove it from savedPosts entirely (it shouldn't be in Library anymore)
                if (!isSaved) {
                    delete state.savedPostsById[postId];
                    state.savedPosts = state.savedPosts.filter((post) => post._id !== postId);
                } else if (state.savedPostsById[postId]) {
                    // if it was already in savedPosts and re-saved, just update counts
                    state.savedPostsById[postId].savesCount = savesCount;
                    state.savedPostsById[postId].isSaved = isSaved;
                }
            })
            .addCase(getSavedPostsThunk.pending, (state) => {
                state.savedPostsLoading = true;
                state.error = null;
            })
            .addCase(getSavedPostsThunk.fulfilled, (state, action) => {
                state.savedPostsLoading = false;
                const posts = Array.isArray(action.payload) ? action.payload : action.payload?.posts || [];
                state.savedPosts = posts;
                state.savedPostsById = normalizePosts(posts);
            })
            .addCase(getSavedPostsThunk.rejected, (state, action) => {
                state.savedPostsLoading = false;
                state.error = action.error.message;
            })
    }
});

export const { setPosts, updatePostInStore } = postSlice.actions;
export default postSlice.reducer;