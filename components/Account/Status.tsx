import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { FontAwesome } from "@expo/vector-icons";

function Status() {
  const { type, isConnected } = useNetInfo();

  const clickDetailNetwork = () => {
    const message = isConnected
      ? "No problems detected in the last 5 minutes"
      : "Your phone is offline. \n\n To fix the network, you might consider \n \t\t \u25CF Changing your phone to a different WiFi \n \t\t \u25CF Changing your physical location \n \t\t \u25CF Placing your phone into and out of Airplane mode \n \t\t \u25CF Resetting your home network \n \t\t \u25CF Turning on a VPN";
    Alert.alert(
      "",
      message,
      [
        {
          text: "Close",
        },
      ],
      { cancelable: true }
    );
  };

  const clickCursusDetail = () => {
    const message = "Cursus is always good. :D";

    Alert.alert(
      "",
      message,
      [
        {
          text: "Close",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <View>
          <View style={styles.statusTitleContainer}>
            <Text style={styles.statusTitle}>Network Status</Text>
            <FontAwesome
              name="circle"
              size={12}
              color={isConnected ? "green" : "red"}
            />
          </View>
          <Text style={styles.statusDes}>
            {isConnected ? "Good" : "Offline"}
          </Text>
          {isConnected ? (
            <Text>Connected via {type}</Text>
          ) : (
            <Text>Not connected</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() => clickDetailNetwork()}
        >
          <Text style={styles.detailText}>DETAILS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View>
          <View style={styles.statusTitleContainer}>
            <Text style={styles.statusTitle}>Cursus Status</Text>
            <FontAwesome
              name="circle"
              size={12}
              color={isConnected ? "green" : "red"}
            />
          </View>
          <Text style={styles.statusDes}>{isConnected ? "Good" : "Bad"}</Text>
        </View>

        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() => clickCursusDetail()}
        >
          <Text style={styles.detailText}>DETAILS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  statusTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  statusDes: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "500",
  },
  detailBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  detailText: { fontWeight: "600", color: "#ff6000" },
});
export default Status;
