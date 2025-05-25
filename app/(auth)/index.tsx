// import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   expoClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  //   scopes: ["profile", "email"],
  // });

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { authentication } = response;
  //     // Ideally validate the token on backend here
  //     router.replace("/"); // redirect to MainLayout
  //   }
  // }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Drop It</Text>
      {/* <Image
        source={require("@/assets/login-art.png")}
        style={styles.image}
        resizeMode="contain"
      /> */}
      <Pressable
        style={styles.googleButton}
        // onPress={() => promptAsync()}
        // disabled={!request}
      >
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: process.env.EXPO_PUBLIC_BG_COLOR,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: "#a079c6",
    marginBottom: 40,
    fontWeight: "600",
  },
  image: {
    width: "80%",
    height: 200,
    marginBottom: 40,
  },
  googleButton: {
    backgroundColor: "#a079c6",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 3,
  },
  googleButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
});
