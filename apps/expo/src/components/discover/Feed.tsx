import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, Button, Dimensions } from 'react-native';
import { PostType } from '@acme/db';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from "~/utils/api";
import { Post } from '~/components/discover/Post';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Feed() {
    const [activePostTypes, setActivePostTypes] = useState<PostType[]>(["OUTFIT"]);
    const [activeCategory, setActiveCategory] = useState<'latest' | 'popular'>('latest');
    const [refreshing, setRefreshing] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;
    const [isOffline, setIsOffline] = useState(false);
    const insets = useSafeAreaInsets();

    const { data, fetchNextPage, hasNextPage, refetch, isFetching, error } =
        api.post.getLatestPosts.useInfiniteQuery(
            {
                category: activeCategory,
                types: activePostTypes.length > 0 ? activePostTypes : undefined,
            },
            {
                getNextPageParam: (lastPage: { nextCursor: unknown }) => lastPage.nextCursor,
                onSuccess: (data: any) => {
                    AsyncStorage.setItem('cachedPosts', JSON.stringify(data));
                },
                onError: (error: any) => {
                    console.error('Failed to fetch posts:', error);
                    AsyncStorage.getItem('cachedPosts').then(cachedData => {
                        if (cachedData) {
                            console.log('Using cached data');
                        }
                    });
                },
                retry: false,
            }
        );

    useEffect(() => {
        if (data) {
            setRetryCount(0);
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

    const renderItem = ({ item: post }: { item: unknown }) => (
        <View style={{
            height: Dimensions.get('window').height - insets.top - insets.bottom - 50, // 50 is an estimated height for the navigation bar
            paddingBottom: insets.bottom + 50 // Add padding for the navigation bar
        }}>
            <Post post={post} />
        </View>
    );

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
        <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={Dimensions.get('window').height - insets.top - insets.bottom - 50}
            showsVerticalScrollIndicator={false}
            pagingEnabled={true}
        />
    )
}