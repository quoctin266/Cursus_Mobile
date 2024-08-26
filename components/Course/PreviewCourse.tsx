import React, { useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { PreviewCourseStackProps } from "../../custom/component.props";
import * as ScreenOrientation from "expo-screen-orientation";

function PreviewCourse({ route }: PreviewCourseStackProps) {
  const { videoUrl } = route.params;

  const videoRef = useRef(null);

  useEffect(() => {
    async function changeScreenOrientation() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      );
    }

    changeScreenOrientation();

    return () => {
      const resetOrientation = async () => {
        await ScreenOrientation.unlockAsync();
      };

      resetOrientation();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: videoUrl }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        shouldPlay
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },
});

export default PreviewCourse;
