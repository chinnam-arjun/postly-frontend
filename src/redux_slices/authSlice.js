import { createSlice } from "@reduxjs/toolkit";
// import { register, login, logout, getCurrentUser } from "../redux_apis/auth";
import { registerThunk, loginThunk, getCurrentUserThunk } from "../redux_thunks/authThunk";
import { editMyProfileThunk, followThunk } from "../redux_thunks/userThunk";

const initialState = {
    user: null,
    token: null,
    role: null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user; 
            state.token = token;
            state.role = user?.role || "user";
            state.error = null;
            state.isLoading = false; 
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.error = null;
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
        //register slice reducers 
        .addCase(registerThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(registerThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.user.role || "user";
            state.error = null;
        })
        .addCase(registerThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //login slice reducers
        .addCase(loginThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(loginThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.user.role;
            state.error = null;
        })
        .addCase(loginThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        //get the current user info slice 
        .addCase(getCurrentUserThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.user.role;
            state.error = null;
        })
        .addCase(getCurrentUserThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        // Handle profile edits - sync with authSlice
        .addCase(editMyProfileThunk.fulfilled, (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        })
        // Handle follow/unfollow - sync followers/following with authSlice
        .addCase(followThunk.fulfilled, (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        })
    }
})

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;