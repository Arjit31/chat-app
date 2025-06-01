import { messageType } from "@/types/Message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBroadcastMessages, fetchUnicastMessages } from "./fetchMessages";

const MESSAGES_LIMIT = 200;

export function addNewItem({
  newMessages,
  setMessages,
}: {
  newMessages: messageType[];
  setMessages: (value: React.SetStateAction<messageType[]>) => void;
}) {
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

export async function loadInitialMessages({
  type,
  userId,
  toUserId,
  setMessages,
  setHasMore,
}: {
  type: "Anonymous" | "Reveal" | "Personal";
  userId: string;
  toUserId: string;
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  try {
    const storedMessages = await AsyncStorage.getItem(
      "@messages:" + type + ":" + userId + ":" + toUserId
    );
    if (storedMessages !== null) {
      const parsed: messageType[] = JSON.parse(storedMessages);
      setMessages(parsed);
      if (parsed.length < MESSAGES_LIMIT) setHasMore(false);
    } else {
      const res =
        type === "Personal"
          ? await fetchUnicastMessages({ lastNo: 0, toUserId: toUserId + "" })
          : await fetchBroadcastMessages({ lastNo: 0, type });

      const fetchedMessages: messageType[] = res.data;
      setMessages(fetchedMessages);
      await AsyncStorage.setItem(
        "@messages:" + type + ":" + userId + ":" + toUserId,
        JSON.stringify(fetchedMessages)
      );
      if (fetchedMessages.length < MESSAGES_LIMIT) setHasMore(false);
    }
  } catch (error) {
    console.error("loadInitialMessages error", error);
  }
}

export async function loadMoreMessages({
  loadingMore,
  hasMore,
  setHasMore,
  setLoadingMore,
  messages,
  setMessages,
  type,
  toUserId,
  userId,
}: {
  loadingMore: boolean;
  hasMore: boolean;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingMore: React.Dispatch<React.SetStateAction<boolean>>;
  messages: messageType[];
  type: "Anonymous" | "Reveal" | "Personal";
  toUserId: string;
  userId: string;
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
}) {
  if (loadingMore || !hasMore) return;

  setLoadingMore(true);
  const lastSerialNo = messages.length
    ? messages[messages.length - 1].serialNo
    : 0;

  try {
    const res =
      type === "Personal"
        ? await fetchUnicastMessages({
            lastNo: lastSerialNo,
            toUserId: toUserId + "",
          })
        : await fetchBroadcastMessages({ lastNo: lastSerialNo, type });

    const newMessages: messageType[] = res.data;

    if (newMessages.length === 0) {
      setHasMore(false);
    } else {
      addNewItem({ newMessages, setMessages });

      // Update AsyncStorage with appended messages
      const storedMessages = await AsyncStorage.getItem(
        "@messages:" + type + ":" + userId + ":" + toUserId
      );
      const currentStored = storedMessages ? JSON.parse(storedMessages) : [];
      const updatedStored = [...currentStored, ...newMessages];
      await AsyncStorage.setItem(
        "@messages:" + type + ":" + userId + ":" + toUserId,
        JSON.stringify(updatedStored)
      );

      if (newMessages.length < MESSAGES_LIMIT) setHasMore(false);
    }
  } catch (error) {
    console.error("loadMoreMessages error", error);
  }
  setLoadingMore(false);
}
