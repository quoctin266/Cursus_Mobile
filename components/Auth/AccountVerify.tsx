import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AccountVerifyStackProps } from "../../custom/component.props";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { Button, Snackbar } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { postCheckOtp, postResendOtp } from "../../services/auth.service";
import { ICheckOtp } from "../../custom/request.interface";

const regex = /^[0-9]{1,6}$/;

function maskString(str: string) {
  if (str.length <= 4) return str;
  if (str.length <= 6) {
    let masked =
      str.substring(0, 2) +
      "*".repeat(str.length - 4) +
      str.substring(str.length - 2);
    return masked;
  } else {
    let masked =
      str.substring(0, 3) +
      "*".repeat(str.length - 6) +
      str.substring(str.length - 3);
    return masked;
  }
}

function AccountVerify({ route, navigation }: AccountVerifyStackProps) {
  const { message, email } = route.params;

  const [count, setCount] = useState(59);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count > 0) setCount(count - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [count]);

  const resendOtpMutation = useMutation({
    mutationFn: (data: { email: string }) => {
      return postResendOtp(data);
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        setCount(59);
        setAlert("Check your email for new otp");
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

  const checkOtpMutation = useMutation({
    mutationFn: (data: ICheckOtp) => {
      return postCheckOtp(data);
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        navigation.navigate("VerifySuccess");
      } else {
        setIsError(true);
        if (response.message) setAlert(response.message);
        else setAlert(response.error as string);
        setShowAlert(true);
      }
    },
    retry: 3,
  });

  const handleChangeCode = (code: string) => {
    if (!code.match(regex)) {
      setError("Invalid code");
    } else setError("");
    setOtp(code);
  };

  const handleSubmit = () => {
    if (otp.length < 6 || !otp.match(regex)) {
      setError("Invalid code");
      return;
    }
    if (count === 0) {
      setError("Code expired");
      return;
    }

    if (error) return;

    checkOtpMutation.mutate({ otp, email });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.description}>{message}</Text>
        <Text style={styles.description}>
          We sent your code to{" "}
          <Text>
            {maskString(email.split("@")[0]).concat(`@${email.split("@")[1]}`)}
          </Text>
        </Text>
        <Text style={styles.description}>
          This code will expire in{" "}
          <Text style={styles.count}>
            00: {count < 10 ? `0${count}` : count}{" "}
          </Text>
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <OTPInputView
          style={{ height: 200 }}
          pinCount={6}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          code={otp}
          onCodeChanged={handleChangeCode}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={{ flex: 2, justifyContent: "space-evenly" }}>
        <Button
          mode="contained"
          buttonColor="#ff6000"
          style={styles.button}
          onPress={handleSubmit}
          loading={checkOtpMutation.isPending}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Button>
        {resendOtpMutation.isPending ? (
          <Text style={styles.loadingText}>Sending...</Text>
        ) : (
          <TouchableOpacity onPress={() => resendOtpMutation.mutate({ email })}>
            <Text style={styles.resendText}>Resend OTP Code</Text>
          </TouchableOpacity>
        )}
      </View>

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
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "500",
    fontSize: 30,
    marginBottom: 8,
  },
  count: {
    color: "#ff6000",
  },
  description: {
    fontSize: 16,
    color: "gray",
    marginBottom: 8,
  },
  underlineStyleBase: {
    width: 35,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: "gray",
    color: "black",
    fontSize: 20,
  },
  underlineStyleHighLighted: {
    borderColor: "#ff6000",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
  },
  resendText: {
    textAlign: "center",
    color: "gray",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  loadingText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
  },
  errorText: {
    color: "#FF7754",
    marginTop: 18,
  },
});

export default AccountVerify;
