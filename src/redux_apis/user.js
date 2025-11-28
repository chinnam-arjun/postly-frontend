/* eslint-disable no-unused-vars */
import axiosInstance from "../utils/AxiosInstance";

//updation of profile
export const editMyProfile = (formData) => {
    axiosInstance.put("/users/profile",formData);//profile pic, username, bio etc 
}

//follow/unfollow others
export const follow = (userId) => {
    axiosInstance.post("/users/follow/:userId");
}

//get followers of specificuser 
export const getFollowersOfSpecificUser = (userId) => {
    axiosInstance.get("/users/:userId/followers");
}

//get following of specificuser 
export const getFollowingOfSpecificUser = (userId) => {
    axiosInstance.get("/users/:userId/following");
}
