import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ButtonPrimary from "../../components/Button";
import InputField from "../../components/InputField";

export default function Signup() {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [coolName, setCoolName] = useState("");
  const router = useRouter();

  const onNext = () => setStep((s) => s + 1);

  const onSubmit = () => {
    alert(`Welcome, ${coolName}! Your account is created.`);
    router.replace("./");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>

      {step === 0 && (
        <ButtonPrimary title="Start Signup" onPress={onNext} />
      )}

      {step === 1 && (
        <>
          <InputField
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <Text style={styles.warning}>
            ⚠️ Remember this username to sign in later.
          </Text>
          <ButtonPrimary
            title="Next"
            onPress={onNext}
            disabled={!username.trim()}
          />
        </>
      )}

      {step === 2 && (
        <>
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <ButtonPrimary
            title="Next"
            onPress={onNext}
            disabled={!password.trim()}
          />
        </>
      )}

      {step === 3 && (
        <>
          <InputField
            placeholder="Give a cool name to yourself"
            value={coolName}
            onChangeText={setCoolName}
          />
          <ButtonPrimary
            title="Submit"
            onPress={onSubmit}
            disabled={!coolName.trim()}
          />
        </>
      )}

      {step > 0 && (
        <Text
          style={styles.link}
          onPress={() => router.push("./")}
        >
          Already have an account? Sign In
        </Text>
      )}
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
  warning: {
    color: "#ffcc00",
    marginBottom: 10,
    fontSize: 14,
  },
  link: {
    marginTop: 20,
    color: process.env.EXPO_PUBLIC_PRIMARY_COLOR || "#a079c6",
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 16,
  }
});
