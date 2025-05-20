import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2a2a2a"
      }}
    >
      <Text style={{
        color: "white"
      }}>Main</Text>
    </View>
  );
}
