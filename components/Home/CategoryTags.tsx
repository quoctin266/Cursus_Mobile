import React from "react";
import { ICategoryList } from "../../custom/component.props";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../custom/router.types";
import { ICategory } from "../../custom/data.interface";

function CategoryTags(props: ICategoryList) {
  const { categories, columnsNum, routeName } = props;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSearchCategory = (category: ICategory) => {
    if (routeName !== "Search")
      navigation.navigate("CategorySearch", { category });
  };

  return (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <FlatList
        scrollEnabled={false}
        numColumns={Math.ceil(categories.length / columnsNum)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={categories}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => handleSearchCategory(item)}
          >
            <Button mode="outlined" style={styles.category} textColor="#444262">
              {item?.name}
            </Button>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  category: {
    margin: 6,
  },
});
export default CategoryTags;
