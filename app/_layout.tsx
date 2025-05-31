import { refreshAccessToken, refreshAllToken } from "@/lib/refreshToken";
import { setLoginStatus } from "@/lib/setLoginStatus";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const {isLogin, setLogin} = useAuthStore();
  const {userId, setUserId} = useUserStore();

  useEffect(() => {
    const init = async () => {
      try {
        const flag = await refreshAllToken()
        console.log(flag);
        if(flag){
          if(isLogin == false) await setLoginStatus(true, setLogin, setUserId);
        }
        else{
          console.log("refresh failed")
          if(isLogin) await setLoginStatus(false, setLogin, setUserId);
        }
      } catch (error) {
        console.log(error);
      }
      SplashScreen.hideAsync();
    };
    init();

    const interval = setInterval(async () => {
      const flag = await refreshAccessToken();
      console.log("token refreshed")
      if(!flag && isLogin){
        setLogin(false);
      }
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(interval);
  }, []);

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
