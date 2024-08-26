import React from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ILecturesProps } from "../../../custom/component.props";
import { List } from "react-native-paper";

const Lectures = (props: ILecturesProps) => {
  const { isLoading, selectedLesson, data, handleSelectLesson } = props;

  if (isLoading)
    return (
      <ActivityIndicator size={50} style={styles.loading} color={"#ff6000"} />
    );

  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item, index }) => (
          <List.Accordion
            style={{ backgroundColor: "#F3F4F8" }}
            titleStyle={{ paddingVertical: 12 }}
            title={`Section ${index + 1} - ${item.name}`}
            id={item._id}
            key={item._id}
            expanded
            right={() => <></>}
          >
            {item.videos.map((video) => {
              return (
                <TouchableOpacity
                  key={video._id}
                  onPress={() => handleSelectLesson(video, "video")}
                >
                  <List.Item
                    style={[
                      { paddingLeft: 12 },
                      selectedLesson?._id === video._id && {
                        backgroundColor: "#e9e9e9",
                      },
                    ]}
                    title={video.title}
                    left={(props) => (
                      <List.Icon {...props} icon="play-circle-outline" />
                    )}
                  />
                </TouchableOpacity>
              );
            })}

            {item.readings.map((reading) => {
              return (
                <TouchableOpacity
                  key={reading._id}
                  onPress={() => handleSelectLesson(reading, "reading")}
                >
                  <List.Item
                    style={[
                      { paddingLeft: 12 },
                      selectedLesson?._id === reading._id && {
                        backgroundColor: "#e9e9e9",
                      },
                    ]}
                    title={reading.title}
                    left={(props) => (
                      <List.Icon {...props} icon="book-open-blank-variant" />
                    )}
                  />
                </TouchableOpacity>
              );
            })}

            {item.quizes.map((quiz) => {
              return (
                <TouchableOpacity
                  key={quiz._id}
                  onPress={() => handleSelectLesson(quiz, "quiz")}
                >
                  <List.Item
                    style={[
                      { paddingLeft: 12 },
                      selectedLesson?._id === quiz._id && {
                        backgroundColor: "#e9e9e9",
                      },
                    ]}
                    title={quiz.title}
                    left={(props) => (
                      <List.Icon {...props} icon="progress-question" />
                    )}
                  />
                </TouchableOpacity>
              );
            })}
          </List.Accordion>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
  },
});

export default React.memo(Lectures);
