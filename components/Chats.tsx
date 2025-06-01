import { debounce } from "@/lib/debounce";
import {
  fetchBroadcastMessages,
  fetchUnicastMessages,
} from "@/lib/fetchMessages";
import { refreshAccessToken } from "@/lib/refreshToken";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { messageType } from "@/types/Message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [messages, setMessages] = useState<messageType[]>([
    {
      id: "asdasd1",
      orderNo: 1,
      text: "Hey, how are you?",
      isSent: false,
      createdAt: "2025-04-23T08:30:15.366Z",
      serialNo: 0,
      username: "Rahul",
      userId: "-11",
    },
  ]);

  const saveMessagesDebounced = useRef(
    debounce((msgs: messageType[]) => {
      AsyncStorage.setItem(
        "@messages:" + type + ":" + userId + ":" + toUserId,
        JSON.stringify(msgs)
      );
    }, 500)
  ).current;

  function addNewItem(newMessages: messageType[]) {
    setMessages((prevMessages) => {
      const updatedList = [...prevMessages, ...newMessages];

      updatedList.sort((a, b) => {
        if (a.orderNo !== b.orderNo) {
          return a.orderNo - b.orderNo;
        } else {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      });

      return updatedList;
    });
  }

  async function fetchMessages() {
    try {
      let lastNo = 0;
      const storedMessages = await AsyncStorage.getItem(
        "@messages:" + type + ":" + userId + ":" + toUserId
      );
      if (storedMessages !== null) {
        const parsed: messageType[] = JSON.parse(storedMessages);
        setMessages(parsed);
        lastNo = parsed.reduce(
          (previousValue, currentValue) =>
            Math.max(previousValue, currentValue.serialNo),
          messages[0].serialNo
        );
      }
      let res;
      if (type === "Personal") {
        const toUser = toUserId + "";
        // console.log(toUser, toUserId)
        res = await fetchUnicastMessages({ lastNo, toUserId: toUser });
      } else {
        console.log(type);
        res = await fetchBroadcastMessages({ lastNo, type });
      }
      const fetchedMessages: messageType[] = res.data;

      // console.log("transformedMessages", transformedMessages);

      addNewItem(fetchedMessages);
    } catch (error) {
      const flag = await refreshAccessToken();
      if (!flag) {
        setLogin(false);
      } else {
        fetchMessages();
      }
      console.log("fetch error:", error);
    }
  }

  async function setWebSocket() {
    websocket.current = await getSocket(isLogin);
    websocket.current.onmessage = (event) => {
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
        console.log(listItem);
        addNewItem([listItem]);
      }
    };
  }

  useFocusEffect(
    useCallback(() => {
      async function onMountEvents() {
        // console.log("inside effect", toUserId, type);
        await fetchMessages();
        await setWebSocket();
      }
      if (isLogin) onMountEvents();
    }, [isLogin, toUserId, type])
  );

  useEffect(() => {
    // flatListRef.current?.scrollToEnd({ animated: true });
    saveMessagesDebounced(messages);
  }, [messages]);

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
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />
    </View>
  );
}
