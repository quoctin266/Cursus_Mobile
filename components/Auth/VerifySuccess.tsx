import React from "react";
import { SafeAreaView, Text, View, StyleSheet } from "react-native";
import { Avatar, Button } from "react-native-paper";
import { VerifySuccessStackProps } from "../../custom/component.props";

function VerifySuccess({ navigation }: VerifySuccessStackProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusInfo}>
        <Avatar.Icon
          size={100}
          icon={"check"}
          style={{ backgroundColor: "#22bb33" }}
        />
        <View style={{ alignItems: "center", paddingHorizontal: 84, gap: 8 }}>
          <Text style={styles.title}>Success</Text>
          <Text style={styles.description}>
            Your identity has been verified successfully
          </Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Button
          mode="contained"
          buttonColor="#ff6000"
          style={styles.button}
          onPress={() => {
            navigation.reset({
              index: 1,
              routes: [{ name: "Intro" }, { name: "EmailSignIn" }],
            });
          }}
        >
          <Text style={styles.btnText}>Continue</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusInfo: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
    flex: 4,
    gap: 50,
  },
  title: {
    fontWeight: "600",
    fontSize: 30,
  },
  description: {
    color: "gray",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 5,
  },
  btnText: {
    fontSize: 18,
  },
});

export default VerifySuccess;
