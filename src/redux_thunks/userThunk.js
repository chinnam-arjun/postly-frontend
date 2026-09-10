import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    editMyProfile, 
    follow,
    getFollowersOfSpecificUser,
    getFollowingOfSpecificUser
} from "../redux_apis/user";

export const editMyProfileThunk = createAsyncThunk("users/profile", async (formData) => {
  const res = await editMyProfile(formData);
  return res.data.user;
});

export const followThunk = createAsyncThunk("users/follow/:userId", async (userId) => {
    const res = await follow(userId);
    const data = res.data || {};
    const message = typeof data.message === 'string' ? data.message.toLowerCase() : '';
    const isFollowing = typeof data.isFollowing === 'boolean'
        ? data.isFollowing
        : message.includes('unfollow') || message.includes('unfollowed')
            ? false
            : message.includes('followed') || message.includes('follow')
                ? true
                : undefined;

    return {
        ...data,
        targetUserId: userId,
        isFollowing,
    };
})

export const getFollowersOfSpecificUserThunk = createAsyncThunk("users/:userId/followers", async (userId) => {
    const res = await getFollowersOfSpecificUser(userId);
    const data = res.data;
    return data;
})

export const getFollowingOfSpecificUserThunk = createAsyncThunk("users/:userId/following", async (userId) => {
    const res = await getFollowingOfSpecificUser(userId);
    const data = res.data;
    return data;
})
