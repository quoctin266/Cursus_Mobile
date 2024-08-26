import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { CategorySearchStackProps } from "../../custom/component.props";
import Course from "../Course/Course";
import CourseHorizontal from "../Course/CourseHorizontal";
import InstructorList from "../Instructor/InstructorList";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getCourseList } from "../../services/course.service";
import { getInstructorsList, getUserInfo } from "../../services/user.service";
import { useAppSelector } from "../../redux/hooks";

function CategorySearch({ route }: CategorySearchStackProps) {
  const { _id, name } = route.params.category;

  const categories = useAppSelector((state) => state.category.categoryList);

  const { isLoading, data } = useQuery({
    queryKey: ["fetchCourses", _id],
    queryFn: () => {
      return getCourseList({ status: "approved", categoryId: _id }, 1, 10);
    },
    // The query will not execute until the category exists
    enabled: !!_id,
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

  const { isLoading: isLoadingInstructors, data: dataInstructors } = useQuery({
    queryKey: ["fetchInstructors"],
    queryFn: () => {
      return getInstructorsList(1, 10);
    },
  });

  const instructorQueries = useQueries({
    queries:
      dataInstructors?.data?.items?.length > 0
        ? dataInstructors.data.items?.map((instructor) => {
            return {
              queryKey: ["fetchInstructors", instructor._id],
              queryFn: () => {
                return getUserInfo(instructor._id);
              },
            };
          })
        : [],
  });

  if (
    isLoading ||
    (userQueries.length > 0 && userQueries[userQueries.length - 1].isLoading) ||
    isLoadingInstructors ||
    (instructorQueries.length > 0 &&
      instructorQueries[instructorQueries.length - 1].isLoading)
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
        if (course.creatorId === result?.data?.data._id)
          course.instructor = result.data.data.username;
      });
    });
  }

  if (dataInstructors && instructorQueries.length > 0) {
    dataInstructors.data.items.forEach((instructor) => {
      instructorQueries.forEach((result) => {
        if (instructor._id === result?.data?.data._id)
          instructor.dataCourses = result.data.data.dataCourses;
        instructor.studentCount = result?.data?.data.studentCount;
      });
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{name}</Text>

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Featured Courses</Text>

          <FlatList
            scrollEnabled={data.data.items.length > 1}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={data.data.items}
            renderItem={({ item, index }) => (
              <Course course={item} key={item._id} />
            )}
            ListEmptyComponent={() => (
              <Text style={{ marginLeft: 16 }}>No courses found</Text>
            )}
          />
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.instructorListTitle}>Top instructors</Text>
          {data.data.items.length > 0 ? (
            <InstructorList instructorList={dataInstructors.data.items} />
          ) : (
            <Text style={{ marginLeft: 16, marginTop: 16 }}>
              No instructors found
            </Text>
          )}
        </View>

        <View style={styles.totalListContainer}>
          <Text style={styles.totalListTitle}>All courses</Text>
          <View style={styles.totalList}>
            {data.data.items.map((item) => {
              return <CourseHorizontal course={item} key={item._id} />;
            })}
            {data.data.items.length === 0 && (
              <Text style={{ marginLeft: 16 }}>No courses found</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F8",
  },
  title: {
    fontWeight: "500",
    fontSize: 28,
    marginLeft: 16,
    marginTop: 16,
  },
  listContainer: {
    marginVertical: 20,
  },
  listTitle: {
    fontWeight: "500",
    fontSize: 22,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  totalListContainer: {
    marginTop: 20,
  },
  totalListTitle: {
    fontSize: 22,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  totalList: {
    gap: 12,
    paddingBottom: 16,
  },
  instructorListTitle: {
    fontWeight: "500",
    fontSize: 22,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
});

export default CategorySearch;
