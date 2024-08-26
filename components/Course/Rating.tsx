import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { ProgressBar } from "react-native-paper";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { IRatingInfoProps } from "../../custom/component.props";

function Rating(props: IRatingInfoProps) {
  const { rateInfo } = props;

  const calculateBar = (index: number) => {
    switch (index) {
      case 0:
        return rateInfo.fiveStar;
      case 1:
        return rateInfo.fourStar;
      case 2:
        return rateInfo.threeStar;
      case 3:
        return rateInfo.twoStar;
      case 4:
        return rateInfo.oneStar;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerNumber}>{rateInfo.average.toFixed(1)}</Text>
        <Text style={styles.headerText}>course rating</Text>
      </View>

      {[0, 1, 2, 3, 4].map((item, index) => {
        return (
          <View key={index} style={styles.barContainer}>
            <ProgressBar
              progress={calculateBar(index) / 100}
              color={"#ff6000"}
              style={styles.bar}
            />

            <StarRatingDisplay
              rating={5 - index}
              starSize={18}
              starStyle={{ marginHorizontal: 0 }}
              color="#faaf00"
            />

            <Text style={styles.number}>{calculateBar(index)}%</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    gap: 8,
    alignItems: "baseline",
  },
  headerNumber: {
    fontSize: 30,
    fontWeight: "600",
  },
  headerText: {
    fontSize: 15,
    color: "#312651",
  },
  barContainer: {
    flexDirection: "row",
    gap: 12,
  },
  bar: {
    height: 20,
    width: 220,
  },
  number: {
    color: "#312651",
  },
});

export default Rating;
