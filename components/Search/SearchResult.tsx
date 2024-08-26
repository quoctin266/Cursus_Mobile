import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { SearchResultStackProps } from "../../custom/component.props";
import ResultList from "./ResultList";
import CustomSearchBar from "./CustomSearchBar";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getCourseList } from "../../services/course.service";
import { getUserInfo } from "../../services/user.service";
import { useAppSelector } from "../../redux/hooks";

function SearchResult({ route }: SearchResultStackProps) {
  const { searchQuery } = route.params;

  const categories = useAppSelector((state) => state.category.categoryList);

  const { isLoading, data } = useQuery({
    queryKey: ["fetchCourses", searchQuery],
    queryFn: () => {
      return getCourseList({ status: "approved", searchQuery }, 1, 10);
    },
    // The query will not execute until the userId exists
    enabled: !!searchQuery,
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
      <CustomSearchBar />

      <ResultList courseList={data.data.items} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ff6000",
  },
  searchBar: {
    borderRadius: 5,
    backgroundColor: "#F3F4F8",
    height: 50,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
});

export default SearchResult;
