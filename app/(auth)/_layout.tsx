import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function AuthLayout() {
  return (
    <GestureHandlerRootView>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: process.env.EXPO_PUBLIC_BG_COLOR,
            borderBottomColor: process.env.EXPO_PUBLIC_FG1_COLOR,
            borderBottomWidth: 2,
            elevation: 0,
          } as any,
          headerTitleStyle: {
            fontSize: 25,
            color: "#a079c6",
          },
          contentStyle: {
            backgroundColor: process.env.EXPO_PUBLIC_BG_COLOR,
          },
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}
