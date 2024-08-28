import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Button } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { PostType } from '@acme/db';

import { api } from "~/utils/api";
import { Post } from '~/components/Post';
import { CategoryButton } from '~/components/CategoryButton';
import { useSignIn, useSignOut, useUser } from '~/utils/auth';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

function MobileAuth() {
  const user = useUser();
  const signInToDiscord = useSignIn({ provider: 'discord' });
  const signInToGoogle = useSignIn({ provider: 'google' });
  const signOut = useSignOut();

  return (
    <>
      <Button
        onPress={() => (user ? signOut() : signInToDiscord())}
        title={user ? "Sign Out" : "Sign In With Discord"}
        color={"#5B65E9"}
      />
      <Button
        onPress={() => (user ? signOut() : signInToGoogle())}
        title={user ? "Sign Out" : "Sign In With Google"}
        color={"#5B65E9"}
      />
      <Text className="pb-2 text-center text-xl font-semibold text-black">
        {JSON.stringify(user, null, 2)}
      </Text>
    </>
  );
}

export default function Index() {
  const [activePostTypes, setActivePostTypes] = useState<PostType[]>(["OUTFIT"]);
  const [activeCategory, setActiveCategory] = useState<'latest' | 'popular'>('latest');
  const [refreshing, setRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const [isOffline, setIsOffline] = useState(false);

  const { data, fetchNextPage, hasNextPage, refetch, isFetching, error } =
    api.post.getLatestPosts.useInfiniteQuery(
      {
        category: activeCategory,
        types: activePostTypes.length > 0 ? activePostTypes : undefined,
      },
      {
        getNextPageParam: (lastPage: { nextCursor: unknown }) => lastPage.nextCursor,
        onSuccess: (data) => {
          AsyncStorage.setItem('cachedPosts', JSON.stringify(data));
        },
        onError: (error) => {
          console.error('Failed to fetch posts:', error);
          AsyncStorage.getItem('cachedPosts').then(cachedData => {
            if (cachedData) {
              // Use cached data if available
              console.log('Using cached data');
              // You'll need to update your state with this cached data
            }
          });
        },
        retry: false, // Disable default retry to use our custom logic
      }
    );

  useEffect(() => {
    if (data) {
      setRetryCount(0); // Reset retry count on successful fetch
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const posts = data?.pages.flatMap((page: { posts: unknown[] }) => page.posts) ?? [];

  const handleChangePostType = (type: PostType) => {
    setActivePostTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleChangeCategory = (category: 'latest' | 'popular') => {
    setActiveCategory(category);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

  const renderItem = ({ item: post }: { item: unknown }) => <Post post={post} />;

  const loadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  if (error && retryCount >= MAX_RETRIES) {
    return (
      <View>
        <Text>Error loading posts. Please check your connection and try again later.</Text>
        <Button title="Retry" onPress={() => { setRetryCount(0); refetch(); }} />
      </View>
    );
  }

  if (isOffline) {
    return (
      <View>
        <Text>You are offline. Please check your internet connection.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ title: "Discover" }} />
      <View className="flex-1 p-4">
        {/* <View className="flex-row justify-center mb-4">
          <TouchableOpacity
            onPress={() => handleChangeCategory('latest')}
            className={`px-4 py-2 mr-2 ${activeCategory === 'latest' ? 'bg-primary' : 'bg-gray-200'}`}
          >
            <Text>Latest</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChangeCategory('popular')}
            className={`px-4 py-2 ${activeCategory === 'popular' ? 'bg-primary' : 'bg-gray-200'}`}
          >
            <Text>Popular</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap justify-center mb-4">
          {Object.values(PostType).map((type) => (
            <CategoryButton
              key={type}
              activePostTypes={activePostTypes}
              handleChangePostType={handleChangePostType}
              type={type}
            />
          ))}
        </View> */}

        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>

      <MobileAuth />
    </SafeAreaView>
  );
}