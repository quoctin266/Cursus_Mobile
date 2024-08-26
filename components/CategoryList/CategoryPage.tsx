import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import CategoryList from "../MyLearning/CategoryList";
import { useAppSelector } from "../../redux/hooks";

function CategoryPage() {
  const { categoryList } = useAppSelector((state) => state.category);

  return (
    <SafeAreaView style={styles.container}>
      <CategoryList categories={categoryList} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
    paddingHorizontal: 16,
  },
});

export default CategoryPage;
