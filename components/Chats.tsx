import {
  addWebSocketMessage,
  loadInitialMessages,
  loadMoreNewMessages,
  loadMoreOldMessages
} from "@/lib/loadMessages";
import { getSocket } from "@/lib/socket";
import { createMessagesTable } from "@/lib/sqlite/broadcastStorage";
import { createMessagesTableUnicast } from "@/lib/sqlite/unicastStorage";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { messageType } from "@/types/Message";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import type { FlatList as FlatListType } from "react-native";
import { FlatList, View } from "react-native";
import ChatBubble from "./ChatBubbles";

export function Chats({
  type,
  toUserId,
}: {
  type: "Anonymous" | "Reveal" | "Personal";
  toUserId?: string;
}) {
  const { isLogin, setLogin } = useAuthStore();
  const { userId, setUserId } = useUserStore();
  const flatListRef = useRef<FlatListType<any>>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const websocket = useRef<WebSocket>(null);
  const [isInitialSyncComplete, setIsInitialSyncComplete] = useState(false);
  const [maxLastSerialNo, setMaxLastSerialNo] = useState(0);
  const [lastSerialNo, setLastSerialNo] = useState(0);
  
  const [messages, setMessages] = useState<messageType[]>([]);

  async function setWebSocket() {
    websocket.current = await getSocket(isLogin) as WebSocket;
    websocket.current.onmessage = async (event) => {
      // console.log("Received: " + event.data);
      const obj = JSON.parse(event.data);
      console.log(obj);
      console.log(type, obj.success, obj.type);
      
      if (obj.success && obj.type === type) {
        const listItem = {
          id: obj.id,
          orderNo: obj.orderNo,
          serialNo: obj.serialNo,
          text: obj.text,
          createdAt: obj.createdAt,
          isSent: obj.isSent,
          username: obj.username,
          userId: obj.userId,
        };
        console.log("got message");
        console.log("listItem", listItem);
        
        await addWebSocketMessage({
          message: listItem,
          type,
          userId,
          toUserId,
          maxLastSerialNo,
          setMaxLastSerialNo,
          lastSerialNo,
          setLastSerialNo,
          setMessages
        });
      }
    };
  }

  useFocusEffect(
    useCallback(() => {
      async function onMountEvents() {
        try {
          setMessages([])
          createMessagesTable();
          createMessagesTableUnicast();
          
          console.log("Starting initial load...");
          console.log(toUserId);
          
          await loadInitialMessages({
            type,
            userId,
            toUserId,
            setMessages,
            setHasMore,
            setLastSerialNo,
            setMaxLastSerialNo
          });
          
          setIsInitialSyncComplete(true);
          console.log("Initial sync complete");
          
          await setWebSocket();
          
        } catch (error) {
          console.error("onMountEvents error:", error);
        }
      }
      
      if (isLogin) {
        setIsInitialSyncComplete(false);
        onMountEvents();
      }
    }, [isLogin, toUserId, type])
  );

  return (
    <View style={{ width: "100%", flex: 1, justifyContent: "flex-end" }}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={5}
        renderItem={({ item }) => (
          <ChatBubble
            message={item.text}
            isSent={item.isSent}
            username={item.username}
            type={type}
            key={item.id}
            userId={item.userId}
          />
        )}
        // contentContainerStyle={{ padding: 10 }}
        onEndReached={() => {
          loadMoreOldMessages({
            loadingMore,
            hasMore,
            setHasMore,
            setLoadingMore,
            messages,
            setMessages,
            type,
            toUserId,
            userId,
            setLastSerialNo,
            setMaxLastSerialNo
          });
        }}
        onStartReached={() => {
          loadMoreNewMessages({
            loadingMore,
            hasMore,
            setHasMore,
            setLoadingMore,
            messages,
            setMessages,
            type,
            toUserId,
            userId,
            setLastSerialNo,
            setMaxLastSerialNo
          });
        }}
        onEndReachedThreshold={0.1}
        onStartReachedThreshold={0.1}
        // onContentSizeChange={() =>
        //   flatListRef.current?.scrollToEnd({ animated: true })
        // }
        inverted={true}
      />
    </View>
  );
}