let socket : WebSocket;
import AsyncStorage from "@react-native-async-storage/async-storage";

async function onConnectionMessage(){
  const connectionToken = await AsyncStorage.getItem("@token:connectionToken");
  console.log(connectionToken);
  const sendObj = {
    category: "connection",
    connectionToken: connectionToken
  }
  return JSON.stringify(sendObj);
}

export async function getSocket(isLogin: boolean){
  if (!socket && isLogin) {
    socket = new WebSocket(process.env.EXPO_PUBLIC_WEBSOCKET_URL || "");
     socket.onopen = async () => {
      console.log("WebSocket connection established");
      const sendMessage = await onConnectionMessage();
      socket.send(sendMessage); 
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