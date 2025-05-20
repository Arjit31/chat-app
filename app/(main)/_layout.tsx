
import { Logout } from "@/components/Button";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#a079c6",
        tabBarInactiveBackgroundColor: "#2a2a2a",
        tabBarActiveBackgroundColor: "#2a2a2a",
        headerStyle: {
          backgroundColor: "#2a2a2a",
          borderBottomColor: "#2a2a2a",
          elevation:0
        },

        tabBarStyle:{
          borderColor: "#2a2a2a",
          borderTopWidth: 0,
          elevation:0
        },
        headerTintColor: "#a079c6",
        headerRight(props) {
          return (
            <View style={{padding:10}}>

              <Logout></Logout>
            </View>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Drop It",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="droplet" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reveal"
        options={{
          title: "Hangout",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbox-ellipses" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Chats",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbox-ellipses" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
