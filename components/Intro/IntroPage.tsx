import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import IntroCarousel from "./IntroCarousel";
import { IntroStackProps } from "../../custom/component.props";
import { getAllCategories } from "../../services/category.service";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "../../redux/hooks";
import { saveList } from "../../redux/slices/category.slice";

function IntroPage({ navigation }: IntroStackProps) {
  const dispatch = useAppDispatch();

  const { isLoading, error, data } = useQuery({
    queryKey: ["fetchCategories"],
    queryFn: () => {
      return getAllCategories();
    },
  });

  if (data) {
    dispatch(saveList(data.data));
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.intro}>
        <IntroCarousel />
      </View>
      <View style={styles.bottomTabs}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.tabText}>Browse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.tabText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  intro: {
    backgroundColor: "black",
    flex: 1,
  },
  bottomTabs: {
    flexDirection: "row",
    backgroundColor: "#F3F4F8",
  },
  tab: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  tabText: {
    fontWeight: "600",
    fontSize: 16,
  },
});

export default IntroPage;
