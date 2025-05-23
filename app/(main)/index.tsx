import { Card } from "@/components/Card";
import { ChatBubble } from "@/components/ChatBubbles";
import { TextBox } from "@/components/Textbox";
import { useEffect, useRef, useState } from "react";
import type { FlatList as FlatListType } from "react-native";
import { FlatList, View } from "react-native";

export default function Index() {

  const flatListRef = useRef<FlatListType<any>>(null);

  const [messages, setMessages] = useState([
    { id: '1', text: "Hey, how are you?", isSent: false },
    { id: '2', text: "I'm good, you?", isSent: true },
    { id: '3', text: "Hey, how are you?", isSent: false },
    { id: '4', text: "I'm good, you?", isSent: true },
    { id: '5', text: "Hey, how are you?", isSent: false },
    { id: '6', text: "I'm good, you?", isSent: true },
    { id: '7', text: "Hey, how are you?", isSent: false },
    { id: '8', text: "I'm good, you?", isSent: true },
    { id: '9', text: "Hey, how are you?", isSent: false },
    { id: '10', text: "I'm good, you?", isSent: true },
    { id: '11', text: "Hey, how are you?", isSent: false },
    { id: '12', text: "I'm good, you?", isSent: true },
    { id: '13', text: "Hey, how are you?", isSent: false },
    { id: '14', text: "I'm good, you?", isSent: true },
    { id: '15', text: "Hey, how are you?", isSent: false },
    { id: '16', text: "I'm good, you?", isSent: true },
    { id: '17', text: "Hey, how are you?", isSent: false },
    { id: '18', text: "I'm good, you?", isSent: true },
    { id: '19', text: "Hey, how are you?", isSent: false },
    { id: '20', text: "I'm good, you?", isSent: true },
    // Add more if needed
  ]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <Card>
      <View style={{ width: "100%", flex: 1, justifyContent: "flex-end" }}>
        {/* <ChatBubble message="Hey, how are you?" isSent={false} />
        <ChatBubble message="I'm good, you?" isSent={true} />
        <ChatBubble message="Hey, how are you?" isSent={false} />
        <ChatBubble message="I'm good, you?" isSent={true} />
        <ChatBubble message="Hey, how are you?" isSent={false} />
        <ChatBubble message="I'm good, you?" isSent={true} />
        <ChatBubble message="Hey, how are you?" isSent={false} />
        <ChatBubble message="I'm good, you?" isSent={true} />
        <ChatBubble message="Hey, how are you?" isSent={false} />
        <ChatBubble message="I'm good, you?" isSent={true} />
        <ChatBubble message="Hey, how are you?" isSent={false} />
        <ChatBubble message="I'm good, you?" isSent={true} />
        <ChatBubble message="Hey, how are you?" isSent={false} />
        <ChatBubble message="I'm good, you?" isSent={true} />
        <ChatBubble message="Hey, how are you?" isSent={false} />
        <ChatBubble message="I'm good, you?" isSent={true} />
        <ChatBubble message="Hey, how are you?" isSent={false} />
        <ChatBubble message="I'm good, you?" isSent={true} />
        <ChatBubble message="Hey, how are you?" isSent={false} />
        <ChatBubble message="I'm good, you?" isSent={true} /> */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble message={item.text} isSent={item.isSent} />
        )}
        // contentContainerStyle={{ padding: 10 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        </View>
      <TextBox />
    </Card>
  );
}
