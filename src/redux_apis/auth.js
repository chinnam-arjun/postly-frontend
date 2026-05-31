import axiosInstance from "../utils/AxiosInstance";

export const register = (formData) => {
    return axiosInstance.post("/auth/signup", formData);
};

export const login = (formData) => {
    return axiosInstance.post("/auth/signin", formData);
};

export const getCurrentUser = () => {    
    return axiosInstance.get("/auth/current");
};
