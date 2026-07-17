import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getPosts, type Post} from '@/api/client';

export const fetchFeed = createAsyncThunk("posts/fetchFeed", async () => {
  return await getPosts();
});

type PostsState = {
    items: Post[];
    loading: boolean;
    error: string | null;
}

const initialState: PostsState = {
    items: [],
    loading: false,
    error: null,
}

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFeed.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchFeed.rejected, (state, action) => {
                state.loading = false;
                state.error = "Failed to load feed" + action.error.message;
            })
    },
})

export default postsSlice.reducer;