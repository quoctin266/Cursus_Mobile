import React, { useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Avatar, Button, Divider } from "react-native-paper";
import { PaymentStatusStackProps } from "../../custom/component.props";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getOrder,
  getProcessTransaction,
  patchUpdateOrder,
} from "../../services/payment.service";
import { deleteFromCart } from "../../services/cart.service";
import { removeFromCart } from "../../redux/slices/cart.slice";

function PaymentStatus({ route, navigation }: PaymentStatusStackProps) {
  const { status, orderId, payerId, paymentId } = route.params;

  const { id } = useAppSelector((state) => state.auth.userInfo);
  const { itemsList } = useAppSelector((state) => state.cart);

  const dispatch = useAppDispatch();

  const { data, isLoading } = useQuery({
    queryKey: ["fetchOrderDetail", orderId],
    queryFn: () => {
      return getOrder(orderId);
    },
    enabled: !!orderId,
  });

  const mutation = useMutation({
    mutationFn: (orderId: string) => {
      return patchUpdateOrder(orderId);
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        itemsList.forEach((item) => {
          if (item.checked) {
            deleteFromCart(id, item.courseId);
            dispatch(removeFromCart(item.courseId));
          }
        });
      } else {
        console.log(response);
      }
    },
    retry: 3,
  });

  useEffect(() => {
    if (orderId && status === true) {
      mutation.mutate(orderId);
    }
  }, []);

  useEffect(() => {
    if (data && status === true && paymentId && payerId) {
      getProcessTransaction({
        payerId,
        paymentId,
        price: data.data.totalPrice,
        orderId,
      });
    }
  }, [data]);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (e.data.action.type === "GO_BACK") {
          navigation.push("Home");
        } else return;
        e.preventDefault();
      }),
    [navigation]
  );

  if (isLoading || mutation.isPending)
    return (
      <ActivityIndicator size={50} style={styles.loading} color={"#ff6000"} />
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusInfo}>
        <Avatar.Icon
          size={70}
          icon={status ? "check" : "close"}
          style={{ backgroundColor: status ? "#22bb33" : "#bb2124" }}
        />
        <Text style={styles.title}>
          Payment {status ? "Success" : "Failed"}
        </Text>
        <Text style={styles.description}>
          {status
            ? " Your payment was successful and you can start using your courses whenever you want."
            : "We can't process your payment, check your internet connection and try again."}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.invoice}>
          <View style={styles.row}>
            <Text style={{ color: "gray", fontSize: 16 }}>Course</Text>
            <Text style={{ fontWeight: "500", fontSize: 16 }}>
              ${data?.data?.totalPrice.toFixed(2)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={{ color: "gray", fontSize: 16 }}>Tax $ Fees</Text>
            <Text style={{ fontWeight: "500", fontSize: 16 }}>$0.00</Text>
          </View>

          <Divider />

          <View style={styles.row}>
            <Text style={{ fontSize: 16 }}>Total</Text>
            <Text
              style={{
                fontWeight: "500",
                fontSize: 16,
                color: status ? "#ff6000" : "#bb2124",
              }}
            >
              ${data?.data?.totalPrice.toFixed(2)}{" "}
              {status ? "(PAID)" : "(FAILED)"}
            </Text>
          </View>
        </View>
      </View>

      {status ? (
        <Button
          mode="contained"
          buttonColor="#ff6000"
          style={styles.btn}
          onPress={() => navigation.navigate("Home", { screen: "MyLearning" })}
        >
          <Text style={{ fontSize: 16 }}>View Course</Text>
        </Button>
      ) : (
        <Button
          mode="contained"
          buttonColor="#ff6000"
          style={styles.btn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={{ fontSize: 16 }}>Try Again</Text>
        </Button>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
    paddingHorizontal: 24,
    paddingVertical: 30,
    justifyContent: "center",
  },
  statusInfo: {
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
    marginVertical: 32,
  },
  title: {
    fontWeight: "600",
    fontSize: 24,
  },
  description: {
    color: "gray",
    fontSize: 16,
    lineHeight: 30,
  },
  invoice: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 30,
    elevation: 5,
    gap: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    paddingVertical: 10,
    borderRadius: 40,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
});

export default PaymentStatus;
