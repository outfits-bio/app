import React from 'react';
import { View } from 'react-native';
import { Stack } from "expo-router";

import Feed from '~/components/discover/Feed';

export default function Index() {
  return (
    <View className='flex-1'>
      <Stack.Screen options={{ title: "Discover", headerShown: false }} />
      <Feed />
    </View>
  );
}