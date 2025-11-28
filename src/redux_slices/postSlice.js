import { createSlice } from "@reduxjs/toolkit";
import { getAllPostsThunk,getMyPostsThunk,getSpecificUserPostsThunk,addPostThunk,editPostThunk } from "../redux_thunks/postThunk";

const postSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [],
        isLoading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        //gets all posts for feed in application
        .addCase(getAllPostsThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getAllPostsThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
            state.error = null;
        })
        .addCase(getAllPostsThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //gets specific user posts
        .addCase(getSpecificUserPostsThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getSpecificUserPostsThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
            state.error = null;
        })
        .addCase(getSpecificUserPostsThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //gets my posts 
        .addCase(getMyPostsThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getMyPostsThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
            state.error = null;
        })
        .addCase(getMyPostsThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //adds new post
        .addCase(addPostThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(addPostThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
            state.error = null;
        })
        .addCase(addPostThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //edits post
        .addCase(editPostThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(editPostThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
            state.error = null;
        })
        .addCase(editPostThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export default postSlice.reducer;