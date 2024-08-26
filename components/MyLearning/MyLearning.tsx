import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
} from "react-native";
import CategoryList from "./CategoryList";
import { useAppSelector } from "../../redux/hooks";
const mylearning = require("../../assets/mylearning.png");

function MyLearning() {
  const { categoryList } = useAppSelector((state) => state.category);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <View style={styles.imageContainer}>
            <Image
              source={mylearning}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
          <Text style={styles.introTitle}>What will you learn first?</Text>
          <Text style={styles.introSubtitle}>Your courses will go here.</Text>
        </View>

        <CategoryList categories={categoryList} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  intro: {
    alignItems: "center",
    marginVertical: 30,
  },
  introTitle: {
    fontSize: 24,
    marginTop: 12,
    fontWeight: "500",
  },
  introSubtitle: {
    marginTop: 12,
    fontSize: 16,
  },
  imageContainer: {
    width: 300,
    height: 150,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  listContainer: {
    marginVertical: 30,
  },
  listTitle: {
    fontSize: 18,
  },
  category: {
    marginTop: 20,
    width: "100%",
  },
});

export default MyLearning;
