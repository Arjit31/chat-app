import React, { JSX } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback
} from "react-native";
// import { KeyboardEvent as RNKeyboardEvent } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

interface WrapperProps {
  children: React.ReactNode;
}

export function Card({ children }: WrapperProps): JSX.Element {
 const headerHeight = useHeaderHeight(); 
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: "100%", alignItems: "center", height: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={{
            height: "100%",
            // flex: 1,
            width: "100%",
            // justifyContent: "center",
            // alignItems: "center",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: process.env.EXPO_PUBLIC_BG_COLOR,
          }}
        >
          {children}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
