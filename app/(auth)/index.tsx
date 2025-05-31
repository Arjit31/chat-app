import { signin } from "@/lib/authentication";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ButtonPrimary from "../../components/Button";
import InputField from "../../components/InputField";

export default function Signin() {
  const { isLogin, setLogin } = useAuthStore();
    const {userId, setUserId} = useUserStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  async function onSubmit() {
    setDisabled(true);
    await signin({ username, password, setLogin, setUserId });
    router.replace("./");
    setDisabled(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <InputField
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <ButtonPrimary
        title="Submit"
        onPress={onSubmit}
        disabled={!username.trim() || !password.trim() || disabled}
      />

      <Text style={styles.link} onPress={() => router.push("./signup")}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: process.env.EXPO_PUBLIC_BG_COLOR || "#121212",
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: process.env.EXPO_PUBLIC_PRIMARY_COLOR || "#a079c6",
    marginBottom: 30,
    textAlign: "center",
  },
  link: {
    marginTop: 20,
    color: process.env.EXPO_PUBLIC_PRIMARY_COLOR || "#a079c6",
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
