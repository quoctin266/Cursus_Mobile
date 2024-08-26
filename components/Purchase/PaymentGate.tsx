import React, { useState } from "react";
import WebView, { WebViewNavigation } from "react-native-webview";
import queryString from "query-string";
import { PaymentGateStackProps } from "../../custom/component.props";
import { ActivityIndicator, StyleSheet } from "react-native";

function PaymentGate({ route, navigation }: PaymentGateStackProps) {
  const { url } = route.params;

  const handleRedirect = (value: WebViewNavigation) => {
    if (value.url.includes("https://cursus-vip-pro.netlify.app")) {
      const { orderId, status, PayerID, paymentId } = queryString.parseUrl(
        value.url
      ).query as unknown as {
        orderId: string;
        status: string;
        PayerID: string;
        paymentId: string;
      };

      let statusBoolean = status === "true" ? true : false;
      navigation.navigate("PaymentStatus", {
        status: statusBoolean,
        orderId,
        payerId: PayerID,
        paymentId,
      });
    }
  };

  return (
    <>
      <WebView
        startInLoadingState={true}
        onNavigationStateChange={(v) => handleRedirect(v)}
        source={{
          uri: `${url}&mobile=true`,
        }}
        renderLoading={() => (
          <ActivityIndicator
            color={"#003087"}
            size={50}
            style={styles.loading}
          />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    top: "45%",
    left: "45%",
  },
});

export default PaymentGate;
