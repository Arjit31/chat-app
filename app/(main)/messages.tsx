import { Card } from "@/components/Card";
import ChatTile from "@/components/ChatTile";
import { createContactsTable, loadContactsFromDB, saveContactsToDB } from "@/lib/sqlite/contactStorage";
import { ContactType } from "@/types/Contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native";



// const users = [
//   { id: "1", name: "Arjit" },
//   { id: "2", name: "Kanishq" },
//   { id: "3", name: "Priya" },
//   { id: "4", name: "Arjit" },
//   { id: "5", name: "Kanishq" },
//   { id: "6", name: "Priya" },
//   { id: "7", name: "Arjit" },
//   { id: "8", name: "Kanishq" },
//   { id: "9", name: "Priya" },
//   { id: "10", name: "Arjit" },
//   { id: "11", name: "Kanishq" },
//   { id: "12", name: "Priya" },
// ];

export default function Index() {
  const [contacts, setContacts] = useState<ContactType[]>([])
  useFocusEffect(
    useCallback(() => {
      async function mountContacts(){
      try {
          createContactsTable()
          const accessToken = await AsyncStorage.getItem("@token:accessToken");
          const fetchedContacts = await axios.get(
            process.env.EXPO_PUBLIC_BACKEND_URL +
              "/api/v1/contact/fetch-contacts",
            {
              headers: {
                Authorization: accessToken,
              },
            }
          );
          if(fetchedContacts.data.success){
            console.log(fetchedContacts.data.contacts[0]);
            saveContactsToDB(fetchedContacts.data.contacts);
          }
        } catch (error) {
          console.log("error in fetching contacts: ", error);
        }
        const allContacts = loadContactsFromDB();
        setContacts(allContacts)
      } 
      mountContacts()
    }, [])
  );
  return (
    <Card>
      <ScrollView style={{ width: "100%" }}>
        {contacts.map((contact) => (
          <ChatTile key={contact.id} contact={contact} />
        ))}
      </ScrollView>
    </Card>
  );
}
