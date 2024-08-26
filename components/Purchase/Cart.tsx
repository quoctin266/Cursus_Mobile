import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CartStackProps } from "../../custom/component.props";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useMutation, useQueries } from "@tanstack/react-query";
import { getCourseDetail } from "../../services/course.service";
import { getUserInfo } from "../../services/user.service";
import { ICourse } from "../../custom/data.interface";
import ResultList from "../Search/ResultList";
import { Button, Snackbar } from "react-native-paper";
import { changeStatusAllItems } from "../../redux/slices/cart.slice";
import { ICreateOrder } from "../../custom/request.interface";
import { postCreateOrder } from "../../services/payment.service";

function Cart({ navigation }: CartStackProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [isError, setIsError] = useState(false);

  const { itemsList } = useAppSelector((state) => state.cart);
  const { categoryList } = useAppSelector((state) => state.category);

  const dispatch = useAppDispatch();
  const { id: userId } = useAppSelector((state) => state.auth.userInfo);
  const courseQueries = useQueries({
    queries:
      itemsList?.length > 0
        ? itemsList?.map((item) => {
            return {
              queryKey: ["courseDetail", item.courseId],
              queryFn: () => {
                return getCourseDetail(item.courseId);
              },
            };
          })
        : [],
  });

  const allChecked = itemsList.every((item) => item.checked === true);
  let courseList: ICourse[] = [];
  let totalPrice = 0;

  if (
    courseQueries?.length > 0 &&
    courseQueries[courseQueries.length - 1]?.data
  ) {
    courseList = courseQueries.map((result) => {
      return result?.data?.data;
    });
  }

  const instructorQueries = useQueries({
    queries:
      courseList.length > 0
        ? courseList.map((course) => {
            return {
              queryKey: ["instructor", course?.creatorId],
              queryFn: () => {
                return getUserInfo(course?.creatorId);
              },
            };
          })
        : [],
  });

  if (
    instructorQueries?.length > 0 &&
    instructorQueries[instructorQueries.length - 1]?.data &&
    courseList.length > 0
  ) {
    courseList.forEach((course) => {
      instructorQueries.forEach((result) => {
        if (course?.creatorId === result?.data?.data?._id) {
          course.instructor = result?.data?.data?.username;
        }
      });

      categoryList.forEach((category) => {
        if (course.categoryId === category._id) course.category = category.name;
      });

      const checked = itemsList.find(
        (item) => item.courseId === course._id
      ).checked;
      if (checked) totalPrice += course.price;
    });
  }

  const mutation = useMutation({
    mutationFn: (data: ICreateOrder) => {
      return postCreateOrder(data);
    },
    onSuccess: (response) => {
      if (response.status === 201) {
        const orderCourses = courseList.filter((course) =>
          response.data.courseId.includes(course._id)
        );

        navigation.navigate("Checkout", {
          courseList: orderCourses,
          order: response.data,
        });
      } else {
        console.log(response);
      }
    },
    retry: 3,
  });

  const handleCheckout = () => {
    const checkedCourses: string[] = [];
    itemsList.forEach((item) => {
      if (item.checked) checkedCourses.push(item.courseId);
    });

    mutation.mutate({ userId, paymentMethod: 1, coursesId: checkedCourses });
  };

  return (
    <SafeAreaView style={styles.container}>
      {itemsList.length > 0 ? (
        <>
          <View style={styles.listContainer}>
            <View style={styles.header}>
              <Text style={styles.quantity}>
                {itemsList.length} {itemsList.length > 1 ? "items" : "item"}
              </Text>

              {allChecked ? (
                <Button
                  icon={"close"}
                  mode="contained"
                  buttonColor="#ff6000"
                  contentStyle={{ flexDirection: "row-reverse" }}
                  style={{ borderRadius: 6 }}
                  onPress={() => dispatch(changeStatusAllItems(false))}
                >
                  Total
                </Button>
              ) : (
                <Button
                  icon={"check"}
                  mode="contained"
                  buttonColor="#ff6000"
                  contentStyle={{ flexDirection: "row-reverse" }}
                  style={{ borderRadius: 6 }}
                  onPress={() => dispatch(changeStatusAllItems(true))}
                >
                  Total
                </Button>
              )}
            </View>

            {courseList && courseList.length > 0 && (
              <ResultList
                courseList={courseList}
                setAlert={setAlert}
                setShowAlert={setShowAlert}
                setIsError={setIsError}
              />
            )}
          </View>

          <View style={styles.footer}>
            <View>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalNumber}>${totalPrice.toFixed(2)}</Text>
            </View>

            <Button
              icon="arrow-right"
              mode="contained"
              contentStyle={{ flexDirection: "row-reverse", gap: 8 }}
              style={{ borderRadius: 30 }}
              buttonColor="#ff6000"
              onPress={handleCheckout}
              disabled={totalPrice === 0}
            >
              Checkout
            </Button>
          </View>
        </>
      ) : (
        <>
          <View style={styles.emptyList}>
            <MaterialIcons name="shopping-cart" size={26} color="black" />
            <Text style={styles.promptText}>Add courses</Text>
            <Text>Your cart is empty</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Home", { screen: "Browse" })}
          >
            <Text style={styles.btnText}>Browse courses</Text>
          </TouchableOpacity>
        </>
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
    paddingTop: 16,
  },
  button: {
    paddingVertical: 16,
    backgroundColor: "#ff6000",
  },
  btnText: {
    textAlign: "center",
    fontWeight: "800",
    color: "white",
    fontSize: 18,
  },
  emptyList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  promptText: {
    fontWeight: "600",
    fontSize: 18,
    marginTop: 12,
  },
  listContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 12,
  },
  quantity: {
    fontSize: 24,
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "white",
    elevation: 5,
    paddingVertical: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },
  totalText: {
    color: "gray",
    fontSize: 16,
  },
  totalNumber: {
    fontWeight: "600",
    fontSize: 20,
  },
});

export default Cart;
