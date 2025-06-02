import { setLoginStatus } from "@/lib/setLoginStatus";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { assignNull, getSocket } from "@/lib/socket";
import { useEffect } from "react";

import { deleteEverything } from "@/lib/sqlite/broadcastStorage";
import { deleteEverythingUnicast } from "@/lib/sqlite/unicastStorage";

export function Logout() {
  const { isLogin, setLogin } = useAuthStore();
  const { userId, setUserId } = useUserStore();
  useEffect(() => {
    if(isLogin === false){
      async function closeScoket(){
        const socket = await getSocket(isLogin);
        if(socket) socket.close();
        assignNull()
      }
      closeScoket()
    }
  },[isLogin])
  return (
    <TouchableOpacity
      onPress={async () => {
        await SecureStore.deleteItemAsync("refreshToken");
        await setLoginStatus(false, setLogin, setUserId);
        deleteEverything()
        deleteEverythingUnicast()
      }}
    >
      <FontAwesome6
        name="face-laugh"
        size={30}
        color={process.env.EXPO_PUBLIC_FG1_COLOR}
      />
    </TouchableOpacity>
  );
}

export function Send({
  onPress,
}: {
  onPress: (event: GestureResponderEvent) => void;
}) {
  return (
    <TouchableOpacity style={styles.sendBackground}>
      <Ionicons
        name="send"
        size={30}
        color={process.env.EXPO_PUBLIC_FG1_COLOR}
        onPress={onPress}
      />
    </TouchableOpacity>
  );
}

interface Props {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  disabled?: boolean;
}

export default function ButtonPrimary({ onPress, title, disabled }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: process.env.EXPO_PUBLIC_FG1_COLOR,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabled: {
    backgroundColor: process.env.EXPO_PUBLIC_FG2_COLOR,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  sendBackground: {
    // backgroundColor: process.env.EXPO_PUBLIC_FG1_COLOR,
    borderRadius: 10,
    padding: 6,
  },
});
