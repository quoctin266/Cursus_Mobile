import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { AccountStackProps } from "../../custom/component.props";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Avatar } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { postLogout } from "../../services/auth.service";
import { logout } from "../../redux/slices/auth.slice";
import { Fontisto } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
const defaultImg = require("../../assets/default.jpg");

GoogleSignin.configure();

function Account({ navigation }: AccountStackProps) {
  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: () => {
      return postLogout();
    },
    onSuccess: async (response) => {
      if (response.status === 200) {
        const isGoogleAuth = await GoogleSignin.isSignedIn();
        if (isGoogleAuth) {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        }
        dispatch(logout());
      } else {
        console.log(response);
      }
    },
    retry: 3,
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {isAuthenticated && (
          <>
            <View style={styles.userInfo}>
              <Avatar.Image
                size={130}
                source={
                  userInfo.imageUrl ? { uri: userInfo.imageUrl } : defaultImg
                }
              />
              <Text style={styles.username}>{userInfo.username}</Text>

              <View style={styles.emailContainer}>
                <Fontisto name="email" size={22} color="black" />
                <Text style={{ fontSize: 16 }}>{userInfo.email}</Text>
              </View>
            </View>

            <View style={styles.subContainer}>
              <Text style={styles.title}>Account settings</Text>

              <TouchableOpacity
                style={styles.section}
                onPress={() => navigation.navigate("Profile")}
              >
                <Text style={styles.sectionTitle}>Profile</Text>
                <AntDesign name="right" size={18} color="#C1C0C8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.section}
                onPress={() => navigation.navigate("Security")}
              >
                <Text style={styles.sectionTitle}>Account security</Text>
                <AntDesign name="right" size={18} color="#C1C0C8" />
              </TouchableOpacity>
            </View>
          </>
        )}

        <View
          style={[
            styles.subContainer,
            isAuthenticated ? {} : { marginTop: 24 },
          ]}
        >
          <Text style={styles.title}>Help and Support</Text>

          <TouchableOpacity style={styles.section}>
            <Text style={styles.sectionTitle}>About Cursus</Text>
            <AntDesign name="right" size={18} color="#C1C0C8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.section}
            onPress={() => navigation.navigate("CompanyLocation")}
          >
            <Text style={styles.sectionTitle}>Company location</Text>
            <AntDesign name="right" size={18} color="#C1C0C8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently asked questions</Text>
            <AntDesign name="right" size={18} color="#C1C0C8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.section}>
            <Text style={styles.sectionTitle}>Share the Cursus app</Text>
            <AntDesign name="right" size={18} color="#C1C0C8" />
          </TouchableOpacity>
        </View>

        <View style={styles.subContainer}>
          <Text style={styles.title}>Diagnostics</Text>

          <TouchableOpacity
            style={styles.section}
            onPress={() => navigation.navigate("Status")}
          >
            <Text style={styles.sectionTitle}>Status</Text>
            <AntDesign name="right" size={18} color="#C1C0C8" />
          </TouchableOpacity>
        </View>

        {isAuthenticated ? (
          <TouchableOpacity
            style={styles.signinBtn}
            onPress={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <ActivityIndicator size={16} color={"#ffa167"} />
            )}
            <Text
              style={[
                styles.btnText,
                mutation.isPending ? { color: "#ffa167" } : {},
              ]}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.signinBtn}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text style={styles.btnText}>Sign In</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.version}>Cursus v9.30.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
    paddingHorizontal: 16,
  },
  subContainer: {
    marginVertical: 12,
  },
  title: {
    color: "#444262",
    marginBottom: 12,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
  },
  signinBtn: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  btnText: {
    color: "#ff6000",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  version: {
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
    color: "#83829A",
  },
  userInfo: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 40,
  },
  username: {
    fontSize: 22,
    fontWeight: "500",
    marginTop: 16,
  },
  emailContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 3,
  },
});

export default Account;
