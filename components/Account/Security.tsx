import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Snackbar, TextInput } from "react-native-paper";
import { PASSWORD_PATTERN } from "../Auth/EmailSignIn";
import { useMutation } from "@tanstack/react-query";
import { IVerifyPW } from "../../custom/request.interface";
import { postVerifyPassword } from "../../services/auth.service";
import { useAppSelector } from "../../redux/hooks";
import ChangePW from "./ChangePW";

function Security() {
  const [pwVerified, setPWVerified] = useState(false);
  const [showCurrentPW, setShowCurrentPW] = useState(true);

  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [isError, setIsError] = useState(false);

  const { id, googleAuth } = useAppSelector((state) => state.auth.userInfo);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ currentPW: string }>();

  const verifyPWMutation = useMutation({
    mutationFn: (data: IVerifyPW) => {
      return postVerifyPassword(data);
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        setPWVerified(true);
      } else {
        setIsError(true);
        if (response.message) setAlert(response.message);
        else setAlert(response.error as string);
        setShowAlert(true);
      }
    },
    retry: 3,
  });

  const onSubmit: SubmitHandler<{ currentPW: string }> = (data) => {
    verifyPWMutation.mutate({ currentPassword: data.currentPW, userId: id });
    reset();
  };

  return (
    <SafeAreaView style={styles.container}>
      {pwVerified || googleAuth ? (
        <ChangePW
          setAlert={setAlert}
          setIsError={setIsError}
          setPWVerified={setPWVerified}
          setShowAlert={setShowAlert}
        />
      ) : (
        <View style={styles.form}>
          <Text style={{ fontWeight: "600", fontSize: 16 }}>
            Verify current password
          </Text>
          <View style={{ marginBottom: 16, marginTop: 12 }}>
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
                  label=""
                  mode="outlined"
                  activeOutlineColor="black"
                  placeholder="Enter current password"
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!showCurrentPW}
                  right={
                    <TextInput.Icon
                      color={"gray"}
                      icon={showCurrentPW ? "eye-off" : "eye"}
                      onPress={() => setShowCurrentPW(!showCurrentPW)}
                    />
                  }
                />
              )}
              name="currentPW"
            />
            {errors.currentPW && (
              <Text style={styles.errorText}>{errors.currentPW.message}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              verifyPWMutation.isPending ? { backgroundColor: "#ff9c60" } : {},
            ]}
            disabled={verifyPWMutation.isPending}
            onPress={handleSubmit(onSubmit)}
          >
            {verifyPWMutation.isPending && (
              <ActivityIndicator color={"white"} />
            )}
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

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
    backgroundColor: "#FAFAFC",
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: "#FAFAFC",
  },
  errorText: {
    color: "red",
    marginTop: 6,
  },
  button: {
    paddingVertical: 12,
    backgroundColor: "#ff6000",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    width: 200,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "800",
    color: "white",
    fontSize: 18,
  },
  form: {
    marginTop: 24,
    marginBottom: 12,
  },
});

export default Security;
