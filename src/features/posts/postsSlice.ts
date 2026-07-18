import {createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {getPosts, likePost, unlikePost, type Post} from '@/api/client';
import type { RootState } from '@/store/store';

export const fetchFeed = createAsyncThunk<Post[], number | undefined>("posts/fetchFeed", async (cursor) => {
  return await getPosts(cursor);
});

export const toggleLike = createAsyncThunk<void, number, {state: RootState }>(
    "posts/toggleLike", async (postId, { getState, dispatch }) => {
        const post = getState().posts.items.find((p) => p.id === postId)
        if (!post) return;
        const wasLiked = post.likedByMe;
        dispatch(setLiked({ postId, liked: !wasLiked }));
        try {
            if (wasLiked) await unlikePost(postId);
            else await likePost(postId);
        } catch (e) {
            console.log("toggleLike failed:", e);
            dispatch(setLiked({ postId, liked: wasLiked }));
            throw e;
        }
    }
)
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
    reducers: {
        setLiked(state, action: PayloadAction<{ postId: number; liked: boolean}>){
            const post = state.items.find((p) => p.id === action.payload.postId);
            if (post && post.likedByMe !== action.payload.liked) {
                post.likedByMe = action.payload.liked;
                post.likeCount += action.payload.liked ? 1 : -1;
            }
        },
    },
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

export const {setLiked} = postsSlice.actions;
export default postsSlice.reducer;