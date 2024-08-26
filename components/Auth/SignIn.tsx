import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Fontisto, AntDesign } from "@expo/vector-icons";
import { SignInStackProps } from "../../custom/component.props";
import GoogleAuthBtn from "./GoogleAuth";
import { Snackbar } from "react-native-paper";
const fb = require("../../assets/facebook.png");

function SignIn({ navigation }: SignInStackProps) {
  const { width, height } = useWindowDimensions();

  const [isPortrait, setIsPortrait] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    if (width > height) setIsPortrait(false);
    else setIsPortrait(true);
  }, [width, height]);

  return (
    <SafeAreaView style={[styles.container, isPortrait ? {} : { padding: 0 }]}>
      <ScrollView
        style={isPortrait ? {} : { width: "100%" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          isPortrait ? styles.scrollPortrait : styles.scrollLandscape
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            By using our services you are agreeing to our{" "}
            <Text style={styles.boldWords}>Terms</Text> and{" "}
            <Text style={styles.boldWords}>Privacy Statement</Text>
          </Text>
        </View>

        <View style={styles.groupBtn}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("EmailSignIn")}
          >
            <Fontisto name="email" size={22} color="white" />
            <Text style={styles.btnText}>Sign in with email</Text>
          </TouchableOpacity>

          <GoogleAuthBtn setAlert={setAlert} setShowAlert={setShowAlert} />

          <TouchableOpacity style={styles.button}>
            <Image
              source={fb}
              resizeMode="contain"
              style={[styles.iconImg, { backgroundColor: "white" }]}
            />
            <Text style={styles.btnText}>Sign in with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <AntDesign name="apple1" size={22} color="white" />
            <Text style={styles.btnText}>Sign in with Apple</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[styles.registerPromp, isPortrait ? {} : { marginBottom: 50 }]}
        >
          <Text style={{ color: "white", fontSize: 16 }}>New here?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={{ color: "#c0c4fc", fontSize: 16 }}>
              Create an account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Snackbar
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onIconPress={() => setShowAlert(false)}
        duration={5000}
        style={{ backgroundColor: "#FF7754" }}
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
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 12,
    color: "white",
  },
  subtitle: {
    textAlign: "center",
    color: "white",
    fontWeight: "300",
    fontSize: 13,
  },
  boldWords: {
    fontWeight: "600",
  },
  groupBtn: {
    width: "100%",
    flex: 2,
    gap: 16,
  },
  button: {
    borderColor: "#FAFAFC",
    borderWidth: 1,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "600",
    color: "white",
    fontSize: 16,
  },
  iconImg: {
    width: 22,
    height: 22,
  },
  registerPromp: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  scrollPortrait: {
    alignItems: "center",
    flex: 1,
  },
  scrollLandscape: {
    alignItems: "center",
    gap: 50,
    width: "60%",
    alignSelf: "center",
  },
});
export default SignIn;
