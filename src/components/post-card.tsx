import { View, Image, Text, Pressable } from "react-native";
import type { Post } from "@/api/client";
import { useAppDispatch } from "@/store/hooks";
import { toggleLike } from "@/features/posts/postsSlice";
import { memo } from "react";

export const PostCard = memo( function PostCard( {post} : {post : Post}) {
    const dispatch = useAppDispatch();
    return (
        <View className="flex-row gap-2 my-2">
            <Image
                source={{ uri: post.author.avatarUrl ?? undefined}}
                style={{ width: 40, height: 40, borderRadius: 20}}
            />
            <View className="flex-1 gap-1">
                <Text className="font-semibold text-black">{post.author.displayName}</Text>
                <Text selectable>{post.content}</Text>
                <Text>{new Date(post.createdAt).toLocaleDateString()}</Text>

                <Pressable
                    onPress={() => dispatch(toggleLike(post.id))}
                    className="flex-row"
                >
                    <Text>{post.likedByMe ? "❤️" : "🤍"}</Text>
                    <Text className="text-gray-600" style={{ fontVariant: ["tabular-nums"]}}>{post.likeCount}</Text>
                </Pressable>
            </View>
        </View>
    )
})