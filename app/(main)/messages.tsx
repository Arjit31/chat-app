import { Card } from "@/components/Card";
import ChatTile from "@/components/ChatTile";
import { ScrollView } from "react-native";

const users = [
    { id: '1', name: 'Arjit' },
    { id: '2', name: 'Kanishq' },
    { id: '3', name: 'Priya' },
    { id: '4', name: 'Arjit' },
    { id: '5', name: 'Kanishq' },
    { id: '6', name: 'Priya' },
    { id: '7', name: 'Arjit' },
    { id: '8', name: 'Kanishq' },
    { id: '9', name: 'Priya' },
    { id: '10', name: 'Arjit' },
    { id: '11', name: 'Kanishq' },
    { id: '12', name: 'Priya' },
  ];

export default function Index() {
  return (
    <Card>
      <ScrollView style={{width: "100%"}}>
      {users.map(user => (
        <ChatTile key={user.id} user={user} />
      ))}
    </ScrollView>
    </Card>
  );
}
