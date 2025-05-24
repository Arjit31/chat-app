import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function ChatBubble({
  message,
  isSent,
  type,
}: {
  message: string;
  isSent: boolean;
  type: "Anonymous" | "Reveal";
}) {
  return (
    <View
      style={[
        styles.bubbleContainer,
        isSent ? styles.sentContainer : styles.receivedContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isSent ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        <Text style={isSent ? styles.sentText : styles.receivedText}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    paddingHorizontal: 10,
    marginVertical: 5,
    flexDirection: "row",
  },
  sentContainer: {
    justifyContent: "flex-end",
  },
  receivedContainer: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: 16,
    padding: 10,
  },
  sentBubble: {
    backgroundColor: process.env.EXPO_PUBLIC_FG1_COLOR, // Purple
    borderTopRightRadius: 0,
  },
  receivedBubble: {
    backgroundColor: "#E5E5EA", // Grey
    borderTopLeftRadius: 0,
  },
  sentText: {
    color: "#ffffff",
  },
  receivedText: {
    color: "#000000",
  },
});

export default ChatBubble;
