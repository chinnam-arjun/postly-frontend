import { createSlice } from "@reduxjs/toolkit";
import { addPost, deletePost, editPost, getAllPosts, getMyPosts, getSpecificPost, getSpecificUserPosts } from "../redux_apis/post";

const initialState = {
    posts: [],
    isLoading: false,
    error: null
}

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        //get all posts slice reducers
        .addCase(getAllPosts.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
            state.error = null;
        })
        .addCase(getAllPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //get my posts slice reducers
        .addCase(getMyPosts.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getMyPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
            state.error = null;
        })
        .addCase(getMyPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //get specific post slice reducers-need to add 
        .addCase(getSpecificPost.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getSpecificPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
            state.error = null;
        })
        .addCase(getSpecificPost.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //get specific user posts slice reducers
        .addCase(getSpecificUserPosts.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getSpecificUserPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
            state.error = null;
        })
        .addCase(getSpecificUserPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //add post slice reducers
        .addCase(addPost.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(addPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
            state.error = null;
        })
        .addCase(addPost.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //delete post slice reducers
        .addCase(deletePost.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(deletePost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
            state.error = null;
        })
        .addCase(deletePost.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //edit post slice reducers
        .addCase(editPost.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(editPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
            state.error = null;
        })
        .addCase(editPost.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export const { setPosts } = postSlice.actions;
export default postSlice.reducer;