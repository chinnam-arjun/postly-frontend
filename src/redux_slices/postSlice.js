import { createSlice } from "@reduxjs/toolkit";
import { getAllPostsThunk } from "../redux_thunks/postThunk";

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
    }
})

export default postSlice.reducer;