import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { ICourseProps } from "../../custom/component.props";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../../custom/router.types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toggleItemCheckout } from "../../redux/slices/cart.slice";

function CourseHorizontal(props: ICourseProps) {
  const { course, button } = props;

  const { id } = useAppSelector((state) => state.auth.userInfo);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const handlePress = () => {
    if (route.name === "Cart") {
      dispatch(toggleItemCheckout(course._id));
      return;
    }

    if (route.name === "MyLearning") {
      navigation.navigate("LearnCourse", { course });
      return;
    }

    navigation.navigate("CourseDetail", { course });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: course.imageUrl }}
          resizeMode="cover"
          style={styles.image}
        />
      </View>

      <View style={{ flexShrink: 1 }}>
        <Text style={styles.courseTitle} numberOfLines={1}>
          {course.title}
        </Text>
        <Text style={styles.category}>{course.category}</Text>
        <Text style={{ marginBottom: 3 }}>
          By <Text style={styles.author}>{course.instructor}</Text>
        </Text>
        {button ? (
          <TouchableOpacity>
            <Text style={styles.btnText}>Start course</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.courseTitle}>
            {course.students.includes(id)
              ? "Enrolled"
              : `$${course?.price.toFixed(2)}`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 5,
    backgroundColor: "#FFF",
    padding: 8,
    borderRadius: 6,
    shadowColor: "#83829A",
    marginHorizontal: 12,
    flexDirection: "row",
    gap: 16,
    flex: 1,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  courseTitle: {
    fontWeight: "500",
    fontSize: 18,
  },
  category: {
    marginVertical: 3,
  },
  author: {
    fontWeight: "600",
    marginVertical: 3,
  },
  btnText: {
    fontWeight: "800",
    color: "black",
    marginTop: 12,
  },
});

export default CourseHorizontal;
