import { createSlice } from "@reduxjs/toolkit";
// import { register, login, logout, getCurrentUser } from "../redux_apis/auth";
import { registerThunk, loginThunk, getCurrentUserThunk } from "../redux_thunks/authThunk";
import { editMyProfileThunk, followThunk } from "../redux_thunks/userThunk";

const normalizeFollowingIds = (user) => {
    if (!user) return [];
    const rawFollowing = user.followingIds || user.following || [];
    if (Array.isArray(rawFollowing)) {
        return rawFollowing.map((item) => typeof item === 'string' ? item : item?._id || item?.id).filter(Boolean);
    }
    return [];
};

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
        setFollowRelationship: (state, action) => {
            const { userId, isFollowing } = action.payload || {};
            if (!state.user || !userId) return;

            const normalizedFollowing = normalizeFollowingIds(state.user);
            const nextFollowing = new Set(normalizedFollowing.map(String));
            if (isFollowing) nextFollowing.add(String(userId)); else nextFollowing.delete(String(userId));

            state.user = {
                ...state.user,
                followingIds: Array.from(nextFollowing),
                following: Array.from(nextFollowing),
            };
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
            const payload = action.payload || {};
            const user = payload.user || payload;
            state.user = user;
            state.token = payload.token || state.token;
            state.role = user?.role || "user";
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
            const payload = action.payload || {};
            const user = payload.user || payload;
            state.user = user;
            state.token = payload.token || state.token;
            state.role = user?.role || "user";
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
            const payload = action.payload || {};
            const user = payload.user || payload;
            state.user = user;
            state.token = payload.token || state.token;
            state.role = user?.role || state.role || "user";
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
                const payload = action.payload || {};
                const nextUser = { ...state.user, ...payload };

                if (typeof payload.isFollowing === 'boolean' && payload.targetUserId) {
                    const normalizedFollowing = normalizeFollowingIds(nextUser);
                    const nextFollowing = new Set(normalizedFollowing.map(String));
                    if (payload.isFollowing) nextFollowing.add(String(payload.targetUserId));
                    else nextFollowing.delete(String(payload.targetUserId));

                    nextUser.followingIds = Array.from(nextFollowing);
                    nextUser.following = Array.from(nextFollowing);
                }

                state.user = nextUser;
            }
        })
    }
})

export const { setCredentials, setFollowRelationship, clearAuth } = authSlice.actions;
export default authSlice.reducer;