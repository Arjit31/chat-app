import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TextInput, View } from "react-native";
import { Send } from "./Button";

const maxLines = 10;
const lineHeight = 24;

function interpolateColor(
  start: number[],
  end: number[],
  factor: number
): string {
  const rgb = start.map((startVal, i) =>
    Math.round(startVal + (end[i] - startVal) * factor)
  );
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function TextBox({ type, toUserId }: { type: "Anonymous" | "Reveal" | "Personal", toUserId?: string }) {
  const {userId, setUserId} = useUserStore();
  const {isLogin, setLogin} = useAuthStore();
  const [text, setText] = useState("");
  const [height, setHeight] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [sendSound, setSendSound] = useState<Audio.Sound | null>(null);
  // const inputRef = useRef(null);
  const websocket = useRef<WebSocket>(null);

  async function createString() {
    const obj = {
      category: type === "Personal" ? "unicast" : "broadcast",
      type: type,
      text: text,
      userId: userId,
      fromUserId: userId,
      toUserId: toUserId,
    };

    const convert = JSON.stringify(obj);
    console.log(convert);
    return convert;
  }
  const maxChars = 200;
  const startColor = [242, 237, 246]; //rgb(242, 237, 246)
  const endColor = [227, 210, 210]; //rgb(227, 210, 210)

  const ratio = Math.min(text.length / maxChars, 1);
  const interpolatedBorderColor = interpolateColor(startColor, endColor, ratio);
  const interpolatedBackgroundColor = interpolateColor(
    startColor,
    type === "Anonymous" ? endColor : startColor,
    ratio
  );

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const playTypingSound = async () => {
    if (sound) {
      await sound.replayAsync();
    }
  };
  
  const playSendSound = async () => {
    if (sendSound) {
      await sendSound.replayAsync();
    }
  };

  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/soft-click.mp3")
      );
      const sendClick = await Audio.Sound.createAsync(
        require("../assets/sounds/poit-94911.mp3")
      )
      setSound(sound);
      setSendSound(sendClick.sound)
    }
    async function setWebSocket(){
      websocket.current = await getSocket(isLogin);
    }
    loadSound();
    setWebSocket();
    return () => {
      sound?.unloadAsync();
      sendSound?.unloadAsync()
    };
  }, []);

  useEffect(() => {
    if (text.length === 0) return;

    const scaleAmount = Math.min(1 + 0.00007 * text.length, 1 + 0.00007 * 300);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: scaleAmount,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [text]);

  return (
    <View style={styles.inputWrapper}>
      <Animated.View
        style={{ transform: [{ scale: scaleAnim }], flex: 1, height: height }}
      >
        <TextInput
          // ref={inputRef}
          multiline
          onChangeText={setText}
          onKeyPress={playTypingSound}
          value={text}
          placeholder="Type something..."
          placeholderTextColor="#999"
          onContentSizeChange={(e) => {
            const newHeight = Math.min(
              e.nativeEvent.contentSize.height,
              maxLines * lineHeight
            );
            setHeight(newHeight);
          }}
          style={[
            styles.textInput,
            {
              height: Math.max(240, height),
              borderColor: interpolatedBorderColor,
              backgroundColor: interpolatedBackgroundColor,
            },
          ]}
        />
      </Animated.View>
        <Send
          onPress={async () => {
            try {
              if(!websocket.current){
                console.log("web socket not Initialized")
                websocket.current = await getSocket(isLogin)
              }
              websocket.current?.send(await createString());
              setText("")
              playSendSound()
            } catch (error) {
              
            }
          }}
        ></Send>
    </View>
  );
}
const styles = StyleSheet.create({
  inputWrapper: {
    width: "95%",
    paddingVertical: 20,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    color: "#333",
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: "top",
  },
});