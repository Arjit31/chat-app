import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";
import { setLoginStatus } from "./setLoginStatus";

async function setTokens(res: AxiosResponse<any, any>) {
  await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);
  await AsyncStorage.setItem("@user:name", res.data.name);
  await AsyncStorage.setItem("@user:id", res.data.id);
  await AsyncStorage.setItem("@token:accessToken", res.data.accessToken);
  await AsyncStorage.setItem(
    "@token:connectionToken",
    res.data.connectionToken
  );
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  console.log("refreshToken", refreshToken);
}

export async function signup({
  username,
  password,
  coolName,
  setLogin,
  setUserId
}: {
  username: string;
  password: string;
  coolName: string;
  setLogin: (val: boolean) => void;
  setUserId: (val: string) => void;
}) {
  try {
    // console.log("Sending signup request...");
    const res = await axios.post(
      process.env.EXPO_PUBLIC_BACKEND_URL + "/api/v1/auth/signup",
      {
        username: username,
        password: password,
        name: coolName,
      }
    );

    if (res.data.success) {
      await setTokens(res);
      await setLoginStatus(true, setLogin, setUserId);
    } else {
      console.log("Signup failed:", res.data.status, res.data.message);
    }
  } catch (err) {
    console.log("Signup error:", err);
  }
}

export async function signin({
  username,
  password,
  setLogin,
  setUserId
}: {
  username: string;
  password: string;
  setLogin: (val: boolean) => void;
  setUserId: (val: string) => void;

}) {
  try {
    // console.log("Sending signin request...");
    const res = await axios.post(
      process.env.EXPO_PUBLIC_BACKEND_URL + "/api/v1/auth/signin",
      {
        username: username,
        password: password,
      }
    );

    if (res.data.success) {
      await setTokens(res);
      await setLoginStatus(true, setLogin, setUserId);
    } else {
      console.log("Signup failed:", res.data.status, res.data.message);
    }
  } catch (err) {
    console.log("Signup error:", err);
  }
}
