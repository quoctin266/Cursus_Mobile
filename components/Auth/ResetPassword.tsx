import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ResetPasswordStackProps } from "../../custom/component.props";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { EMAIL_PATTERN } from "./EmailSignIn";
import { Snackbar, TextInput } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { postSendResetPWRequest } from "../../services/auth.service";

function ResetPassword({ route, navigation }: ResetPasswordStackProps) {
  const { email } = route.params;

  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");

  const refEmail = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    defaultValues: {
      email: email ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { email: string }) => {
      return postSendResetPWRequest(data);
    },
    onSuccess: (response, data) => {
      if (response.status === 201) {
        navigation.navigate("RequestStatus", { email: data.email });
      } else {
        if (response.message) setAlert(response.message);
        else setAlert(response.error as string);
        setShowAlert(true);
      }
    },
    retry: 3,
  });

  const onInvalid: SubmitErrorHandler<{ email: string }> = (errors) => {
    refEmail.current?.focus();
  };

  const onSubmit: SubmitHandler<{ email: string }> = (data) => {
    mutation.mutate(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>
          Enter the email associated with your account and we will send you a
          link to reset your password
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
            Reset password
          </Text>
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
  errorText: {
    color: "#FF7754",
  },
  button: {
    backgroundColor: "#FAFAFC",
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignSelf: "flex-end",
    marginTop: 12,
    flexDirection: "row",
    gap: 5,
  },
  loadingBtn: {
    backgroundColor: "#C1C0C8",
  },
  btnText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingText: {
    color: "#83829A",
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
    fontSize: 16,
  },
  form: {
    width: "100%",
    gap: 16,
    marginTop: 30,
    flex: 4,
  },
});

export default ResetPassword;
