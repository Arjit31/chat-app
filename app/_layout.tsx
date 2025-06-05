import ErrorBoundary from "@/components/ErrorBoundary";
import { refreshAccessToken, refreshAllToken } from "@/lib/refreshToken";
import { setLoginStatus } from "@/lib/setLoginStatus";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";

console.log("root layout reached");

export default function RootLayout() {
  const { isLogin, setLogin } = useAuthStore();
  const { userId, setUserId } = useUserStore();
  const [isOnline, setIsOnline] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  
  useEffect(() => {
    let unsubscribeNetInfo: (() => void) | undefined;
    let interval: any;
    
    const initializeApp = async () => {
      await SplashScreen.preventAutoHideAsync();
      try {
        // Set up network listener
        unsubscribeNetInfo = NetInfo.addEventListener((state) => {
          const online = state.isConnected && state.isInternetReachable;
          setIsOnline(!!online);
        });

        console.log("Starting initialization...");

        // Get initial network state
        const netState = await NetInfo.fetch();
        const currentlyOnline = netState.isConnected && netState.isInternetReachable;
        setIsOnline(!!currentlyOnline);

        const storedLoginStatus = await AsyncStorage.getItem("loginStatus");
        console.log("Stored login status:", storedLoginStatus);

        if (currentlyOnline) {
          console.log("Online - refreshing tokens...");
          const flag = await refreshAllToken();
          console.log("Token refresh result:", flag);

          if (flag) {
            if (!isLogin) {
              console.log("Setting login to true");
              await setLoginStatus(true, setLogin, setUserId);
            }
          } else {
            if (isLogin) {
              console.log("Setting login to false");
              await setLoginStatus(false, setLogin, setUserId);
            }
          }
        } else {
          console.log("Offline - using stored login status");
          const login = storedLoginStatus === "true";
          await setLoginStatus(login, setLogin, setUserId);
        }

        // Set up token refresh interval
        interval = setInterval(async () => {
          try {
            if (!isOnline) return;

            const flag = await refreshAccessToken();
            const netStatus = await NetInfo.fetch();

            if (!(netStatus.isConnected && netStatus.isInternetReachable)) return;

            console.log("Token refresh attempt");

            if (!flag && isLogin) {
              await setLoginStatus(false, setLogin, setUserId);
            }
          } catch (error) {
            console.error("Error in token refresh interval:", error);
          }
        }, 14 * 60 * 1000); // every 14 minutes

        console.log("Initialization complete");
        setIsInitialized(true);
        
        // Add a small delay to ensure state updates are complete
        // This is especially important in production builds
        setTimeout(() => {
          setAuthResolved(true);
        }, 100);
        
      } catch (error) {
        console.error("Initialization error:", error);
        setIsInitialized(true);
        setAuthResolved(true);
      }
    };

    initializeApp();

    // Cleanup function
    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (unsubscribeNetInfo) {
        unsubscribeNetInfo();
      }
    };
  }, []);

  // Hide splash screen only when auth is resolved
  useEffect(() => {
    if (authResolved && isInitialized) {
      
      SplashScreen.hideAsync();
      if (isLogin) {
      router.replace("/(main)");
    } else {
      router.replace("/(auth)");
    }
    }
  }, [authResolved, isInitialized, isLogin]);

  // Don't render anything until both initialization and auth are resolved
  if (!isInitialized || !authResolved) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
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
      
    </GestureHandlerRootView>
  );
}