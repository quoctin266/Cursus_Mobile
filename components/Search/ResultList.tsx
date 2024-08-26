import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import CourseHorizontal from "../Course/CourseHorizontal";
import { IResultListProps } from "../../custom/component.props";
import Checkbox from "expo-checkbox";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../custom/router.types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ICourse } from "../../custom/data.interface";
import {
  removeFromCart,
  toggleItemCheckout,
} from "../../redux/slices/cart.slice";
import SwipeableRow from "../Common/SwipeableRow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFromCart } from "../../services/cart.service";

function ResultList(props: IResultListProps) {
  const { courseList, setAlert, setIsError, setShowAlert } = props;

  const { itemsList } = useAppSelector((state) => state.cart);
  const { id } = useAppSelector((state) => state.auth.userInfo);

  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<RootStackParamList>>();

  const mutation = useMutation({
    mutationFn: (data: { userId: string; courseId: string }) => {
      return deleteFromCart(data.userId, data.courseId);
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["fetchCartItems"] });
        dispatch(removeFromCart(response.data[0].courseId));
        setAlert(response.message);
        setIsError(false);
      } else {
        if (response.message) setAlert(response.message);
        else setAlert(response.error as string);
        setIsError(true);
      }
      setShowAlert(true);
    },
    retry: 3,
  });

  const findCheckedState = (course: ICourse) => {
    return itemsList.find((item) => item.courseId === course._id)?.checked;
  };

  const handleRemove = (courseId: string) => {
    mutation.mutate({
      courseId,
      userId: id,
    });
  };

  return (
    <>
      <FlatList
        contentContainerStyle={{ rowGap: 12, paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
        data={courseList}
        renderItem={({ item }) => (
          <>
            {route.name !== "Cart" ? (
              <CourseHorizontal course={item} key={item._id} />
            ) : (
              <>
                {mutation.variables?.courseId === item._id &&
                mutation.isPending ? (
                  <ActivityIndicator color={"#ff6000"} size={"large"} />
                ) : (
                  <SwipeableRow handleRemove={handleRemove} courseId={item._id}>
                    <View style={styles.courseContainer}>
                      <CourseHorizontal course={item} />

                      <Checkbox
                        style={styles.checkbox}
                        value={findCheckedState(item)}
                        onValueChange={() =>
                          dispatch(toggleItemCheckout(item._id))
                        }
                        color={findCheckedState(item) ? "#4630EB" : undefined}
                      />
                    </View>
                  </SwipeableRow>
                )}
              </>
            )}
          </>
        )}
        ListEmptyComponent={() => (
          <Text style={{ marginLeft: 16 }}>No courses found</Text>
        )}
        keyExtractor={(item) => item._id}
      />
    </>
  );
}

const styles = StyleSheet.create({
  courseContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    position: "absolute",
    right: 20,
    top: 10,
  },
});

export default ResultList;
