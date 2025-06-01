import { messageType } from "@/types/Message";
// UPDATED: Removed AsyncStorage import, added SQLite functions
import {
  getLastSerialNoFromDB,
  getTotalMessagesCount,
  loadMessagesFromDB,
  loadNewerMessagesFromDB,
  loadOlderMessagesFromDB,
  saveMessagesToDB,
} from "@/lib/sqlite";
import { fetchBroadcastMessages, fetchUnicastMessages } from "./fetchMessages";

const MESSAGES_LIMIT = 200;
const MEMORY_LIMIT = 400;

export function addNewItem({
  newMessages,
  setMessages,
  orderType,
}: {
  newMessages: messageType[];
  setMessages: (value: React.SetStateAction<messageType[]>) => void;
  orderType: string;
}) {
  setMessages((prevMessages) => {
    let updatedList =
      orderType === "new"
        ? [...prevMessages, ...newMessages]
        : orderType === "initial"
        ? [...newMessages]
        : [...newMessages, ...prevMessages];

    const uniqueMap = new Map<string | number, messageType>();
    for (const msg of updatedList) {
      uniqueMap.set(msg.id, msg);
    }
    updatedList = Array.from(uniqueMap.values());
    const trimmedList =
      orderType === "new" || orderType === "initial"
        ? updatedList.slice(-MEMORY_LIMIT)
        : updatedList.slice(0, MEMORY_LIMIT);
    trimmedList.sort((a, b) => {
      if (a.orderNo !== b.orderNo) {
        return b.orderNo - a.orderNo;
      } else {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    });
    return trimmedList;
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
  toUserId: string | undefined;
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  try {
    const lastSerialNo = await getLastSerialNoFromDB(type, userId, toUserId);
    console.log("Last serialNo in DB:", lastSerialNo);

    const res =
      type === "Personal"
        ? await fetchUnicastMessages({
            lastNo: lastSerialNo,
            toUserId: toUserId + "",
            limit: -1,
          })
        : await fetchBroadcastMessages({
            lastNo: lastSerialNo,
            type,
            limit: -1,
          });

    const fetchedMessages: messageType[] = res.data;
    console.log("Fetched messages count:", fetchedMessages.length);

    if (fetchedMessages.length > 0) {
      await saveMessagesToDB(type, userId, toUserId, fetchedMessages);
      console.log("Saved all fetched messages to SQLite");
    }

    const messagesForDisplay = await loadMessagesFromDB(
      type,
      userId,
      toUserId,
      MESSAGES_LIMIT
    );
    console.log(messagesForDisplay);
    addNewItem({
      newMessages: messagesForDisplay,
      setMessages,
      orderType: "initial",
    });

    const totalMessagesInDB = await getTotalMessagesCount(
      type,
      userId,
      toUserId
    );
    setHasMore(totalMessagesInDB > MESSAGES_LIMIT);

    console.log("Loaded", messagesForDisplay.length, "messages for display");
  } catch (error) {
    console.error("loadInitialMessages error", error);
  }
}

export async function loadMoreOldMessages({
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
  toUserId: string | undefined;
  userId: string;
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
}) {
  if (loadingMore || !hasMore) return;

  setLoadingMore(true);

  try {
    // Get oldest serialNo from current state (not DB)
    const oldestSerialNo =
      messages.length > 0 ? Math.min(...messages.map((m) => m.serialNo)) : 0;

    const olderMessagesFromDB = await loadOlderMessagesFromDB(
      type,
      userId,
      toUserId,
      oldestSerialNo,
      MESSAGES_LIMIT
    );

    if (olderMessagesFromDB.length === 0) {
      setHasMore(false);
    } else {
      addNewItem({
        newMessages: olderMessagesFromDB,
        setMessages,
        orderType: "old",
      });
      setMessages((prev) => {
        const combined = [...olderMessagesFromDB, ...prev];
        return combined.length > MEMORY_LIMIT
          ? combined.slice(0, MEMORY_LIMIT)
          : combined;
      });
    }
  } catch (error) {
    console.error("loadMoreMessages error", error);
  }

  setLoadingMore(false);
}

export async function loadMoreNewMessages({
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
  toUserId: string | undefined;
  userId: string;
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
}) {
  if (loadingMore || !hasMore) return;

  setLoadingMore(true);

  try {
    // Get oldest serialNo from current state (not DB)
    const lastSerialNo =
      messages.length > 0 ? Math.max(...messages.map((m) => m.serialNo)) : 0;

    const nextMessagesFromDB = await loadNewerMessagesFromDB(
      type,
      userId,
      toUserId,
      lastSerialNo,
      MESSAGES_LIMIT
    );

    if (nextMessagesFromDB.length === 0) {
      setHasMore(false);
    } else {
      addNewItem({
        newMessages: nextMessagesFromDB,
        setMessages,
        orderType: "new",
      });
    }
  } catch (error) {
    console.error("loadMoreMessages error", error);
  }

  setLoadingMore(false);
}

// UPDATED: New function to add single WebSocket message
export async function addWebSocketMessage({
  message,
  type,
  userId,
  toUserId,
}: {
  message: messageType;
  type: "Anonymous" | "Reveal" | "Personal";
  userId: string;
  toUserId: string | undefined;
}) {
  try {
    await saveMessagesToDB(type, userId, toUserId, [message]);
  } catch (error) {
    console.error("addWebSocketMessage error", error);
  }
}
