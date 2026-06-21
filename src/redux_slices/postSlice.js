import { createSlice } from "@reduxjs/toolkit";
import {
    getAllPostsThunk,
    getMyPostsThunk,
    getSpecificUserPostsThunk,
    addPostThunk,
    editPostThunk,
    deletepostThunk,
    toggleLikePostThunk,
    toggleSavePostThunk
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
        isLoading: false,
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
                const updatedPost = action.payload;
                if (updatedPost?._id) {
                    state.postsById[updatedPost._id] = updatedPost;
                    state.posts = state.posts.map((post) =>
                        post._id === updatedPost._id ? updatedPost : post
                    );
                }
            })
            .addCase(toggleSavePostThunk.fulfilled, (state, action) => {
                const updatedPost = action.payload;
                if (updatedPost?._id) {
                    state.postsById[updatedPost._id] = updatedPost;
                    state.posts = state.posts.map((post) =>
                        post._id === updatedPost._id ? updatedPost : post
                    );
                }
            });
    }
});

export const { setPosts, updatePostInStore } = postSlice.actions;
export default postSlice.reducer;