import "@bacons/text-decoder/install";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { TRPCProvider } from "~/utils/api";

import "../styles.css";

function NavigationBar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: "home", path: "/" },
    { name: "Search", icon: "search", path: "/search" },
    { name: "Create", icon: "add-circle", path: "/create" },
    { name: "Notifications", icon: "notifications", path: "/notifications" },
    { name: "Profile", icon: "person", path: "/profile" },
  ];

  return (
    <View className="flex-row justify-around bg-white py-2 pt-5">
      {navItems.map((item) => (
        <TouchableOpacity key={item.name} onPress={() => {/* TODO: Navigate to item.path */ }}>
          <Ionicons
            name={item.icon as any}
            size={24}
            color={pathname === item.path ? "#FF6101" : "gray"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <TRPCProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#FF6101",
              },
              contentStyle: {
                backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
              },
            }}
          />
        </View>
        <NavigationBar />
      </SafeAreaView>
      <StatusBar />
    </TRPCProvider>
  );
}
