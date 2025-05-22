import { Logout } from "@/components/Button";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PlatformPressable } from "@react-navigation/elements";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#a079c6",
        tabBarInactiveBackgroundColor: process.env.EXPO_PUBLIC_BG_COLOR,
        tabBarActiveBackgroundColor: process.env.EXPO_PUBLIC_BG_COLOR,
        headerStyle: {
          backgroundColor: process.env.EXPO_PUBLIC_BG_COLOR,
          borderBottomColor: "#a079c6",
          elevation: 0,
          borderBottomWidth: 2,
        },
        tabBarButton: (props) => (
          <PlatformPressable
            {...props}
            android_ripple={{
              borderless: false,
            }} // Disables the ripple effect for Android
          />
        ),
        tabBarLabelStyle: {
          fontSize: 15,
        },
        // tabBarShowLabel: false,
        tabBarIconStyle: {
          height: 45,
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          // overflow: "hidden",
        },
        tabBarStyle: {
          borderColor: "#a079c6",
          borderTopWidth: 2,
          elevation: 0,
          height: 100,
          overflow: "hidden",
          // paddingBottom: 10,
        },
        headerTintColor: "#a079c6",
        headerRight(props) {
          return (
            <View style={{ padding: 10 }}>
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
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6
              name="droplet"
              size={focused ? 30 : 24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reveal"
        options={{
          title: "Hangout",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="chatbubbles"
              size={focused ? 30 : 24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="chatbubble-ellipses"
              size={focused ? 30 : 24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
