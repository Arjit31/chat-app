import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export function TermsAndConditions({
  termsVisible,
  setTermsVisible,
}: {
  termsVisible: boolean;
  setTermsVisible: (value: React.SetStateAction<boolean>) => void;
}) {
  return (
    <Modal visible={termsVisible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Terms & Conditions</Text>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.modalText}>
              1. You agree to provide accurate information. {"\n\n"}
              2. You are responsible for maintaining your credentials. {"\n\n"}
              3. This account is non-transferable. {"\n\n"}
              4. No password recovery option is available at this time. {"\n\n"}
              5. By proceeding, you consent to our data usage policy.
            </Text>
          </ScrollView>
          <Pressable
            style={styles.closeButton}
            onPress={() => setTermsVisible(false)}
          >
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalBody: {
    maxHeight: 300,
  },
  modalText: {
    fontSize: 14,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#a079c6",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
