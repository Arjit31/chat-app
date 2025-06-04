import { refreshAccessToken, refreshAllToken } from "@/lib/refreshToken";
import { setLoginStatus } from "@/lib/setLoginStatus";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log("root layout reached")
  const {isLogin, setLogin} = useAuthStore();
  const {userId, setUserId} = useUserStore();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(!!online);
    });
    
    const init = async () => {
      try {
        const storedLoginStatus = await AsyncStorage.getItem("loginStatus");

        if (isOnline) {
          const flag = await refreshAllToken();

          const netStatus = await NetInfo.fetch();
          if (!(netStatus.isConnected && netStatus.isInternetReachable)){
            const login = storedLoginStatus === "true";
            setLoginStatus(login, setLogin, setUserId);
            return;
          }

          if (flag) {
            if (!isLogin) await setLoginStatus(true, setLogin, setUserId);
          } else {
            if (isLogin) await setLoginStatus(false, setLogin, setUserId);
          }
        } else {
          console.log("no internet")
          const login = storedLoginStatus === "true";
          setLoginStatus(login, setLogin, setUserId);
        }
      } catch (error) {
        console.log(error);
      }
      SplashScreen.hideAsync();
    };
    init();

    const interval = setInterval(async () => {
      if (!isOnline) return;

      const flag = await refreshAccessToken();

      const netStatus = await NetInfo.fetch();
      if (!(netStatus.isConnected && netStatus.isInternetReachable)) return;

      console.log("Token refresh attempt");

      if (!flag && isLogin) {
        await setLoginStatus(false, setLogin, setUserId);
      }
    }, 14 * 60 * 1000); // every 14 minutes

    return () =>  {
      clearInterval(interval);
      unsubscribeNetInfo();
    };
  }, [isOnline]);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(main)"
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: process.env.EXPO_PUBLIC_BG_COLOR,
            },
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: process.env.EXPO_PUBLIC_BG_COLOR,
            },
          }}
        />
      </Stack>
      {isLogin ? <Redirect href={"/(main)"} /> : <Redirect href={"/(auth)"} />}
    </>
  );
}
