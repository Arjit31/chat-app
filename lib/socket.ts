let socket : WebSocket;

export const getSocket = () => {
  if (!socket) {
    socket = new WebSocket(process.env.EXPO_PUBLIC_WEBSOCKET_URL || "");
     socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }
  return socket;
};