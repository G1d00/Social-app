const BASE_URL = "http://localhost:3000";

export type Post = {
    id: number;
    createdAt: string;
    content: string;
    authorId: number;
    author: {
        id: number;
        username: string;
        displayName: string;
        avatarUrl: string | null;
        createdAt: string;
    };
    likeCount : number;
    likedByMe: boolean;
};

async function request<T>(path: string, options?: RequestInit): Promise<T>{
    const res = await fetch(`${BASE_URL}${path}`, options);
    if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
    }
    return res.json();
}

export function getPosts(cursor?: number, limit = 20): Promise<Post[]>{
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (cursor !== undefined) params.set("cursor", String(cursor));
    return request<Post[]>(`/api/posts?${params.toString()}`);
}

export function likePost(id: number): Promise<{ok : boolean }> {
    return request(`/api/posts/${id}/like`, { method: "POST" })
}

export function unlikePost(id: number): Promise<{ok: boolean}> {
    return request(`/api/posts/${id}/like`, {method: "DELETE"})
}