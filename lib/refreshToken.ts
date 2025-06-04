import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as SecureStore from "expo-secure-store";


export async function refreshAccessToken() : Promise<boolean> {
  console.log("at refresh access")
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  // console.log(refreshToken)
  
  try {
    if (!refreshToken){
      throw new Error("No refresh token")
    }
    const res = await axios.put(
      process.env.EXPO_PUBLIC_BACKEND_URL + "/api/v1/auth/refreshAccessToken",
      {
        refreshToken,
      }
    );
    if (!res.data.success) {
      throw new Error("Invalid Refresh Token");
    }
    await AsyncStorage.setItem("@token:accessToken", res.data.accessToken);
    return true;
  } catch (err) {
    console.log("Token refresh failed", err);
    // await SecureStore.deleteItemAsync("refreshToken");
    return false;
  }
}

export async function refreshAllToken()  : Promise<boolean> {
  console.log("at refresh all")
  const refreshToken = await SecureStore.getItemAsync("refreshToken")
  // console.log(refreshToken)
  
  try {
    if (!refreshToken){
      throw new Error("No refresh token")
    }
    // console.log(refreshToken)
    const res = await axios.put(
      process.env.EXPO_PUBLIC_BACKEND_URL + "/api/v1/auth/refreshTokens",
      {
        refreshToken,
      }
    );
    // console.log(res);
    if (!res.data.success) {
      throw new Error("Invalid Refresh Token");
    }
    await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);
    await AsyncStorage.setItem("@token:accessToken", res.data.accessToken);
    await AsyncStorage.setItem(
      "@token:connectionToken",
      res.data.connectionToken
    );
    return true;
  } catch (err) {
    console.log("Token refresh failed", err);
    // await SecureStore.deleteItemAsync("refreshToken");
    return false;
  }
}
