import {configureStore} from "@reduxjs/toolkit";
import postsReducer from "@/features/posts/postsSlice";
import { commentsApi } from "@/features/comments/commentsApi";

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        [commentsApi.reducerPath]: commentsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(commentsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;