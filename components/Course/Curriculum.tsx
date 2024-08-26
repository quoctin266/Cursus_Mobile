import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { List } from "react-native-paper";
import { RootStackParamList } from "../../custom/router.types";
import { useQuery } from "@tanstack/react-query";
import { ICurriculumProps } from "../../custom/component.props";
import {
  getCourseQuizes,
  getCourseReadings,
  getCourseSections,
  getCourseVideos,
} from "../../services/courseContent.service";

const Curriculum = forwardRef((props: ICurriculumProps, ref) => {
  const { course } = props;

  const [expand, setExpand] = useState(true);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { isLoading: isLoadingSections, data: dataSections } = useQuery({
    queryKey: ["fetchSections", course._id],
    queryFn: () => {
      return getCourseSections(course._id);
    },
    enabled: !!course,
  });

  const { isLoading: isLoadingVideos, data: dataVideos } = useQuery({
    queryKey: ["fetchVideos", course._id],
    queryFn: () => {
      return getCourseVideos(course._id);
    },
    enabled: !!course,
  });

  const { isLoading: isLoadingReadings, data: dataReadings } = useQuery({
    queryKey: ["fetchReadings", course._id],
    queryFn: () => {
      return getCourseReadings(course._id);
    },
    enabled: !!course,
  });

  const { isLoading: isLoadingQuizes, data: dataQuizes } = useQuery({
    queryKey: ["fetchQuizes", course._id],
    queryFn: () => {
      return getCourseQuizes(course._id);
    },
    enabled: !!course,
  });

  useImperativeHandle(ref, () => ({
    getPreviewVideo() {
      if (dataSections) return dataSections.data[0].videos[0].videoUrl;
      else return "";
    },
  }));

  if (
    isLoadingSections ||
    isLoadingVideos ||
    isLoadingReadings ||
    isLoadingQuizes
  )
    return (
      <ActivityIndicator size={50} style={styles.loading} color={"#ff6000"} />
    );

  if (dataSections && dataVideos && dataReadings && dataQuizes) {
    dataSections.data.forEach((section) => {
      section.videos = dataVideos.data.filter(
        (video) => video.sectionId === section._id
      );

      section.readings = dataReadings.data.filter(
        (reading) => reading.sectionId === section._id
      );

      section.quizes = dataQuizes.data.filter(
        (quiz) => quiz.sectionId === section._id
      );
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Curriculum</Text>

      {dataSections.data.map((section, index) => {
        return (
          <List.Accordion
            title={`Section ${index + 1} - ${section.name}`}
            id={section._id}
            key={section._id}
            expanded={index === 0 ? expand : undefined}
            onPress={index === 0 ? () => setExpand(!expand) : undefined}
          >
            {section.videos.map((video) => {
              return (
                <TouchableOpacity
                  key={video._id}
                  onPress={() =>
                    navigation.navigate("PreviewCourse", {
                      videoUrl: video.videoUrl,
                    })
                  }
                >
                  <List.Item
                    title={video.title}
                    left={(props) => (
                      <List.Icon {...props} icon="play-circle-outline" />
                    )}
                    right={(props) => (
                      <List.Icon {...props} icon="monitor-eye" />
                    )}
                  />
                </TouchableOpacity>
              );
            })}

            {section.readings.map((reading) => {
              return (
                <TouchableOpacity key={reading._id}>
                  <List.Item
                    title={reading.title}
                    left={(props) => (
                      <List.Icon {...props} icon="book-open-blank-variant" />
                    )}
                  />
                </TouchableOpacity>
              );
            })}

            {section.quizes.map((quiz) => {
              return (
                <TouchableOpacity key={quiz._id}>
                  <List.Item
                    title={quiz.title}
                    left={(props) => (
                      <List.Icon {...props} icon="progress-question" />
                    )}
                  />
                </TouchableOpacity>
              );
            })}
          </List.Accordion>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 6,
    marginVertical: 20,
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 6,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
});

export default Curriculum;
