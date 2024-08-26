import {
  ResizeMode,
  Video,
  VideoFullscreenUpdate,
  VideoFullscreenUpdateEvent,
} from "expo-av";
import React, { useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { IVideoLessonProps } from "../../../custom/component.props";
import { FontAwesome } from "@expo/vector-icons";

function VideoLesson(props: IVideoLessonProps) {
  const { url, handleSetDefaultLesson } = props;

  const videoRef = useRef(null);

  const onFullscreenUpdate = async ({
    fullscreenUpdate,
  }: VideoFullscreenUpdateEvent) => {
    if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_PRESENT) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      );
    } else if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_WILL_DISMISS) {
      await ScreenOrientation.unlockAsync();
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: url }}
        shouldPlay
        useNativeControls={url ? true : false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onFullscreenUpdate={onFullscreenUpdate}
      />
      {!url && (
        <TouchableOpacity
          style={styles.previewBtn}
          onPress={handleSetDefaultLesson}
        >
          <FontAwesome name="play" size={70} color="#FAFAFC" />
          <Text style={styles.previewText}>Start watching</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: "black",
    height: 220,
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },
  previewBtn: {
    position: "absolute",
    alignItems: "center",
    gap: 20,
    top: 60,
    left: 140,
  },
  previewText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default VideoLesson;
