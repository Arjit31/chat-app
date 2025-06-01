import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export async function fetchBroadcastMessages({
  lastNo,
  type,
}: {
  lastNo: number;
  type: "Anonymous" | "Reveal";
}) {
  const accessToken = await AsyncStorage.getItem("@token:accessToken");
  const res = await axios.get(
    process.env.EXPO_PUBLIC_BACKEND_URL + "/api/v1/broadcast/fetch-broadcast",
    {
      params: {
        lastNo: lastNo,
        type: type,
      },
      headers: {
        Authorization: accessToken,
      },
    }
  );
  return res;
}

export async function fetchUnicastMessages({
  lastNo,
  toUserId,
}: {
  lastNo: number;
  toUserId: string;
}) {
  const accessToken = await AsyncStorage.getItem("@token:accessToken");
  console.log(lastNo, toUserId);
  const res = await axios.get(
    process.env.EXPO_PUBLIC_BACKEND_URL + "/api/v1/unicast/fetch-unicast",
    {
      params: {
        lastNo: lastNo,
        toUserId: toUserId,
      },
      headers: {
        Authorization: accessToken,
      },
    }
  );
  return res;
}