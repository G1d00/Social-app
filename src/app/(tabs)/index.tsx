import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import { useEffect, useState } from 'react'
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
      renderItem={({item}) => <PostCard post={item}/>}
      keyExtractor={(post) => String(post.id)}
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