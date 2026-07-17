import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getPosts, type Post} from '@/api/client';

export const fetchFeed = createAsyncThunk<Post[], number | undefined>("posts/fetchFeed", async (cursor) => {
  return await getPosts(cursor);
});

type PostsState = {
    items: Post[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
}

const initialState: PostsState = {
    items: [],
    loading: false,
    error: null,
    hasMore: true,
}

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeed.pending, (state, action) => {
                const cursor = action.meta.arg;
                if (cursor === undefined && state.items.length === 0) {
                    state.loading = true;
                }
                state.error = null;
            })
            .addCase(fetchFeed.fulfilled, (state, action) => {
                state.loading = false;
                const cursor = action.meta.arg;
                if (cursor === undefined) {
                    state.items= action.payload;
                }
                else {
                    state.items.push(...action.payload);
                }
                state.hasMore = action.payload.length >= 20;
            })
            .addCase(fetchFeed.rejected, (state, action) => {
                state.loading = false;
                state.error = "Failed to load feed" + action.error.message;
            })
    },
})

export default postsSlice.reducer;