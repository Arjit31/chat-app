import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { TouchableOpacity } from "react-native";


export function Logout(){
    return (
        <TouchableOpacity>
            <FontAwesome6 name="face-laugh" size={24} color="#a079c6" />
        </TouchableOpacity>
    )
}