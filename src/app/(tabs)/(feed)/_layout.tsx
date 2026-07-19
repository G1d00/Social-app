import { Stack } from 'expo-router'

const feedLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{title: "Feed", headerShown: false}}/>
        <Stack.Screen name='[id]' options={{title: "Post", headerShown: false}}/>
    </Stack>
  )
}

export default feedLayout