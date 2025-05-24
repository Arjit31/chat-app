import { debounce } from "@/lib/debounce";
import { getSocket } from "@/lib/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
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
};

export function Chats({ type }: { type: "Anonymous" | "Reveal" }) {
  const flatListRef = useRef<FlatListType<any>>(null);
  const websocket = useRef<WebSocket>(null);
  const [messages, setMessages] = useState<messageType[]>([
    {
      id: "asdasd1",
      orderNo: 1,
      text: "Hey, how are you?",
      isSent: false,
      createdAt: "2025-04-23T08:30:15.366Z",
      serialNo: 0,
    },
  ]);

  const saveMessagesDebounced = useRef(
    debounce((msgs: messageType[]) => {
      AsyncStorage.setItem("@messages" + type, JSON.stringify(msgs));
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
      const storedMessages = await AsyncStorage.getItem("@messages" + type);
      if (storedMessages !== null) {
        const parsed: messageType[] = JSON.parse(storedMessages);
        setMessages(parsed);
        lastNo = parsed.reduce(
          (previousValue, currentValue) =>
            Math.max(previousValue, currentValue.serialNo),
          messages[0].serialNo
        );
      }
      const res = await axios.get(
        process.env.EXPO_PUBLIC_BACKEND_URL + "/fetch-broadcast",
        {
          params: {
            lastNo: lastNo,
            type: type,
            userId: "4d5642f0-033a-4b58-83cc-ba99eea72ddf",
          },
        }
      );

      const fetchedMessages: messageType[] = res.data;

      // console.log("transformedMessages", transformedMessages);

      addNewItem(fetchedMessages);
    } catch (error) {
      console.log(error);
    }
  }

  function setWebSocket() {
    websocket.current = getSocket();
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
        setWebSocket();
      }
      onMountEvents();
    }, [])
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
          <ChatBubble message={item.text} isSent={item.isSent} type={type}/>
        )}
        // contentContainerStyle={{ padding: 10 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />
    </View>
  );
}
