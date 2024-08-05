import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { useSignIn, useSignOut, useUser } from "~/utils/auth";

function MobileAuth() {
  const user = useUser();
  const signInToDiscord = useSignIn({ provider: 'discord' });
  const signInToGoogle = useSignIn({ provider: 'google' });
  const signOut = useSignOut();

  return (
    <>
      <Text className="pb-2 text-center text-xl font-semibold text-black">
        {user?.username ?? "Not logged in"}
        {JSON.stringify(user, null, 2)}
      </Text>
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
    </>
  );
}

export default function Index() {

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          <Text className="text-primary">Outfits.bio</Text> Mobile
        </Text>

        <MobileAuth />

      </View>
    </SafeAreaView>
  );
}