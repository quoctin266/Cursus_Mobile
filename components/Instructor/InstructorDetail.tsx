import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from "react-native";
import { Avatar } from "react-native-paper";
import CourseHorizontal from "../Course/CourseHorizontal";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { InstructorDetailStackProps } from "../../custom/component.props";
import RenderHTML, { TNodeChildrenRenderer } from "react-native-render-html";
const defaultImg = require("../../assets/default.jpg");

function InstructorDetail({ navigation, route }: InstructorDetailStackProps) {
  const { instructor } = route.params;

  const biography = instructor.biography;
  instructor.dataCourses.forEach((course) => {
    course.instructor = instructor.username;
  });

  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);

  const { width } = useWindowDimensions();

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      setLengthMore(e.nativeEvent.lines.length >= 6);
    },
    []
  );

  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const PRenderer = ({ TDefaultRenderer, textProps, ...props }) => {
    const tchildrenAreText = props.tnode.children.every(
      (t) => t.type === "text" || t.type === "phrasing"
    );
    const children = <TNodeChildrenRenderer tnode={props.tnode} />;

    return (
      <TDefaultRenderer {...props}>
        {tchildrenAreText ? (
          <Text
            onTextLayout={onTextLayout}
            style={styles.descriptionText}
            numberOfLines={textShown ? undefined : 6}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </TDefaultRenderer>
    );
  };

  const renderers = {
    p: PRenderer,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.generalInfo}>
          <TouchableOpacity>
            <Avatar.Image
              source={
                instructor.imageUrl ? { uri: instructor.imageUrl } : defaultImg
              }
              size={90}
            />
          </TouchableOpacity>

          <View style={{ flexShrink: 1 }}>
            <Text style={styles.name}>{instructor.username}</Text>

            <Text style={styles.carrer}>{instructor.description}</Text>
          </View>
        </View>

        <View style={styles.othersInfoContainer}>
          <View>
            <Text>Total students</Text>
            <Text style={styles.number}>{instructor.studentCount}</Text>
          </View>

          <View>
            <Text>Reviews</Text>
            <Text style={styles.number}>809,247</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About me</Text>
          <RenderHTML
            enableExperimentalMarginCollapsing={true}
            contentWidth={width}
            source={{
              html: biography
                .replace(/<p><br><\/p>/g, "")
                .replace(/<\/p><p>/g, "<br/><br/>"),
            }}
            renderers={renderers}
          />

          {lengthMore ? (
            <Text onPress={toggleNumberOfLines} style={styles.toogleShowText}>
              {textShown ? "Show less" : "Show more"}
            </Text>
          ) : null}
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            My courses ({instructor.dataCourses.length})
          </Text>
          <View style={styles.list}>
            {instructor.dataCourses.map((item) => {
              return <CourseHorizontal course={item} key={item._id} />;
            })}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("InstructorCourses", {
                instructorId: instructor._id,
              })
            }
          >
            <Text style={styles.btnText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.subContainer}>
          <TouchableOpacity style={styles.section}>
            <View style={styles.sectionTitle}>
              <Ionicons name="link" size={22} color="black" />
              <Text style={styles.sectionTitleText}>Website</Text>
            </View>

            <AntDesign name="right" size={18} color="#C1C0C8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.section}>
            <View style={styles.sectionTitle}>
              <AntDesign name="twitter" size={22} color="black" />
              <Text style={styles.sectionTitleText}>Twitter</Text>
            </View>

            <AntDesign name="right" size={18} color="#C1C0C8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.section}>
            <View style={styles.sectionTitle}>
              <AntDesign name="linkedin-square" size={22} color="black" />
              <Text style={styles.sectionTitleText}>Linkedln</Text>
            </View>

            <AntDesign name="right" size={18} color="#C1C0C8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
  },
  generalInfo: {
    flexDirection: "row",
    marginVertical: 16,
    gap: 16,
    paddingHorizontal: 16,
  },
  name: {
    fontWeight: "600",
    fontSize: 22,
  },
  carrer: {
    fontSize: 15,
    marginTop: 3,
  },
  othersInfoContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  number: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "500",
  },
  descriptionContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  descriptionTitle: {
    fontWeight: "500",
    fontSize: 18,
  },
  descriptionText: {
    fontSize: 15,
  },
  toogleShowText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#ff6000",
  },
  listContainer: {
    marginTop: 20,
  },
  listTitle: {
    fontSize: 22,
    marginBottom: 20,
    marginLeft: 16,
  },
  list: {
    gap: 12,
    paddingBottom: 16,
  },
  btnContainer: {
    paddingHorizontal: 12,
  },
  subContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    flexDirection: "row",
    gap: 12,
  },
  sectionTitleText: {
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 12,
  },
  button: {
    paddingVertical: 16,
    backgroundColor: "#ff6000",
  },
  btnText: {
    textAlign: "center",
    fontWeight: "600",
    color: "white",
    fontSize: 16,
  },
});

export default InstructorDetail;
