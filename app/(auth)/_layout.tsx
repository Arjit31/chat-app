import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: process.env.EXPO_PUBLIC_BG_COLOR || "#121212", // dark grey fallback
          borderBottomColor: process.env.EXPO_PUBLIC_FG1_COLOR, // purple-ish border
          borderBottomWidth: 2,
          elevation: 0,
        } as any,
        headerTitleStyle: {
          fontSize: 25,
          color: "#a079c6",
        },
        contentStyle: {
          backgroundColor: process.env.EXPO_PUBLIC_BG_COLOR || "#121212",
        },
        headerShown: false
      }}
    />
  );
}
