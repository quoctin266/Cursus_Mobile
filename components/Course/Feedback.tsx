import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { IFeedbackProps } from "../../custom/component.props";
import moment from "moment";

function Feedback(props: IFeedbackProps) {
  const { feedback } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{feedback.username}</Text>

      <View style={styles.header}>
        <StarRatingDisplay
          rating={feedback.rating}
          starSize={18}
          starStyle={{ marginHorizontal: 0 }}
          color="#faaf00"
        />
        <Text style={styles.time}>
          {" "}
          {moment().diff(moment(feedback.createdAt), "days") > 0 &&
            `${moment().diff(moment(feedback.createdAt), "days")} days ago`}
          {moment().diff(moment(feedback.createdAt), "hours") > 0 &&
            moment().diff(moment(feedback.createdAt), "hours") < 24 &&
            `${moment().diff(moment(feedback.createdAt), "hours")} hours ago`}
          {moment().diff(moment(feedback.createdAt), "minutes") > 0 &&
            moment().diff(moment(feedback.createdAt), "minutes") < 60 &&
            `${moment().diff(
              moment(feedback.createdAt),
              "minutes"
            )} minutes ago`}
          {moment().diff(moment(feedback.createdAt), "seconds") > 0 &&
            moment().diff(moment(feedback.createdAt), "seconds") < 60 &&
            `${moment().diff(
              moment(feedback.createdAt),
              "seconds"
            )} seconds ago`}
        </Text>
      </View>

      <Text style={styles.content}>{feedback.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
  },
  time: {
    fontSize: 13,
    color: "#312651",
  },
  content: {
    fontSize: 15,
  },
});

export default Feedback;
