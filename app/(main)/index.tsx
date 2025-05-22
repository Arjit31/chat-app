import { Card } from "@/components/Card";
import { Text, View } from "react-native";

import { TextBox } from "@/components/Textbox";

export default function Index() {
  return (
    <Card>
      <View style={{ width: "100%", flex: 1 }}>
        <Text
          style={{
            color: "white",
          }}
        >
          Main
        </Text>
      </View>

      <TextBox></TextBox>
    </Card>
  );
}
