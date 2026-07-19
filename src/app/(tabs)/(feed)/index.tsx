import { View, Text, ActivityIndicator, FlatList, Pressable } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { PostCard } from '@/components/post-card'
import { getPosts, type Post } from "@/api/client"
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchFeed } from '@/features/posts/postsSlice'

const Feed = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((s) => s.posts.items);
  const loading = useAppSelector((s) => s.posts.loading);
  const error = useAppSelector((s) => s.posts.error);
  const hasMore = useAppSelector((s) => s.posts.hasMore)
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const renderItem = useCallback(({item}: {item: Post}) => (
    <Link href={`/${item.id}`} asChild>
      <Pressable>
        <PostCard post={item}/>
      </Pressable>
    </Link>
  ),[])
  const keyExtractor = useCallback((post: Post) => String(post.id),[])

  useEffect(() => {
    dispatch(fetchFeed());
  }, [])

  async function loadMore() {
    if (loadingMore || !hasMore || posts.length === 0) return;
    setLoadingMore(true);
    const cursor = posts[posts.length -1].id
    await dispatch(fetchFeed(cursor));
    setLoadingMore(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
      const data = await getPosts();
      await dispatch(fetchFeed());
      setRefreshing(false)
  }

  if (loading) return <ActivityIndicator style= {{ flex: 1 }}/>;
  if (error) return <Text>{error}</Text>;

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentInsetAdjustmentBehavior="automatic"
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      contentContainerStyle={{ paddingBottom: 20 }}
      ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
    />
  )
}

export default Feed