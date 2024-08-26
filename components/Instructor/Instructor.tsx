import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar } from "react-native-paper";
import { IInstructorProps } from "../../custom/component.props";
const defaultImg = require("../../assets/default.jpg");

function Instructor(props: IInstructorProps) {
  const { instructor } = props;

  return (
    <View style={styles.container}>
      <View>
        <Avatar.Image
          source={
            instructor.imageUrl ? { uri: instructor.imageUrl } : defaultImg
          }
        />
      </View>

      <View style={{ width: 225 }}>
        <Text style={styles.name} numberOfLines={1}>
          {instructor.username}
        </Text>
        <Text style={styles.textInfo} numberOfLines={1}>
          {instructor.description}
        </Text>
        <Text style={styles.textInfo}>{instructor.studentCount} students</Text>
        <Text style={styles.textInfo}>
          {instructor?.dataCourses?.length} courses
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 6,
    margin: 12,
    gap: 12,
    elevation: 5,
    backgroundColor: "#FFF",
    shadowColor: "#83829A",
  },
  name: {
    marginBottom: 6,
    fontSize: 16,
  },
  textInfo: {
    marginBottom: 3,
  },
});

export default Instructor;
