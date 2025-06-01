import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define the type for the user prop
interface User {
  id: string;
  name: string;
}

// Define your stack navigator params if needed
type RootStackParamList = {
  ChatScreen: { userId: string; userName: string };
};

function ChatTile({ user }: {user:User}){
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    // navigation.navigate('ChatScreen', {
    //   userId: user.id,
    //   userName: user.name,
    // });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.tile}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{user.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: process.env.EXPO_PUBLIC_BG_COLOR, // dark grey
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: process.env.EXPO_PUBLIC_FG2_COLOR, // #684f82
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  name: {
    color: 'white',
    fontSize: 16,
  },
});

export default ChatTile;
