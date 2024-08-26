import React, { useLayoutEffect } from "react";
import { SafeAreaView, Text, View, StyleSheet, ScrollView } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { AllFeedbackStackProps } from "../../custom/component.props";
import Feedback from "./Feedback";

function AllFeedback({ route, navigation }: AllFeedbackStackProps) {
  const { feedbackList, rateInfo } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "ReactJS Guide",
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Reviews</Text>
          <View style={styles.rateInfo}>
            <Text style={styles.rateNumber}>{rateInfo.average.toFixed(1)}</Text>
            <View>
              <StarRatingDisplay
                rating={rateInfo.average}
                starSize={18}
                starStyle={{ marginHorizontal: 0 }}
                color="#faaf00"
              />
              <Text style={styles.rateCount}>
                {feedbackList.length} Ratings
              </Text>
            </View>
          </View>
        </View>

        <View>
          {feedbackList.map((item) => {
            return <Feedback key={item._id} feedback={item} />;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
    paddingHorizontal: 12,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 12,
  },
  rateInfo: {
    flexDirection: "row",
    gap: 8,
  },
  rateNumber: {
    fontSize: 30,
    fontWeight: "600",
  },
  rateCount: {
    fontWeight: "500",
    fontSize: 15,
  },
});

export default AllFeedback;
