/* eslint-disable no-unused-vars */
import axiosInstance from "../utils/AxiosInstance";

//updation of profile
export const editMyProfile = (formData) => {
    return axiosInstance.put("/users/profile", formData);
}

//follow/unfollow others
export const follow = (userId) => {
    return axiosInstance.post(`/users/follow/${userId}`);
}

//get followers of specificuser 
export const getFollowersOfSpecificUser = (userId) => {
    return axiosInstance.get(`/users/${userId}/followers`);
}

//get following of specificuser 
export const getFollowingOfSpecificUser = (userId) => {
    return axiosInstance.get(`/users/${userId}/following`);
}
