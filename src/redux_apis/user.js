import axiosInstance from "../utils/AxiosInstance";

export const editMyProfile = async (formData) => {
    return await axiosInstance.put("/users/profile", formData);
};

export const follow = async (userId) => {
    return await axiosInstance.post(`/users/follow/${userId}`);
};

export const getFollowersOfSpecificUser = async (userId) => {
    return await axiosInstance.get(`/users/${userId}/followers`);
};

export const getFollowingOfSpecificUser = async (userId) => {
    return await axiosInstance.get(`/users/${userId}/following`);
};

export const getUserById = async (userId) => {
    const res = await axiosInstance.get(`/users/${userId}`);
    return res.data;
};
