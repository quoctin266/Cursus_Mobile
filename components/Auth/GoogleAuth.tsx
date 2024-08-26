import React, { useEffect } from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { IGoogleAuth } from "../../custom/request.interface";
import { postGoogleAuth } from "../../services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { IGoogleAuthProps } from "../../custom/component.props";
import { useAppDispatch } from "../../redux/hooks";
import { login } from "../../redux/slices/auth.slice";
import { fetchCartItems } from "../../redux/slices/cart.slice";

const gg = require("../../assets/gg.png");

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEBCLIENTID;

function GoogleAuthBtn(props: IGoogleAuthProps) {
  const { setAlert, setShowAlert } = props;

  const dispatch = useAppDispatch();

  const mutation = useMutation({
    mutationFn: (data: IGoogleAuth) => {
      return postGoogleAuth(data);
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        if (response.data.userCredentials.status === 0) {
          setAlert("Account currently inactive");
          setShowAlert(true);
          return;
        }
        dispatch(fetchCartItems(response.data.userCredentials.id));
        dispatch(login(response.data));
      } else {
        if (response.message) setAlert(response.message);
        else setAlert(response.error as string);
        setShowAlert(true);
      }
    },
    retry: 3,
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { user } = userInfo;
      console.log(userInfo);
      mutation.mutate({
        email: user.email,
        username: user.name,
        firstName: user.givenName,
        lastName: user.familyName,
        image: user.photo,
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log("cancelled", error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log("progress", error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log("no service", error);
      } else {
        // some other error happened
        console.log("others", error);
      }
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });
  }, []);

  return (
    <TouchableOpacity
      style={[styles.button, mutation.isPending && { borderColor: "gray" }]}
      onPress={signIn}
      disabled={mutation.isPending}
    >
      {mutation.isPending && <ActivityIndicator size={20} color={"gray"} />}
      <Image source={gg} resizeMode="contain" style={styles.iconImg} />
      <Text style={[styles.btnText, mutation.isPending && { color: "gray" }]}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: "#FAFAFC",
    borderWidth: 1,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
});

export default GoogleAuthBtn;
