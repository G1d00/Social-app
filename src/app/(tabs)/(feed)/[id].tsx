import { View, Text, FlatList, ActivityIndicator, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useAddCommentMutation, useGetCommentsQuery } from '@/features/comments/commentsApi';
import { useAppSelector } from '@/store/hooks';
import { PostCard } from '@/components/post-card';

const postId = () => {
    const [text, setText] = useState("");
    const {id} = useLocalSearchParams<{ id: string }>();
    const postId = Number(id)
    const post = useAppSelector((s) => s.posts.items.find((p) => p.id === postId))
    const { data: comments, isLoading, error} = useGetCommentsQuery(postId)
    const [addComment, { isLoading: isAdding }] = useAddCommentMutation();

    async function handleAdd() {
        if (!text.trim()) return;
        await addComment({postId, content: text}).unwrap();
        setText("")
    }

  if (!post) return <Text>Post not found</Text>

  return (
    <View className='mt-20'>
      <FlatList
        data={comments ?? []}
        keyExtractor={(c) => String(c.id)}
        ListHeaderComponent={<PostCard post={post}/>}
        renderItem={({ item }) => (
            <View className='px-4 py-2 border-b border-gray-100'>
                <Text className='font-semibold'>{item.user.displayName}</Text>
                <Text>{item.content}</Text>
            </View>
        )}
        ListEmptyComponent={
            isLoading ? <ActivityIndicator style={{ marginVertical: 20}}/> :
            error ? <Text>Failed to load comments</Text> :
            <Text>No comments yet</Text>
        }
        contentInsetAdjustmentBehavior='automatic'
      />
      <View className='flex-row gap-2 p-3 border-t border-gray-200'>
        <TextInput
            value={text}
            onChangeText={setText}
            placeholder='Add a comment..'
            placeholderTextColor="#9ca3af"
            style={{
                color: "#000000",
                backgroundColor: "#ffffff",
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                fontSize: 16,
            }}
        />
        <Button title="Post" onPress={handleAdd} disabled={isAdding}/>
      </View>
    </View>
  )
}

export default postId