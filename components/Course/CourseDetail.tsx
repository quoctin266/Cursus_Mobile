import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  NativeScrollEvent,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CourseDetailStackProps } from "../../custom/component.props";

import { StarRatingDisplay } from "react-native-star-rating-widget";
import {
  FontAwesome6,
  MaterialIcons,
  Fontisto,
  FontAwesome,
} from "@expo/vector-icons";
import Feedback from "./Feedback";
import Rating from "./Rating";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import moment from "moment";
import { getAllFeedbacks } from "../../services/feedback.service";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getUserInfo } from "../../services/user.service";
import { IFeedback, IRateInfo } from "../../custom/data.interface";
import Curriculum from "./Curriculum";
import { postAddToCart } from "../../services/cart.service";
import { addToCart } from "../../redux/slices/cart.slice";
import { Snackbar } from "react-native-paper";

function CourseDetail({ route, navigation }: CourseDetailStackProps) {
  const { course } = route.params;

  const [showFooter, setShowFooter] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [isError, setIsError] = useState(false);

  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);
  const { itemsList } = useAppSelector((state) => state.cart);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const videoRef = useRef(null);

  const mutation = useMutation({
    mutationFn: (data: {
      courses: string[];
      userId: string;
      toCart: boolean;
    }) => {
      return postAddToCart(data);
    },
    onSuccess: (response, data) => {
      if (response.status === 201) {
        queryClient.invalidateQueries({ queryKey: ["fetchCartItems"] });
        dispatch(
          addToCart({
            ...response.data[0],
            checked: true,
          })
        );
        setAlert(response.message);
        setIsError(false);
        if (data.toCart) navigation.navigate("Cart");
      } else {
        setIsError(true);
        if (response.message) setAlert(response.message);
        else setAlert(response.error as string);
      }
      setShowAlert(true);
    },
    retry: 3,
  });

  const { isLoading: isLoadingInstructor, data: dataInstructor } = useQuery({
    queryKey: ["fetchInstructorDetail", course.creatorId],
    queryFn: () => {
      return getUserInfo(course.creatorId);
    },
    enabled: !!course,
  });

  const { isLoading, data } = useQuery({
    queryKey: ["fetchFeedbacks"],
    queryFn: () => {
      return getAllFeedbacks();
    },
  });

  const userQueries = useQueries({
    queries:
      data?.data?.length > 0
        ? data.data?.map((feedback) => {
            return {
              queryKey: ["user", feedback.userId],
              queryFn: () => {
                return getUserInfo(feedback.userId);
              },
            };
          })
        : [],
  });

  if (
    isLoading ||
    (userQueries.length > 0 && userQueries[userQueries.length - 1].isLoading) ||
    isLoadingInstructor
  )
    return (
      <ActivityIndicator size={50} style={styles.loading} color={"#ff6000"} />
    );

  let courseFeedbackList: IFeedback[] = [];
  let rateInfo: IRateInfo = {
    average: 0,
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
  };

  if (data && userQueries.length > 0) {
    data.data.forEach((feedback) => {
      userQueries.forEach((result) => {
        if (feedback.userId === result?.data?.data._id)
          feedback.username = result.data.data.username;
      });
    });

    courseFeedbackList = data.data.filter(
      (item) => item.courseId === course._id
    );

    let sumRating = 0;
    let oneStar: number,
      twoStar: number,
      threeStar: number,
      fourStar: number,
      fiveStar: number;
    oneStar = twoStar = threeStar = fourStar = fiveStar = 0;

    for (const item of courseFeedbackList) {
      sumRating += item.rating;
      switch (item.rating) {
        case 1:
          oneStar++;
          break;
        case 2:
          twoStar++;
          break;
        case 3:
          threeStar++;
          break;
        case 4:
          fourStar++;
          break;
        case 5:
          fiveStar++;
          break;
        default:
          break;
      }
    }

    if (courseFeedbackList.length > 0) {
      let rateResult = {
        average: Math.round((sumRating / courseFeedbackList.length) * 2) / 2,
        oneStar: Math.floor((oneStar / courseFeedbackList.length) * 100),
        twoStar: Math.floor((twoStar / courseFeedbackList.length) * 100),
        threeStar: Math.floor((threeStar / courseFeedbackList.length) * 100),
        fourStar: Math.floor((fourStar / courseFeedbackList.length) * 100),
        fiveStar: Math.floor((fiveStar / courseFeedbackList.length) * 100),
      };
      rateInfo = { ...rateResult };
    }
  }

  const handleScroll = (e: NativeScrollEvent) => {
    const { layoutMeasurement, contentOffset, contentSize } = e;
    if (contentOffset.y > layoutMeasurement.height) setShowFooter(true);
    else setShowFooter(false);
  };

  const handleAddCart = () => {
    if (!isAuthenticated) {
      Alert.alert("", "Please sign in to add items to your cart.", [
        {
          text: "Cancel",
        },
        {
          text: "Sign In",
          onPress: () => navigation.navigate("SignIn"),
        },
      ]);
      return;
    }
    mutation.mutate({
      courses: [course._id],
      userId: userInfo.id,
      toCart: false,
    });
  };

  const handleBuy = () => {
    if (!isAuthenticated) {
      Alert.alert("", "Sign in to enroll in this course.", [
        {
          text: "Cancel",
        },
        {
          text: "Sign In",
          onPress: () => navigation.navigate("SignIn"),
        },
      ]);
      return;
    }
    mutation.mutate({
      courses: [course._id],
      userId: userInfo.id,
      toCart: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => handleScroll(nativeEvent)}
      >
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() =>
            navigation.navigate("PreviewCourse", {
              videoUrl: videoRef?.current.getPreviewVideo(),
            })
          }
        >
          <Image
            source={{ uri: course.imageUrl }}
            resizeMode="cover"
            style={styles.image}
          />
          <View style={styles.previewBtn}>
            <FontAwesome name="play" size={70} color="#FAFAFC" />
            <Text style={styles.previewText}>Preview this course</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{course.title}</Text>
          <Text style={styles.intro}>{course.body}</Text>

          <View style={styles.rating}>
            <Text style={styles.ratingNumber}>
              {rateInfo.average.toFixed(1)}
            </Text>
            <StarRatingDisplay
              rating={rateInfo.average}
              starSize={18}
              starStyle={{ marginHorizontal: 0 }}
              color="#faaf00"
            />
          </View>

          <View style={styles.detailContainer}>
            <View style={styles.instructorContainer}>
              <Text>Created by </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("InstructorDetail", {
                    instructor: dataInstructor.data,
                  })
                }
              >
                <Text style={styles.instructor}>{course.instructor}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.detail}>
              <FontAwesome6 name="user-group" size={11} color="black" />
              <Text>{course.students.length} students enrolled</Text>
            </View>

            <View style={styles.detail}>
              <MaterialIcons name="category" size={13} color="black" />
              <Text>{course.category}</Text>
            </View>

            <View style={styles.detail}>
              <Fontisto name="date" size={13} color="black" />
              <Text>
                Published at {moment(course.createdAt).format("DD/MM/YYYY")}
              </Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>${course.price.toFixed(2)}</Text>
              <Text style={styles.oldPrice}>$99.99</Text>
            </View>
          </View>
        </View>

        {course.students.includes(userInfo.id) ? (
          <>
            <Text style={{ marginBottom: 12, color: "gray" }}>
              You have enrolled in this course
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("LearnCourse", { course })}
            >
              <Text style={styles.btnText}>Go to course</Text>
            </TouchableOpacity>
          </>
        ) : itemsList.find((item) => item.courseId === course._id) ? (
          <>
            <TouchableOpacity
              style={styles.buttonCart}
              onPress={() => navigation.navigate("Cart")}
            >
              <Text style={styles.btnCartText}>Go to cart</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.button,
                mutation.isPending ? { backgroundColor: "#ff9c60" } : {},
              ]}
              disabled={mutation.isPending}
              onPress={() => handleBuy()}
            >
              {mutation.isPending && <ActivityIndicator color={"white"} />}
              <Text style={styles.btnText}>Buy now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttonCart,
                mutation.isPending ? { borderColor: "#717171" } : {},
              ]}
              disabled={mutation.isPending}
              onPress={() => handleAddCart()}
            >
              {mutation.isPending && <ActivityIndicator color={"black"} />}
              <Text style={styles.btnCartText}>Add to cart</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.detailContainer}>
          <Text style={styles.title}>Requirements</Text>

          <Text style={styles.requirementItem}>
            {"\u25CF"} Javascript + HTML + CSS fundamentals are absolutely
            required
          </Text>

          <Text style={styles.requirementItem}>
            {"\u25CF"} You DON'T need to be a Javascript expert to succeed in
            this course!
          </Text>

          <Text style={styles.requirementItem}>
            {"\u25CF"} ES6+ Javascript knowledge is beneficial but not a
            must-have
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.title}>Description</Text>
          <Text style={{ fontSize: 15 }}>{course.body}</Text>
        </View>

        <Curriculum course={course} ref={videoRef} />

        <View style={styles.detailContainer}>
          <Text style={styles.title}>Student Feedback</Text>

          <Rating rateInfo={rateInfo} />

          <View style={styles.feedbackList}>
            {courseFeedbackList.map((item) => {
              return <Feedback key={item._id} feedback={item} />;
            })}
          </View>

          <TouchableOpacity
            style={styles.buttonCart}
            onPress={() =>
              navigation.navigate("AllFeedback", {
                feedbackList: courseFeedbackList,
                rateInfo,
              })
            }
          >
            <Text style={styles.btnCartText}>See More Reviews</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showFooter && (
        <View style={styles.footer}>
          {course.students.includes(userInfo.id) ? (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("LearnCourse", { course })}
              >
                <Text style={styles.btnText}>Go to course</Text>
              </TouchableOpacity>
            </View>
          ) : itemsList.find((item) => item.courseId === course._id) ? (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Cart")}
              >
                <Text style={styles.btnText}>Go to cart</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={{ flex: 1 }}>
                <Text style={styles.price}>${course.price}</Text>
                <Text style={styles.oldPrice}>$99.99</Text>
              </View>

              <View style={{ flex: 3 }}>
                <TouchableOpacity
                  disabled={mutation.isPending}
                  style={[
                    styles.button,
                    mutation.isPending ? { backgroundColor: "#ff9c60" } : {},
                  ]}
                  onPress={() => handleBuy()}
                >
                  {mutation.isPending && <ActivityIndicator color={"white"} />}
                  <Text style={styles.btnText}>Buy now</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    paddingHorizontal: 12,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    marginTop: 12,
    position: "relative",
  },
  previewBtn: {
    position: "absolute",
    alignItems: "center",
    gap: 20,
    top: 60,
    left: 120,
  },
  previewText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  infoContainer: {
    marginTop: 12,
  },
  name: {
    fontWeight: "500",
    fontSize: 22,
  },
  intro: {
    marginTop: 6,
    fontSize: 15,
  },
  rating: {
    flexDirection: "row",
    marginTop: 6,
    gap: 6,
    alignItems: "center",
  },
  ratingNumber: {
    fontWeight: "600",
  },
  instructorContainer: {
    flexDirection: "row",
  },
  instructor: {
    color: "#ff6000",
    fontWeight: "600",
  },
  detailContainer: {
    gap: 6,
    marginVertical: 20,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginTop: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: "600",
  },
  oldPrice: {
    textDecorationLine: "line-through",
    fontSize: 15,
    color: "#312651",
  },
  button: {
    paddingVertical: 16,
    backgroundColor: "#ff6000",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "800",
    color: "white",
    fontSize: 18,
  },
  buttonCart: {
    paddingVertical: 16,
    marginVertical: 12,
    borderColor: "black",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  btnCartText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 6,
  },
  requirementItem: {
    fontSize: 15,
    marginBottom: 6,
  },
  feedbackList: {
    marginTop: 16,
  },
  footer: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
});

export default CourseDetail;
