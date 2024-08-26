import React from "react";
import { StyleSheet, I18nManager, Alert } from "react-native";
import {
  GestureHandlerRootView,
  RectButton,
  Swipeable,
} from "react-native-gesture-handler";
import { ISwipeableRowProps } from "../../custom/component.props";
import { useAppDispatch } from "../../redux/hooks";

const SwipeableRow = (props: ISwipeableRowProps) => {
  const { children, courseId, handleRemove } = props;

  const renderRightActions = () => {
    return <RectButton style={styles.rightAction}></RectButton>;
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        friction={2}
        rightThreshold={40}
        onSwipeableOpen={() => handleRemove(courseId)}
        renderRightActions={renderRightActions}
      >
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default SwipeableRow;

const styles = StyleSheet.create({
  actionIcon: {
    width: 30,
    marginHorizontal: 10,
  },
  rightAction: {
    alignItems: "center",
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    flex: 1,
    justifyContent: "flex-end",
  },
});
