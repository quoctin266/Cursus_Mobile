import React from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useAppSelector } from "../../redux/hooks";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getCourseList } from "../../services/course.service";
import { getUserInfo } from "../../services/user.service";
import CourseHorizontal from "../Course/CourseHorizontal";
import ResultList from "../Search/ResultList";

function FeatureList() {
  const categories = useAppSelector((state) => state.category.categoryList);

  const { isLoading, error, data } = useQuery({
    queryKey: ["fetchCourses"],
    queryFn: () => {
      return getCourseList({ status: "approved" }, 1, 10);
    },
  });

  const userQueries = useQueries({
    queries:
      data?.data?.items?.length > 0
        ? data.data.items?.map((course) => {
            return {
              queryKey: ["instructor", course.creatorId],
              queryFn: () => {
                return getUserInfo(course.creatorId);
              },
            };
          })
        : [],
  });

  if (
    isLoading ||
    (userQueries.length > 0 && userQueries[userQueries.length - 1].isLoading)
  )
    return (
      <ActivityIndicator size={50} style={styles.loading} color={"#ff6000"} />
    );

  if (data && userQueries.length > 0) {
    data.data.items.forEach((course) => {
      categories.forEach((category) => {
        if (course.categoryId === category._id) course.category = category.name;
      });

      userQueries.forEach((result) => {
        if (course.creatorId === result.data.data._id)
          course.instructor = result.data.data.username;
      });
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ResultList courseList={data.data.items} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
});

export default FeatureList;
