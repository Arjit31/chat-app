import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const [isLogin, setLogin] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync()
  }, []);


  return (
    <>
    <StatusBar style="light" />
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(main)" options={{ headerShown: false, headerStyle: {
          backgroundColor: "#2a2a2a"
        } }} />
      </Stack>
      {isLogin ? (
        <Redirect href={"/(auth)"} />
      ) : (
        <Redirect href={"/(main)"} />
      )}
    </>
  );
}
