import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { SignUpStackProps } from "../../custom/component.props";
const fb = require("../../assets/facebook.png");
const gg = require("../../assets/gg.png");

function SignUp({ navigation }: SignUpStackProps) {
  const [isChecked, setChecked] = useState(false);
  const { width, height } = useWindowDimensions();

  const [isPortrait, setIsPortrait] = useState(true);

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
          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>
            By using our services you are agreeing to our{" "}
            <Text style={styles.boldWords}>Terms</Text> and{" "}
            <Text style={styles.boldWords}>Privacy Statement</Text>
          </Text>
        </View>

        <View style={styles.groupBtn}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("EmailSignUp")}
          >
            <Fontisto name="email" size={22} color="white" />
            <Text style={styles.btnText}>Sign up with email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Image source={gg} resizeMode="contain" style={styles.iconImg} />
            <Text style={styles.btnText}>Sign up with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Image
              source={fb}
              resizeMode="contain"
              style={[styles.iconImg, { backgroundColor: "white" }]}
            />
            <Text style={styles.btnText}>Sign up with Facebook</Text>
          </TouchableOpacity>

          <View style={styles.offerContainer}>
            <Checkbox
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? "#4630EB" : undefined}
            />

            <Text
              style={styles.offerText}
              onPress={() => setChecked(!isChecked)}
            >
              Send me special offers, personalized recommendations, and learning
              tips
            </Text>
          </View>
        </View>

        <View
          style={[styles.loginPromp, isPortrait ? {} : { marginBottom: 50 }]}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={{ color: "#c0c4fc", fontSize: 16 }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  loginPromp: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  offerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  offerText: {
    color: "white",
    fontWeight: "300",
    marginLeft: 12,
    fontSize: 12,
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

export default SignUp;
