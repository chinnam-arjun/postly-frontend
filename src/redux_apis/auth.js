import axiosInstance from "../utils/AxiosInstance";

export const register = (formData) => {
    return axiosInstance.post("/auth/signup", formData);
};

export const login = (formData) => {
    return axiosInstance.post("/auth/signin", formData);
};

export const getCurrentUser = () => {    
    // Prevent browser/service-worker caching and conditional 304 responses
    return axiosInstance.get("/auth/current", {
        headers: {
            "Cache-Control": "no-cache",
        },
        // ensure cookies or credentials are not implicitly sent unless needed
        withCredentials: false,
    });
};
