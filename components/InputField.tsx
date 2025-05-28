import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

export default function InputField(props: TextInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#999"
      selectionColor={'#999'}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    // backgroundColor: "#222",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    color: "white",
    fontSize: 16,
    // textAlign: "center"
  },
});
