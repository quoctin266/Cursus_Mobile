import React from "react";
import { FlatList, ScrollView, TouchableOpacity } from "react-native";
import Instructor from "./Instructor";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../custom/router.types";
import { IInstructorListProps } from "../../custom/component.props";

function InstructorList(props: IInstructorListProps) {
  const { instructorList } = props;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={instructorList.length > 1}
    >
      <FlatList
        scrollEnabled={false}
        numColumns={Math.ceil([0, 1, 2, 3, 4, 5].length / 2)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={instructorList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={item._id}
            onPress={() =>
              navigation.navigate("InstructorDetail", {
                instructor: item,
              })
            }
          >
            <Instructor instructor={item} />
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

export default InstructorList;
