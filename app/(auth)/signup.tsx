import { TermsAndConditions } from "@/components/TermsAndConditions";
import { signup } from "@/lib/authentication";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";
import ButtonPrimary from "../../components/Button";
import InputField from "../../components/InputField";

export default function Signup() {
  const { isLogin, setLogin } = useAuthStore();
    const {userId, setUserId} = useUserStore();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [coolName, setCoolName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [is18Plus, setIs18Plus] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const router = useRouter();
  const onNext = () => setStep((s) => s + 1);

  async function onSubmit() {
    setDisabled(true);
    await signup({ username, password, coolName, setLogin, setUserId });
    router.replace("./");
    setDisabled(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>

      {step === 0 && <ButtonPrimary title="Start Signup" onPress={onNext} />}

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
          <Text style={styles.warning}>
            ⚠️ Please remember this password. It cannot be changed later.
          </Text>
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

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={agreedToTerms ? "checked" : "unchecked"}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              color={process.env.EXPO_PUBLIC_FG1_COLOR}
            />
            <Text style={styles.checkboxLabel}>
              I have read and agree to the{" "}
              <Text
                style={styles.linkInline}
                onPress={() => setTermsVisible(true)}
              >
                Terms and Conditions
              </Text>
            </Text>
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={is18Plus ? "checked" : "unchecked"}
              onPress={() => setIs18Plus(!is18Plus)}
              color={process.env.EXPO_PUBLIC_FG1_COLOR}
            />
            <Text style={styles.checkboxLabel}>I am 18 years old or above</Text>
          </View>

          <ButtonPrimary
            title="Submit"
            onPress={onSubmit}
            disabled={!coolName.trim() || !agreedToTerms || !is18Plus || disabled}
          />

          {/* Terms and Conditions Modal */}
          <TermsAndConditions
            termsVisible={termsVisible}
            setTermsVisible={setTermsVisible}
          />
        </>
      )}

      <Text style={styles.link} onPress={() => router.push("./")}>
        Already have an account? Sign In
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
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: "#fff",
    flex: 1,
    fontSize: 14,
  },
  linkInline: {
    textDecorationLine: "underline",
    color: process.env.EXPO_PUBLIC_PRIMARY_COLOR || "#a079c6",
  },
});
