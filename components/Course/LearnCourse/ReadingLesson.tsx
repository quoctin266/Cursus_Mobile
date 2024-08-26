import React from "react";
import { View, useWindowDimensions, Text, StyleSheet } from "react-native";
import { IReadingLessonProps } from "../../../custom/component.props";
import RenderHTML from "react-native-render-html";

function ReadingLesson(props: IReadingLessonProps) {
  const { body, title } = props;

  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <RenderHTML
        enableExperimentalMarginCollapsing={true}
        contentWidth={width}
        source={{ html: body.replace("<br>", "") }}
        tagsStyles={{
          img: {
            width: 300,
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
});

export default ReadingLesson;
