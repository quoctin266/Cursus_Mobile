import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { PASSWORD_PATTERN } from "../Auth/EmailSignIn";
import { TextInput } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { IChangePW } from "../../custom/request.interface";
import { postChangePassword } from "../../services/auth.service";
import { IChangePWProps } from "../../custom/component.props";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateGoogleAuth } from "../../redux/slices/auth.slice";

interface Inputs {
  confirmNewPassword: string;

  newPassword: string;
}

function ChangePW(props: IChangePWProps) {
  const { setAlert, setIsError, setPWVerified, setShowAlert } = props;
  const [showNewPW, setShowNewPW] = useState(true);
  const [showConfirmPW, setShowConfirmPW] = useState(true);

  const { id } = useAppSelector((state) => state.auth.userInfo);
  const dispatch = useAppDispatch();

  const {
    watch,
    control: controlChangePW,
    handleSubmit: handleSubmitChangePW,
    formState: { errors: errorsChangePW },
  } = useForm<Inputs>();

  const password = watch("newPassword", "");

  const mutation = useMutation({
    mutationFn: (data: IChangePW) => {
      return postChangePassword(data);
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        dispatch(updateGoogleAuth(response.data.googleAuth));
        setPWVerified(false);
        setAlert(response.message);
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

  const onSubmitChangePW: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({ userId: id, ...data });
  };

  return (
    <View style={styles.form}>
      <Text style={{ fontWeight: "600", fontSize: 16 }}>Change password</Text>

      <View style={{ marginBottom: 16, marginTop: 12 }}>
        <Controller
          control={controlChangePW}
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
              placeholder="Enter new password"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showNewPW}
              right={
                <TextInput.Icon
                  color={"gray"}
                  icon={showNewPW ? "eye-off" : "eye"}
                  onPress={() => setShowNewPW(!showNewPW)}
                />
              }
            />
          )}
          name="newPassword"
        />
        {errorsChangePW.newPassword && (
          <Text style={styles.errorText}>
            {errorsChangePW.newPassword.message}
          </Text>
        )}
      </View>

      <View style={{ marginBottom: 16, marginTop: 12 }}>
        <Controller
          control={controlChangePW}
          rules={{
            required: "Must confirm password",
            pattern: {
              value: PASSWORD_PATTERN,
              message: "Please enter a valid password",
            },
            validate: (value) => {
              if (value !== password) return "Passwords do not match";
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label=""
              mode="outlined"
              activeOutlineColor="black"
              placeholder="Re-type new password"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showConfirmPW}
              right={
                <TextInput.Icon
                  color={"gray"}
                  icon={showConfirmPW ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmPW(!showConfirmPW)}
                />
              }
            />
          )}
          name="confirmNewPassword"
        />
        {errorsChangePW.confirmNewPassword && (
          <Text style={styles.errorText}>
            {errorsChangePW.confirmNewPassword.message}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          mutation.isPending ? { backgroundColor: "#ff9c60" } : {},
        ]}
        disabled={mutation.isPending}
        onPress={handleSubmitChangePW(onSubmitChangePW)}
      >
        {mutation.isPending && <ActivityIndicator color={"white"} />}
        <Text style={styles.btnText}>Change password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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

export default ChangePW;
