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
    return data;
})

export const getCurrentUserThunk = createAsyncThunk("auth/me", async ()=>{
    const res = await getCurrentUser();
    const data = res.data;
    return data;
})
