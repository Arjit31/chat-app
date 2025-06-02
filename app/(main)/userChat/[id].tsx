import { Card } from "@/components/Card";
import { Chats } from "@/components/Chats";
import { TextBox } from "@/components/Textbox";
import { Stack, useLocalSearchParams } from "expo-router";

export default function userChat() {
    const { id, name } : {id: string, name: string} = useLocalSearchParams();
    console.log(id, name);
  return (
    <Card>
      <Stack.Screen
        options={{
          title: name || "Chat", // fallback title if name is missing
        }}
      />
      <Chats type="Personal" toUserId={id}/>
      <TextBox type="Personal" toUserId={id}/>
    </Card>
  );
}
