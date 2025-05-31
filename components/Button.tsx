import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from "react-native";

export function Logout(){
    return (
        <TouchableOpacity>
            <FontAwesome6 name="face-laugh" size={30} color={process.env.EXPO_PUBLIC_FG1_COLOR} />
        </TouchableOpacity>
    )
}

export function Send({onPress} : {onPress: (event: GestureResponderEvent) => void}){
    return (
        <TouchableOpacity style = {styles.sendBackground}>
            <Ionicons name="send" size={30} color={process.env.EXPO_PUBLIC_FG1_COLOR} onPress={onPress}/>
        </TouchableOpacity>
    )
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
    padding: 6
  }
});