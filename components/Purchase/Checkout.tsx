import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { Button, Divider, Icon, RadioButton } from "react-native-paper";
import { CheckoutStackProps } from "../../custom/component.props";
import { useMutation } from "@tanstack/react-query";
import { ICheckout } from "../../custom/request.interface";
import { postCheckout } from "../../services/payment.service";

const gg = require("../../assets/gg.png");
const paypal = require("../../assets/paypal.png");

const paymentMethods = [
  {
    name: "Google Pay",
    value: "google",
    img: gg,
    icon: null,
  },
  {
    name: "Paypal",
    value: "paypal",
    img: paypal,
    icon: null,
  },
  {
    name: "Credit Card Or Debit",
    value: "card",
    img: null,
    icon: <Icon source="wallet-outline" size={22} color="#ff6000" />,
  },
  {
    name: "Bank Transfer",
    value: "bank",
    img: null,
    icon: <Icon source="bank-outline" size={22} color="#ff6000" />,
  },
];

function Checkout({ route, navigation }: CheckoutStackProps) {
  const { courseList, order } = route.params;
  const [value, setValue] = useState("paypal");

  const mutation = useMutation({
    mutationFn: (data: ICheckout) => {
      return postCheckout(data);
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        const { url } = response.data;

        navigation.navigate("PaymentGate", { url });
      } else {
        console.log(response);
      }
    },
    retry: 3,
  });

  const handlePayment = async () => {
    mutation.mutate({ orderId: order._id, totalPrice: order.totalPrice });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment method</Text>

          <View style={styles.sectionBody}>
            <RadioButton.Group
              onValueChange={(newValue) => setValue(newValue)}
              value={value}
            >
              {paymentMethods.map((item, index) => {
                return (
                  <TouchableHighlight
                    style={{ paddingHorizontal: 12 }}
                    activeOpacity={0.6}
                    underlayColor="#ffd5bb"
                    key={index}
                    onPress={() => setValue(item.value)}
                  >
                    <View style={styles.methodItem}>
                      <RadioButton
                        value={item.value}
                        color="#ff6000"
                        uncheckedColor="#ff6000"
                      />
                      <View style={styles.methodNameContainer}>
                        {item.img ? (
                          <Image
                            source={item.img}
                            resizeMode="contain"
                            style={styles.iconImg}
                          />
                        ) : (
                          item.icon
                        )}
                        <Text style={styles.methodName}>{item.name}</Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                );
              })}
            </RadioButton.Group>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>

          <View
            style={[
              styles.sectionBody,
              { paddingTop: 0, paddingHorizontal: 16 },
            ]}
          >
            {courseList?.map((course) => {
              return (
                <React.Fragment key={course._id}>
                  <View style={styles.course}>
                    <Image
                      source={{ uri: course.imageUrl }}
                      resizeMode="cover"
                      style={styles.courseImage}
                    />

                    <View style={{ gap: 4 }}>
                      <Text style={{ fontWeight: "500" }}>{course.title}</Text>
                      <Text style={{ color: "gray" }}>
                        By {course.instructor}
                      </Text>
                      <Text style={{ fontWeight: "500", fontSize: 16 }}>
                        ${course.price.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <Divider />
                </React.Fragment>
              );
            })}

            <View style={styles.totalPrice}>
              <Text style={{ fontWeight: "500", fontSize: 20 }}>Total</Text>
              <Text style={{ color: "red", fontSize: 20, fontWeight: "600" }}>
                ${order.totalPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <Button
          mode="contained"
          buttonColor="#ff6000"
          style={styles.confirmBtn}
          onPress={handlePayment}
          loading={mutation.isPending}
        >
          <Text style={{ fontSize: 16 }}>Continue</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
  },
  section: {
    marginHorizontal: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginVertical: 20,
  },
  sectionBody: {
    elevation: 5,
    backgroundColor: "#FFF",
    paddingVertical: 12,
    borderRadius: 6,
    shadowColor: "#83829A",
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 12,
  },
  methodNameContainer: {
    flexDirection: "row",
    gap: 20,
  },
  methodName: {
    fontWeight: "600",
    fontSize: 16,
  },
  course: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  iconImg: {
    width: 22,
    height: 22,
  },
  courseImage: {
    width: 150,
    height: 90,
    borderRadius: 5,
  },
  totalPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 12,
  },
  confirmBtn: {
    borderRadius: 5,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 40,
    paddingVertical: 10,
  },
});

export default Checkout;
