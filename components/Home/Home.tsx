import React, { useEffect, useMemo } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import Course from "../Course/Course";
import CategoryTags from "./CategoryTags";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../custom/router.types";
import { getCourseList } from "../../services/course.service";
import { getUserInfo, patchUpdateUser } from "../../services/user.service";
import { getCartItems } from "../../services/cart.service";
import { refreshCart } from "../../redux/slices/cart.slice";
import usePushToken from "../../util/usePushToken";
import { IUpdateProfile } from "../../custom/request.interface";

function Home() {
  const categories = useAppSelector((state) => state.category.categoryList);
  const { id } = useAppSelector((state) => state.auth.userInfo);
  const dispatch = useAppDispatch();

  const { expoPushToken } = usePushToken();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { data: dataCart } = useQuery({
    queryKey: ["fetchCartItems", id],
    queryFn: () => {
      return getCartItems(id);
    },
    enabled: !!id,
    // refetchIntervalInBackground: true,
    // refetchInterval: 1000 * 9,
  });

  const { data: dataUser } = useQuery({
    queryKey: ["fetchUserInfo", id],
    queryFn: () => {
      return getUserInfo(id);
    },
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (data: { userInfo: IUpdateProfile; id: string }) => {
      return patchUpdateUser(data.userInfo, data.id);
    },
    onSuccess: (response) => {
      if (response.status !== 200) {
        console.log(response);
      }
    },
    retry: 3,
  });

  useEffect(() => {
    if (dataCart) {
      dispatch(refreshCart(dataCart.data));
    }
  }, [dataCart]);

  useEffect(() => {
    if (dataUser && dataUser.data) {
      console.log(expoPushToken);
      if (expoPushToken) mutation.mutate({ userInfo: { expoPushToken }, id });
    }
  }, [dataUser, expoPushToken]);

  const { isLoading, data } = useQuery({
    queryKey: ["fetchCourses"],
    queryFn: () => {
      return getCourseList({ status: "approved" }, 1, 10);
    },
  });

  const userQueries = useQueries({
    queries:
      data?.data?.items?.length > 0
        ? data.data?.items?.map((course) => {
            return {
              queryKey: ["instructor", course.creatorId],
              queryFn: () => {
                return getUserInfo(course.creatorId);
              },
            };
          })
        : [],
  });

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
        ? dataNewest.data?.items?.map((course) => {
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
    (userQueries.length > 0 && userQueries[userQueries.length - 1].isLoading) ||
    isLoadingNewest ||
    (userQueriesNewest.length > 0 &&
      userQueriesNewest[userQueriesNewest.length - 1].isLoading)
  )
    return (
      <ActivityIndicator size={50} style={styles.loading} color={"#ff6000"} />
    );

  if (data && userQueries.length > 0) {
    data.data?.items.forEach((course) => {
      categories.forEach((category) => {
        if (course.categoryId === category._id) course.category = category.name;
      });

      userQueries.forEach((result) => {
        if (course.creatorId === result?.data?.data._id)
          course.instructor = result.data.data.username;
      });
    });
  }

  if (dataNewest && userQueriesNewest.length > 0) {
    dataNewest.data?.items.forEach((course) => {
      categories.forEach((category) => {
        if (course.categoryId === category._id) course.category = category.name;
      });

      userQueriesNewest.forEach((result) => {
        if (course.creatorId === result?.data?.data._id)
          course.instructor = result.data.data.username;
      });
    });
  }

  return (
    <SafeAreaView style={styles.homeContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.listTitle}>Featured Courses</Text>

            <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => navigation.navigate("FeatureList")}
            >
              <Text style={styles.moreBtnText}>See more</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={data.data?.items}
            renderItem={({ item, index }) => (
              <Course course={item} key={item._id} />
            )}
          />
        </View>

        <View style={styles.listContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.listTitle}>Categories</Text>

            <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => navigation.navigate("CategoryPage")}
            >
              <Text style={styles.moreBtnText}>See more</Text>
            </TouchableOpacity>
          </View>
          <CategoryTags categories={categories} columnsNum={2} />
        </View>

        <View style={styles.listContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.listTitle}>Newest Courses</Text>

            <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => navigation.navigate("NewestList")}
            >
              <Text style={styles.moreBtnText}>See more</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={dataNewest.data?.items}
            renderItem={({ item }) => <Course course={item} key={item._id} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: "#F3F4F8",
  },
  listContainer: {
    marginVertical: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  listTitle: {
    fontWeight: "600",
    fontSize: 22,
    marginHorizontal: 16,
  },
  moreBtn: {
    marginRight: 16,
  },
  moreBtnText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#ff6000",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
});

export default Home;
