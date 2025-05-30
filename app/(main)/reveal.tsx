import { Card } from "@/components/Card";
import { Chats } from "@/components/Chats";
import { TextBox } from "@/components/Textbox";

export default function Index() {
  return (
    <Card>
      <Chats type="Reveal" />
      <TextBox type="Reveal" />
    </Card>
  );
}
