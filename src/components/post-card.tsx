import { View, Image, Text } from "react-native";
import type { Post } from "@/api/client";

export function PostCard( {post} : {post : Post}) {
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
            </View>
        </View>
    )
}