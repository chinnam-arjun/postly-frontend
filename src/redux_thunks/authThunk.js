import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, getCurrentUser } from "../redux_apis/auth";

export const registerThunk = createAsyncThunk("auth/signup", async (formData)=>{
    const res = await register(formData);
    const data = res.data;
    localStorage.setItem("token", data.token);
    return data;
})

export const loginThunk = createAsyncThunk("auth/signin", async (formData)=>{
    const res = await login(formData);
    const data = res.data;
    localStorage.setItem("token", data.token);
    console.log("login response: ", data)
    // return data;

    const userRes = await getCurrentUser();
    return {
        token: data.token,
        user: userRes.data.user  // full user object
    };
})

// export const getCurrentUserThunk = createAsyncThunk("auth/me", async ()=>{
//     const res = await getCurrentUser();
//     const data = res.data;
//     return data;
// })


export const getCurrentUserThunk = createAsyncThunk("auth/me", async () => {
    const res = await getCurrentUser();
    const data = res.data;
    console.log("getCurrentUser API response:", data); // idi em chupistundi?
    return data;
})