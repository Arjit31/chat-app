import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setLoginStatus(
  target: boolean,
  setLogin: (val: boolean) => void,
  setUserId: (val: string) => void,
) {
  setLogin(target);
  await AsyncStorage.setItem("loginStatus", "" + target);
  await AsyncStorage.setItem("socketReady", "" + target);
  const userId = await AsyncStorage.getItem("@user:id");
  setUserId(userId + "");
}
