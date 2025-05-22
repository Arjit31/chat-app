import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from "react-native";

export function Logout(){
    return (
        <TouchableOpacity>
            <FontAwesome6 name="face-laugh" size={30} color={process.env.EXPO_PUBLIC_FG1_COLOR} />
        </TouchableOpacity>
    )
}

export function Send(){
    return (
        <TouchableOpacity>
            <Ionicons name="send" size={30} color={process.env.EXPO_PUBLIC_FG1_COLOR} />
        </TouchableOpacity>
    )
}