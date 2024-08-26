import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { RequestStatusStackProps } from "../../custom/component.props";
import { useMutation } from "@tanstack/react-query";
import { postSendResetPWRequest } from "../../services/auth.service";
import { Snackbar } from "react-native-paper";

function RequestStatus({ navigation, route }: RequestStatusStackProps) {
  const { email } = route.params;

  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [isError, setIsError] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: { email: string }) => {
      return postSendResetPWRequest(data);
    },
    onSuccess: (response) => {
      if (response.status === 201) {
        setAlert("Check your email for the password reset link");
        setIsError(false);
      } else {
        setIsError(true);
        if (response.message) setAlert(response.message);
        else setAlert(response.error as string);
      }
      setShowAlert(true);
    },
    retry: 3,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ justifyContent: "center", flex: 1 }}>
        <Feather
          name="check"
          size={48}
          color="gray"
          style={{ alignSelf: "center" }}
        />
        <Text style={styles.title}>Success!</Text>
        <Text style={styles.subtitle}>
          We have sent a link to reset your password. Once you have updated your
          information you can try again.
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 30,
          }}
        >
          <Text style={styles.subtitle}>Didn't get it?</Text>
          {mutation.isPending ? (
            <Text style={styles.sendAgain}>Sending...</Text>
          ) : (
            <TouchableOpacity onPress={() => mutation.mutate({ email })}>
              <Text style={styles.sendAgain}>Send it again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.bottomTabs}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            })
          }
        >
          <Text style={styles.tabText}>Browse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.tabText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <Snackbar
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onIconPress={() => setShowAlert(false)}
        duration={5000}
        style={{ backgroundColor: isError ? "#bb2124" : "#22bb33" }}
      >
        {alert}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
  },
  title: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    marginVertical: 12,
    color: "white",
  },
  subtitle: {
    textAlign: "center",
    color: "white",
    fontWeight: "300",
  },
  sendAgain: {
    color: "#c0c4fc",
    fontWeight: "600",
  },
  bottomTabs: {
    flexDirection: "row",
    backgroundColor: "#F3F4F8",
  },
  tab: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  tabText: {
    fontWeight: "600",
    fontSize: 16,
  },
});

export default RequestStatus;
