import axios from "axios";
import { baseUrl } from "./base_url";
import { clearAuth } from "../redux_slices/authSlice";

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor - store ni lazy load cheyyi ✅
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Import at call time, not at module load time
            import("../store").then(({ store, persistor }) => {
                store.dispatch(clearAuth());
                persistor.purge();
                localStorage.removeItem("token");
                if (typeof window !== "undefined") {
                    window.location.href = "/signin";
                }
            });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;