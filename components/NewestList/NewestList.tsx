import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { getCourseList } from "../../services/course.service";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../../services/user.service";
import ResultList from "../Search/ResultList";

function NewestList() {
  const categories = useAppSelector((state) => state.category.categoryList);

  const { isLoading: isLoadingNewest, data: dataNewest } = useQuery({
    queryKey: ["fetchNewestCourses"],
    queryFn: () => {
      return getCourseList(
        { status: "approved", sortDescending: true, sortBy: "createdAt" },
        1,
        10
      );
    },
  });

  const userQueriesNewest = useQueries({
    queries:
      dataNewest?.data?.items?.length > 0
        ? dataNewest.data.items?.map((course) => {
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
    isLoadingNewest ||
    (userQueriesNewest.length > 0 &&
      userQueriesNewest[userQueriesNewest.length - 1].isLoading)
  )
    return (
      <ActivityIndicator size={50} style={styles.loading} color={"#ff6000"} />
    );

  if (dataNewest && userQueriesNewest.length > 0) {
    dataNewest.data.items.forEach((course) => {
      categories.forEach((category) => {
        if (course.categoryId === category._id) course.category = category.name;
      });

      userQueriesNewest.forEach((result) => {
        if (course.creatorId === result.data.data._id)
          course.instructor = result.data.data.username;
      });
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ResultList courseList={dataNewest.data.items} />
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

export default NewestList;
