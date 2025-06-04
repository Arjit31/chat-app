let socket : WebSocket | null;
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshAllToken } from "./refreshToken";

async function onConnectionMessage(){
  const connectionToken = await AsyncStorage.getItem("@token:connectionToken");
  // console.log(connectionToken);
  const sendObj = {
    category: "connection",
    connectionToken: connectionToken
  }
  return JSON.stringify(sendObj);
}

export async function getSocket(isLogin: boolean){
  console.log("CHECK SOCKET STATUS", socket?.readyState, socket?.CLOSED)
  if ((!socket || socket.readyState === socket.CLOSED) && isLogin) {
    socket = new WebSocket(process.env.EXPO_PUBLIC_WEBSOCKET_URL || "");
    socket.onopen = async () => {
      console.log("WebSocket connection established");
      await refreshAllToken()
      const sendMessage = await onConnectionMessage();
      // console.log(sendMessage);
      if(socket) socket.send(sendMessage); 
    };

    socket.onclose = async() => {
      console.log("WebSocket connection closed");
      await AsyncStorage.setItem("socketReady", "false")
    };

    socket.onerror = async (error) => {
      console.error("WebSocket error:", error);
      await AsyncStorage.setItem("socketReady", "false")
    };
  }
  return socket;
};

export function assignNull(){
  socket = null;
}