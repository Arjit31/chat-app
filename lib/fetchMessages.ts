import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export async function fetchBroadcastMessages({
  lastNo,
  type,
  limit
}: {
  lastNo: number;
  type: "Anonymous" | "Reveal";
  limit: number
}) {
  const accessToken = await AsyncStorage.getItem("@token:accessToken");
  const res = await axios.get(
    process.env.EXPO_PUBLIC_BACKEND_URL + "/api/v1/broadcast/fetch-broadcast",
    {
      params: {
        lastNo: lastNo,
        type: type,
        limit: limit
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
  limit
}: {
  lastNo: number;
  toUserId: string;
  limit: number
}) {
  const accessToken = await AsyncStorage.getItem("@token:accessToken");
  console.log(lastNo, toUserId);
  const res = await axios.get(
    process.env.EXPO_PUBLIC_BACKEND_URL + "/api/v1/unicast/fetch-unicast",
    {
      params: {
        lastNo: lastNo,
        toUserId: toUserId,
        limit: limit
      },
      headers: {
        Authorization: accessToken,
      },
    }
  );
  return res;
}