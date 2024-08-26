import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Snackbar, TextInput } from "react-native-paper";
import {
  useForm,
  SubmitHandler,
  Controller,
  SubmitErrorHandler,
} from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { postLogin } from "../../services/auth.service";
import { useAppDispatch } from "../../redux/hooks";
import { login } from "../../redux/slices/auth.slice";
import { fetchCartItems } from "../../redux/slices/cart.slice";
import { EmailSignInStackProps } from "../../custom/component.props";

interface Inputs {
  email: string;
  password: string;
}

export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_PATTERN =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function EmailSignIn({ navigation }: EmailSignInStackProps) {
  const [showPW, setShowPW] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [isPortrait, setIsPortrait] = useState(true);

  const { width, height } = useWindowDimensions();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (width > height) setIsPortrait(false);
    else setIsPortrait(true);
  }, [width, height]);

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const mutation = useMutation({
    mutationFn: (data: Inputs) => {
      return postLogin({ ...data, mobile: true });
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        if (response.data.userCredentials.status === 0) {
          setAlert("Account currently inactive");
          setShowAlert(true);
          if (!response.data.userCredentials.isVerified) {
            navigation.navigate("AccountVerify", {
              email: response.data.userCredentials.email,
              message: "Your account has not been activated yet",
            });
          }
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

  const refEmail = useRef(null);
  const refPassword = useRef(null);

  const onInvalid: SubmitErrorHandler<Inputs> = (errors) => {
    const keys = Object.keys(errors);
    if (keys.length > 0) {
      if (keys[0] === "email") {
        refEmail.current?.focus();
        return;
      }
      if (keys[0] === "password") refPassword.current?.focus();
    }
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data);
  };

  return (
    <SafeAreaView style={[styles.container, isPortrait ? {} : { padding: 0 }]}>
      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          isPortrait ? styles.scrollPortrait : styles.scrollLandscape
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>
            Enter your email and password to sign in to your account
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: EMAIL_PATTERN,
                message: "Please enter a valid email address",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                readOnly={mutation.isPending}
                ref={refEmail}
                label="Email"
                cursorColor={errors.email ? "#FF7754" : "white"}
                contentStyle={{ backgroundColor: "black" }}
                textColor="white"
                activeUnderlineColor={errors.email ? "#FF7754" : "white"}
                underlineColor={errors.email ? "#FF7754" : "white"}
                theme={{
                  colors: {
                    onSurfaceVariant: errors.email ? "#FF7754" : "white",
                  },
                }}
                value={value}
                onChangeText={onChange}
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          <Controller
            control={control}
            rules={{
              required: "Password is required",
              pattern: {
                value: PASSWORD_PATTERN,
                message: "Please enter a valid password",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                readOnly={mutation.isPending}
                ref={refPassword}
                label="Password (8+ characters)"
                cursorColor={errors.password ? "#FF7754" : "white"}
                contentStyle={{ backgroundColor: "black" }}
                textColor="white"
                activeUnderlineColor={errors.password ? "#FF7754" : "white"}
                underlineColor={errors.password ? "#FF7754" : "white"}
                secureTextEntry={!showPW}
                theme={{
                  colors: {
                    surfaceVariant: "black",
                    onSurfaceVariant: errors.password ? "#FF7754" : "white",
                  },
                }}
                right={
                  <TextInput.Icon
                    color={"white"}
                    icon={showPW ? "eye-off" : "eye"}
                    onPress={() => setShowPW(!showPW)}
                  />
                }
                value={value}
                onChangeText={onChange}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ResetPassword", {
                  email: getValues("email"),
                })
              }
            >
              <Text style={styles.forgetPW}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, mutation.isPending && styles.loadingBtn]}
              onPress={handleSubmit(onSubmit, onInvalid)}
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <ActivityIndicator size={"small"} color={"#83829A"} />
              )}
              <Text
                style={[
                  styles.btnText,
                  mutation.isPending && styles.loadingText,
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.footer, isPortrait ? {} : { marginBottom: 50 }]}>
            <Text style={styles.footerText}>
              By clicking on "Sign in" you agree to our Terms of Use and Privacy
              Policy
            </Text>
          </View>
        </View>

        <Snackbar
          visible={showAlert}
          onDismiss={() => setShowAlert(false)}
          onIconPress={() => setShowAlert(false)}
          duration={5000}
          style={{ backgroundColor: "#FF7754" }}
        >
          {alert}
        </Snackbar>
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
  },
  form: {
    width: "100%",
    gap: 16,
    marginTop: 30,
    flex: 4,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FAFAFC",
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: "center",
    marginTop: 12,
    flexDirection: "row",
    gap: 5,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingText: {
    color: "#83829A",
  },
  loadingBtn: {
    backgroundColor: "#C1C0C8",
  },
  forgetPW: {
    color: "#c0c4fc",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    textAlign: "center",
    color: "white",
    fontWeight: "300",
    fontSize: 13,
    width: "60%",
  },
  errorText: {
    color: "#FF7754",
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

export default EmailSignIn;
