import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Comment = {
    id: number;
    content: string;
    postId: number;
    userId: number;
    createdAt: Date;
    user: {
        id: number;
        username: string;
        displayName: string;
        avatarUrl: string | null;
    };
};

export const commentsApi = createApi({
    reducerPath: "commentsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000"}),
    tagTypes: ["Comments"],
    endpoints: (builder) => ({
        getComments: builder.query<Comment[], number>({
            query: (postId) => `/api/posts/${postId}/comments`,
            providesTags: (result, error, postId) => [{
                type: "Comments", id: postId
            }],
        }),
        addComment: builder.mutation<Comment, { postId: number; content: string }> ({
            query: ({ postId, content }) => ({
                url: `/api/posts/${postId}/comments`,
                method: "POST",
                body: {content},
            }),
            invalidatesTags: (result, error, {postId}) => [{ type: "Comments", id: postId}],
        }),
    }),
});

export const { useGetCommentsQuery, useAddCommentMutation } = commentsApi;