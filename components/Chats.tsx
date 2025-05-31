import { debounce } from "@/lib/debounce";
import { refreshAccessToken } from "@/lib/refreshToken";
// import { setLoginStatus } from "@/lib/setLoginStatus";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
// import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FlatList as FlatListType } from "react-native";
import { FlatList, View } from "react-native";
import ChatBubble from "./ChatBubbles";


type messageType = {
  id: string;
  orderNo: number;
  text: string;
  isSent: boolean;
  createdAt: string;
  serialNo: number;
  username: string;
};

export function Chats({ type }: { type: "Anonymous" | "Reveal" }) {
  const {isLogin, setLogin} = useAuthStore();
  const flatListRef = useRef<FlatListType<any>>(null);
  const websocket = useRef<WebSocket>(null);
    const {userId, setUserId} = useUserStore();
  const [messages, setMessages] = useState<messageType[]>([
    {
      id: "asdasd1",
      orderNo: 1,
      text: "Hey, how are you?",
      isSent: false,
      createdAt: "2025-04-23T08:30:15.366Z",
      serialNo: 0,
      username: "Rahul",
    },
  ]);

  const saveMessagesDebounced = useRef(
    debounce((msgs: messageType[]) => {
      AsyncStorage.setItem("@messages:" + type + ":" + userId, JSON.stringify(msgs));
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
      const storedMessages = await AsyncStorage.getItem("@messages:" + type + ":" + userId);
      if (storedMessages !== null) {
        const parsed: messageType[] = JSON.parse(storedMessages);
        setMessages(parsed);
        lastNo = parsed.reduce(
          (previousValue, currentValue) =>
            Math.max(previousValue, currentValue.serialNo),
          messages[0].serialNo
        );
      }
      const accessToken = await AsyncStorage.getItem("@token:accessToken");
      const res = await axios.get(
        process.env.EXPO_PUBLIC_BACKEND_URL + "/api/v1/broadcast/fetch-broadcast",
        {
          params: {
            lastNo: lastNo,
            type: type,
            userId: "4d5642f0-033a-4b58-83cc-ba99eea72ddf",
          },
          headers: {
            Authorization: accessToken
          }
        }
      );

      const fetchedMessages: messageType[] = res.data;

      // console.log("transformedMessages", transformedMessages);

      addNewItem(fetchedMessages);
    } catch (error) {
      const flag = await refreshAccessToken();
      if(!flag){
        setLogin(false);
      }
      console.log("fetch error:", error);
    }
  }

  async function setWebSocket() {
    websocket.current = await getSocket();
    websocket.current.onmessage = (event) => {
      // console.log("Received: " + event.data);
      const obj = JSON.parse(event.data);
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
        };
        // console.log(listItem)

        addNewItem([listItem]);
      }
    };
  }

  useFocusEffect(
    
    useCallback(() => {
      async function onMountEvents() {
        await fetchMessages();
        await setWebSocket();
        // if(type === "Reveal"){
        //   await SecureStore.deleteItemAsync("refreshToken")
        //   await setLoginStatus(false, setLogin, setUserId);
        // }
      }
      if(isLogin) onMountEvents();
    }, [isLogin])
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
        renderItem={({ item }) => (
          <ChatBubble
            message={item.text}
            isSent={item.isSent}
            username={item.username}
            type={type}
            key={item.id}
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
