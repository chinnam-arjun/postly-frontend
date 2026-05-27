import axios from "axios";
import { baseUrl } from "./base_url";
import { store, persistor } from "../store";
import { clearAuth } from "../redux_slices/authSlice";

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false
});

// 1. Request Interceptor (Adds the token)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Response Interceptor (Handles the 401 Unauthorized)
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized: clearing auth state and redirecting to signin.");
            store.dispatch(clearAuth());
            persistor.purge();
            localStorage.removeItem('token');
            if (typeof window !== 'undefined') {
                window.location.href = '/signin';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

// import axios from "axios";
// import { baseUrl } from "./base_url";

// const axiosInstance = axios.create({
//     baseURL: baseUrl,
//     headers: {
//         "Content-Type": "application/json",
//     },
//     withCredentials: false
// });

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");
//         if (token) {
//             config.headers["Authorization"] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
        
//     return Promise.reject(error);
//     }

// );

// export default axiosInstance;