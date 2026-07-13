import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import { PostCard } from '@/components/post-card'
import { getPosts, type Post } from "@/api/client"

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(() => setError('Failed to load feed.'))
      .finally(() => setLoading(false))
  }, []);

  async function loadMore() {
    if (loadingMore || !hasMore || posts.length === 0) return;
    setLoadingMore(true);
    try {
      const cursor = posts[posts.length -1].id
      const next = await getPosts(cursor);
      if (next.length < 20) setHasMore(false);
      setPosts((prev) => [...prev, ...next]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const data = await getPosts();
      setPosts(data);
      setHasMore(true);
    } catch {
      setError('Failed to refresh feed.');
    } finally {
      setRefreshing(false);
    }
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