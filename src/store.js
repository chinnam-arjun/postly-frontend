import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./redux_slices/authSlice";
import postsReducer from "./redux_slices/postSlice";
import userReducer from "./redux_slices/userSlice";
import articleReducer from "./redux_slices/articleSlice";

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist";

import storage from "redux-persist/lib/storage";  

const rootReducer = combineReducers({
    auth: authReducer, 
    posts: postsReducer,
    users: userReducer,
    articles: articleReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
});

export const persistor = persistStore(store);
export { store };
export default store;
