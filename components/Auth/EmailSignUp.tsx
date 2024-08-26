import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Snackbar, TextInput } from "react-native-paper";
import { EmailSignUpStackProps } from "../../custom/component.props";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { EMAIL_PATTERN, PASSWORD_PATTERN } from "./EmailSignIn";
import { useMutation } from "@tanstack/react-query";
import { postRegister } from "../../services/auth.service";

interface Inputs {
  email: string;

  username: string;

  password: string;
}

function EmailSignUp({ navigation }: EmailSignUpStackProps) {
  const [showPW, setShowPW] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");

  const [isPortrait, setIsPortrait] = useState(true);

  const { width, height } = useWindowDimensions();

  const refUsername = useRef(null);
  const refEmail = useRef(null);
  const refPassword = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (width > height) setIsPortrait(false);
    else setIsPortrait(true);
  }, [width, height]);

  const mutation = useMutation({
    mutationFn: (data: Inputs) => {
      return postRegister({ ...data, role: 1, mobile: true });
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        navigation.navigate("AccountVerify", {
          email: response.data.email,
          message: "Active your account to continue",
        });
      } else {
        if (response.message) setAlert(response.message);
        else setAlert(response.error as string);
        setShowAlert(true);
      }
    },
    retry: 3,
  });

  const onInvalid: SubmitErrorHandler<Inputs> = (errors) => {
    const keys = Object.keys(errors);
    if (keys.length > 0) {
      if (keys[0] === "username") {
        refUsername.current?.focus();
        return;
      }

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
        style={isPortrait ? {} : { width: "100%" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          isPortrait ? styles.scrollPortrait : styles.scrollLandscape
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>
            By clicking on "Create account" you agree to our Terms of Use and{" "}
            Privacy Policy
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            rules={{
              required: "Username is required",
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                readOnly={mutation.isPending}
                ref={refUsername}
                label="Name"
                cursorColor={errors.username ? "#FF7754" : "white"}
                contentStyle={{ backgroundColor: "black" }}
                textColor="white"
                activeUnderlineColor={errors.username ? "#FF7754" : "white"}
                underlineColor={errors.username ? "#FF7754" : "white"}
                theme={{
                  colors: {
                    surfaceVariant: "black",
                    onSurfaceVariant: errors.username ? "#FF7754" : "white",
                  },
                }}
                value={value}
                onChangeText={onChange}
              />
            )}
            name="username"
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username.message}</Text>
          )}

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

          <TouchableOpacity
            style={[styles.button, mutation.isPending && styles.loadingBtn]}
            onPress={handleSubmit(onSubmit, onInvalid)}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <ActivityIndicator size={"small"} color={"#83829A"} />
            )}
            <Text
              style={[styles.btnText, mutation.isPending && styles.loadingText]}
            >
              Create account
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[styles.loginPromp, isPortrait ? {} : { marginBottom: 50 }]}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("EmailSignIn")}>
            <Text style={{ color: "#c0c4fc", fontSize: 16 }}>Sign In</Text>
          </TouchableOpacity>
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
  boldWords: {
    fontWeight: "600",
  },
  form: {
    width: "100%",
    gap: 16,
    marginTop: 30,
  },
  button: {
    backgroundColor: "#FAFAFC",
    paddingVertical: 16,
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
  loginPromp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
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
  errorText: {
    color: "#FF7754",
  },
});

export default EmailSignUp;
