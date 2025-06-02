import { messageType } from "@/types/Message";
// UPDATED: Removed AsyncStorage import, added SQLite functions
import {
  getLastSerialNoFromDB,
  getTotalMessagesCount,
  loadMessagesFromDB,
  loadNewerMessagesFromDB,
  loadOlderMessagesFromDB,
  saveMessagesToDB,
} from "@/lib/sqlite/broadcastStorage";
import {
  getLastSerialNoFromDBUnicast,
  getTotalMessagesCountUnicast,
  loadMessagesFromDBUnicast,
  loadNewerMessagesFromDBUnicast,
  loadOlderMessagesFromDBUnicast,
  saveMessagesToDBUnicast,
} from "@/lib/sqlite/unicastStorage";
import { fetchBroadcastMessages, fetchUnicastMessages } from "./fetchMessages";

const MESSAGES_LIMIT = 15;
const MEMORY_LIMIT = 30;

export function addNewItem({
  newMessages,
  setMessages,
  orderType,
  setMaxLastSerialNo,
  setLastSerialNo,
}: {
  newMessages: messageType[];
  setMessages: (value: React.SetStateAction<messageType[]>) => void;
  orderType: string;
  setMaxLastSerialNo: React.Dispatch<React.SetStateAction<number>>;
  setLastSerialNo: React.Dispatch<React.SetStateAction<number>>;
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
    updatedList.sort((a, b) => {
      if (a.orderNo !== b.orderNo) {
        return b.orderNo - a.orderNo;
      } else {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    });
    const trimmedList =
    orderType === "new" || orderType === "initial"
    ? updatedList.slice(0, MEMORY_LIMIT)
    : updatedList.slice(-MEMORY_LIMIT);
    const serialNo =
    trimmedList.length > 0
    ? Math.max(...trimmedList.map((m) => m.serialNo))
    : 0;
    // console.log(trimmedList);
    setLastSerialNo(serialNo);
    setMaxLastSerialNo((prevNum) => Math.max(prevNum, serialNo));
    // console.log(trimmedList);
    return trimmedList;
  });
}

export async function loadInitialMessages({
  type,
  userId,
  toUserId,
  setMessages,
  setHasMore,
  setMaxLastSerialNo,
  setLastSerialNo,
}: {
  type: "Anonymous" | "Reveal" | "Personal";
  userId: string;
  toUserId: string | undefined;
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  setMaxLastSerialNo: React.Dispatch<React.SetStateAction<number>>;
  setLastSerialNo: React.Dispatch<React.SetStateAction<number>>;
}) {
  try {
    const lastSerialNo =
      type === "Personal"
        ? await getLastSerialNoFromDBUnicast(type, userId, toUserId)
        : await getLastSerialNoFromDB(type);
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
      type === "Personal"
        ? await saveMessagesToDBUnicast(type, userId, toUserId, fetchedMessages)
        : await saveMessagesToDB(type, toUserId, fetchedMessages);

      console.log("Saved all fetched messages to SQLite");
    }

    const messagesForDisplay =
      type === "Personal"
        ? await loadMessagesFromDBUnicast(
            type,
            userId,
            toUserId,
            MESSAGES_LIMIT
          )
        : await loadMessagesFromDB(MESSAGES_LIMIT, type);
    // console.log(messagesForDisplay);
    addNewItem({
      newMessages: messagesForDisplay,
      setMessages,
      orderType: "initial",
      setLastSerialNo,
      setMaxLastSerialNo,
    });

    const totalMessagesInDB =
      type === "Personal"
        ? await getTotalMessagesCountUnicast(type, userId, toUserId)
        : await getTotalMessagesCount(type);
    console.log(totalMessagesInDB, MEMORY_LIMIT);
    // setHasMore(totalMessagesInDB > MESSAGES_LIMIT);

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
  setMaxLastSerialNo,
  setLastSerialNo,
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
  setMaxLastSerialNo: React.Dispatch<React.SetStateAction<number>>;
  setLastSerialNo: React.Dispatch<React.SetStateAction<number>>;
}) {
  console.log("end reached", loadingMore, hasMore);
  if (loadingMore) return;

  setLoadingMore(true);

  try {
    // Get oldest serialNo from current state (not DB)
    const oldestSerialNo =
      messages.length > 0 ? Math.min(...messages.map((m) => m.serialNo)) : 0;

    const olderMessagesFromDB =
      type === "Personal"
        ? await loadOlderMessagesFromDBUnicast(
            type,
            userId,
            toUserId,
            oldestSerialNo,
            MESSAGES_LIMIT
          )
        : await loadOlderMessagesFromDB(type, oldestSerialNo, MESSAGES_LIMIT);

        if (olderMessagesFromDB.length === 0) {
          setHasMore(false);
        } else {
      // console.log(oldestSerialNo, olderMessagesFromDB.length)
      addNewItem({
        newMessages: olderMessagesFromDB,
        setMessages,
        orderType: "old",
        setLastSerialNo,
        setMaxLastSerialNo,
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
  setMaxLastSerialNo,
  setLastSerialNo,
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
  setMaxLastSerialNo: React.Dispatch<React.SetStateAction<number>>;
  setLastSerialNo: React.Dispatch<React.SetStateAction<number>>;
}) {
  console.log("start reached", loadingMore);
  if (loadingMore) return;

  setLoadingMore(true);

  try {
    // Get oldest serialNo from current state (not DB)
    const lastSerialNo =
      messages.length > 0 ? Math.max(...messages.map((m) => m.serialNo)) : 0;
    console.log(lastSerialNo);

    const nextMessagesFromDB =
      type === "Personal"
        ? await loadNewerMessagesFromDBUnicast(
            type,
            userId,
            toUserId,
            lastSerialNo,
            MESSAGES_LIMIT
          )
        : await loadNewerMessagesFromDB(type, lastSerialNo, MESSAGES_LIMIT);

    if (nextMessagesFromDB.length === 0) {
      setLastSerialNo(lastSerialNo);
    setMaxLastSerialNo((prevNum) => Math.max(prevNum, lastSerialNo));
      console.log("no new message");
      // setHasMore(false);
    } else {
      addNewItem({
        newMessages: nextMessagesFromDB,
        setMessages,
        orderType: "new",
        setLastSerialNo,
        setMaxLastSerialNo,
      });
    }
  } catch (error) {
    console.error("loadMoreMessages error", error);
  }

  setLoadingMore(false);
}

export async function addWebSocketMessage({
  message,
  type,
  userId,
  toUserId,
  maxLastSerialNo,
  lastSerialNo,
  setMaxLastSerialNo,
  setLastSerialNo,
  setMessages,
}: {
  message: messageType;
  type: "Anonymous" | "Reveal" | "Personal";
  userId: string;
  toUserId: string | undefined;
  maxLastSerialNo: number;
  setMaxLastSerialNo: React.Dispatch<React.SetStateAction<number>>;
  lastSerialNo: number;
  setLastSerialNo: React.Dispatch<React.SetStateAction<number>>;
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
}) {
  try {
    console.log(message);
    type === "Personal"
      ? await saveMessagesToDBUnicast(type, userId, toUserId, [message])
      : await saveMessagesToDB(type, toUserId, [message]);
    console.log("serial No", lastSerialNo, maxLastSerialNo);
    if (lastSerialNo === maxLastSerialNo) {
      // console.log(lastSerialNo, maxLastSerialNo)
      const newMessages =
        type === "Personal"
          ? await loadMessagesFromDBUnicast(type, userId, toUserId, 1)
          : await loadMessagesFromDB(1, type);
      console.log(newMessages);
      addNewItem({
        newMessages,
        setMessages,
        orderType: "new",
        setLastSerialNo,
        setMaxLastSerialNo,
      });
    }
  } catch (error) {
    console.error("addWebSocketMessage error", error);
  }
}
