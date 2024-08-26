import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ICourseProps } from "../../custom/component.props";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../custom/router.types";
import { useAppSelector } from "../../redux/hooks";

function Course(props: ICourseProps) {
  const { course } = props;

  const { id } = useAppSelector((state) => state.auth.userInfo);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("CourseDetail", { course })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: course?.imageUrl }}
          resizeMode="cover"
          style={styles.image}
        />
      </View>

      <Text style={styles.courseTitle} numberOfLines={1}>
        {course?.title}
      </Text>
      <Text style={styles.category}>{course?.category}</Text>
      <Text>
        By <Text style={styles.author}>{course?.instructor}</Text>
      </Text>
      <Text style={styles.courseTitle}>
        {course.students.includes(id)
          ? "Enrolled"
          : `$${course?.price.toFixed(2)}`}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 5,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 6,
    shadowColor: "#83829A",
    marginHorizontal: 12,
  },
  imageContainer: {
    width: 300,
    height: 150,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  courseTitle: {
    fontWeight: "500",
    fontSize: 22,
    marginTop: 8,
    marginBottom: 6,
    width: 300,
  },
  category: {
    marginBottom: 6,
  },
  author: {
    fontWeight: "600",
  },
});

export default Course;
