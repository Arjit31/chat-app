import { Card } from "@/components/Card";
import ChatTile from "@/components/ChatTile";
import { createContactsTable, loadContactsFromDB, saveContactsToDB } from "@/lib/sqlite/contactStorage";
import { ContactType } from "@/types/Contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native";


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
