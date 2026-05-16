/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import { 
    editMyProfileThunk,
    followThunk,
    getFollowersOfSpecificUserThunk,
    getFollowingOfSpecificUserThunk
} from "../redux_thunks/userThunk";

const userSlice = createSlice({
    name: "users",
    initialState: {
        user: null,
        followers: [],
        following: [],
        isLoading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        //edit my profile slice reducers
        .addCase(editMyProfileThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(editMyProfileThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.error = null;
        })
        .addCase(editMyProfileThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //follow/unfollow slice reducers
        .addCase(followThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(followThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.error = null;
        })
        .addCase(followThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //get followers of specific user slice reducers
        .addCase(getFollowersOfSpecificUserThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getFollowersOfSpecificUserThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.followers = action.payload;
            state.error = null;
        })
        .addCase(getFollowersOfSpecificUserThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //get following of specific user slice reducers
        .addCase(getFollowingOfSpecificUserThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getFollowingOfSpecificUserThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.following = action.payload;
            state.error = null;
        })
        .addCase(getFollowingOfSpecificUserThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }   
})

export default userSlice.reducer;