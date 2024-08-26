import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ICategoryList } from "../../custom/component.props";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../custom/router.types";

function CategoryList(props: ICategoryList) {
  const { categories } = props;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.listContainer}>
      <Text style={styles.listTitle}>Browse categories</Text>
      {categories.map((item, index) => {
        return (
          <TouchableOpacity
            key={item._id}
            style={styles.category}
            onPress={() =>
              navigation.navigate("CategorySearch", { category: item })
            }
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginVertical: 30,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  category: {
    marginTop: 20,
    width: "100%",
  },
});

export default CategoryList;
