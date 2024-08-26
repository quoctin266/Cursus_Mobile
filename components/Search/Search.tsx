import React, { useRef, useState } from "react";
import { SafeAreaView, Text, StyleSheet, ScrollView, View } from "react-native";
import CategoryList from "../MyLearning/CategoryList";
import CategoryTags from "../Home/CategoryTags";
import { SearchStackProps } from "../../custom/component.props";
import CustomSearchBar from "./CustomSearchBar";
import { useAppSelector } from "../../redux/hooks";

const tags = [
  {
    _id: "1",
    name: "python",
  },
  {
    _id: "2",
    name: "java",
  },
  {
    _id: "3",
    name: "excel",
  },
  {
    _id: "4",
    name: "sql",
  },
  {
    _id: "5",
    name: "javascript",
  },
  {
    _id: "6",
    name: "digital marketing",
  },
  {
    _id: "7",
    name: "power bi",
  },
  {
    _id: "8",
    name: "aws",
  },
  {
    _id: "9",
    name: "react",
  },
  {
    _id: "10",
    name: "sap",
  },
  {
    _id: "11",
    name: "c#",
  },
  {
    _id: "12",
    name: "photoshop",
  },
];

function Search({ navigation, route }: SearchStackProps) {
  const { categoryList } = useAppSelector((state) => state.category);

  return (
    <SafeAreaView style={styles.container}>
      <CustomSearchBar />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.tagContainer}>
          <Text style={styles.tagTitle}>Top searches</Text>
          <CategoryTags
            categories={tags}
            columnsNum={3}
            routeName={route.name}
          />
        </View>

        <View style={{ marginHorizontal: 16 }}>
          <CategoryList categories={categoryList} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
  },

  tagContainer: {
    marginTop: 24,
  },
  tagTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 12,
    marginLeft: 16,
  },
});

export default Search;
