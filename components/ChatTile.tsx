import { useUserStore } from "@/store/userStore";
import { ContactType } from "@/types/Contacts";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Define the type for the user prop

// Define your stack navigator params if needed
type RootStackParamList = {
  ChatScreen: { userId: string; userName: string };
};

function ChatTile({ contact }: { contact: ContactType }) {
  const { userId, setUserId } = useUserStore();
  const router = useRouter();

  const handlePress = (contact: ContactType) => {
    const id = contact.userId1 === userId ? contact.userId2 : contact.userId1
    const username = contact.userId1 === userId ? contact.user2.name : contact.user1.name

    router.push({
      pathname: "/(main)/userChat/[id]",
      params: { id: id, name: username },
    });
  };

  return (
    <TouchableOpacity onPress={() => {handlePress(contact)}} style={styles.tile}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {contact.userId1 === userId
            ? contact.user2.name.charAt(0)
            : contact.user1.name.charAt(0)}
        </Text>
      </View>
      <Text style={styles.name}>
        {contact.userId1 === userId ? contact.user2.name : contact.user1.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: process.env.EXPO_PUBLIC_BG_COLOR, // dark grey
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: process.env.EXPO_PUBLIC_FG2_COLOR, // #684f82
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  name: {
    color: "white",
    fontSize: 16,
  },
});

export default ChatTile;
