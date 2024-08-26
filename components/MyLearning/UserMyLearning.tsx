import { useQueries, useQuery } from "@tanstack/react-query";
import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Button,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getEnrolledCourses } from "../../services/course.service";
import { useAppSelector } from "../../redux/hooks";
import { getUserInfo } from "../../services/user.service";
import CourseHorizontal from "../Course/CourseHorizontal";

function UserMyLearning() {
  const { id } = useAppSelector((state) => state.auth.userInfo);
  const { categoryList } = useAppSelector((state) => state.category);

  const { isLoading, data } = useQuery({
    queryKey: ["fetchUserCourses", id],
    queryFn: () => {
      return getEnrolledCourses(id);
    },
  });

  const userQueries = useQueries({
    queries:
      data?.data?.length > 0
        ? data.data?.map((course) => {
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

  if (data && userQueries[userQueries.length - 1]?.data) {
    data.data.forEach((course) => {
      categoryList.forEach((category) => {
        if (course.categoryId === category._id) course.category = category.name;
      });

      userQueries.forEach((result) => {
        if (course.creatorId === result.data.data._id)
          course.instructor = result.data.data.username;
      });
    });
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <FlatList
          contentContainerStyle={{ rowGap: 12, paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          data={data.data}
          renderItem={({ item }) => (
            <CourseHorizontal course={item} key={item._id} button={true} />
          )}
          ListEmptyComponent={() => (
            <Text style={{ marginLeft: 16 }}>No courses found</Text>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F8",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
});

export default UserMyLearning;
