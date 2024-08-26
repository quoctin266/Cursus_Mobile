import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { LearnCourseStackProps } from "../../../custom/component.props";
import VideoLesson from "./VideoLesson";
import { TabBar, TabView } from "react-native-tab-view";
import Lectures from "./Lectures";
import {
  IQuestion,
  IQuiz,
  IReading,
  IVideo,
} from "../../../custom/data.interface";
import { IResponse } from "../../../custom/response.interface";
import {
  getCourseQuizes,
  getCourseReadings,
  getCourseSections,
  getCourseVideos,
  getQuizQuestions,
  postSubmitQuiz,
} from "../../../services/courseContent.service";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import ReadingLesson from "./ReadingLesson";
import Quiz from "./Quiz";
import _ from "lodash";
import { useAppSelector } from "../../../redux/hooks";
import { ISubmitQuiz } from "../../../custom/request.interface";
import { Button, Dialog, Divider, Portal, Snackbar } from "react-native-paper";

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

const initResult = {
  point: 0,
  wrongCount: 0,
  total: 0,
  userAnswers: [],
  wrongQuestion: [],
  isPassed: false,
};

function LearnCourse({ route }: LearnCourseStackProps) {
  const { course } = route.params;

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Lectures" },
    { key: "second", title: "More" },
  ]);

  const [selectedLesson, setSelectedLesson] = useState<
    IVideo | IReading | IQuiz
  >(null);
  const [lessonType, setLessonType] = useState("video");

  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [isError, setIsError] = useState(false);
  const [result, setResult] = useState(initResult);
  const [showResult, setShowResult] = useState(false);
  const [show, setShow] = useState(false);

  const { id } = useAppSelector((state) => state.auth.userInfo);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "black" }}
      style={{ backgroundColor: "#F3F4F8" }}
      labelStyle={{ color: "black", textTransform: "capitalize" }}
    />
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return (
          <Lectures
            handleSelectLesson={handleSelectLesson}
            selectedLesson={selectedLesson}
            data={dataSections?.data}
            isLoading={isLoading}
          />
        );
      case "second":
        return <SecondRoute />;
      default:
        return null;
    }
  };

  const handleSelectLesson = (
    lesson: IVideo | IReading | IQuiz,
    type: string
  ) => {
    setSelectedLesson(lesson);
    setLessonType(type);
    setShowResult(false);
    setResult(initResult);
  };

  const handleSetDefaultLesson = () => {
    setSelectedLesson(dataSections.data[0].videos[0]);
  };

  const handleCheckAnswer = (questionId: string, answerId: string) => {
    let cloneQuiz = _.cloneDeep(selectedLesson as IQuiz);

    cloneQuiz.questions.forEach((question) => {
      if (question._id === questionId) {
        question.formatAnswers.forEach((answer) => {
          if (answer.id === answerId) answer.checked = !answer.checked;
        });
      }
    });

    setSelectedLesson(cloneQuiz);
  };

  const mutation = useMutation({
    mutationFn: (data: ISubmitQuiz) => {
      return postSubmitQuiz(data);
    },
    onSuccess: (response) => {
      if (response.status === 201) {
        setResult({
          ...result,
          isPassed: response.data.isPassed,
          point: response.data.point,
        });
        setShow(true);
        setShowResult(true);
        setAlert(response.message);
        setIsError(false);
      } else {
        setIsError(true);
        if (response.message) setAlert(response.message);
        else setAlert(response.error as string);
      }
      setShowAlert(true);
    },
    retry: 3,
  });

  const handleSubmitQuiz = async () => {
    let questions = [];
    let wrongQuestion = [];
    let allUserAnswers = [];

    (selectedLesson as IQuiz).questions.forEach((question) => {
      let userAnswers = [];
      question.formatAnswers.forEach((answer) => {
        if (answer.checked) {
          userAnswers.push(answer.id);
          allUserAnswers.push(answer.id);
        }
        if (
          ((answer.checked && !answer.isCorrect) ||
            (!answer.checked && answer.isCorrect)) &&
          !wrongQuestion.includes(question._id)
        )
          wrongQuestion.push(question._id);
      });
      questions.push({
        questionId: question._id,
        userAnswers: userAnswers,
      });
    });

    let payload = {
      userId: id,
      quizId: selectedLesson._id,
      questions: questions,
    };

    mutation.mutate(payload);

    setResult({
      ...result,
      wrongCount: wrongQuestion.length,
      total: (selectedLesson as IQuiz).questions.length,
      userAnswers: allUserAnswers,
      wrongQuestion: wrongQuestion,
    });
  };

  const handleRetry = () => {
    setShowResult(false);
    setResult(initResult);

    let cloneQuiz = _.cloneDeep(selectedLesson as IQuiz);
    cloneQuiz.questions.forEach((question) => {
      question.formatAnswers.forEach((answer) => {
        answer.checked = false;
      });
    });

    setSelectedLesson(cloneQuiz);
  };

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

  const questionQueries = useQueries({
    queries:
      dataQuizes?.data?.length > 0
        ? dataQuizes?.data?.map((quiz) => {
            return {
              queryKey: ["question", quiz._id],
              queryFn: () => {
                return getQuizQuestions(quiz._id);
              },
            };
          })
        : [],
  });

  let questionRes: IResponse<IQuestion[]>[] = [];
  if (
    questionQueries?.length > 0 &&
    questionQueries[questionQueries.length - 1]?.data
  ) {
    questionRes = questionQueries.map((result) => {
      return result?.data;
    });
  }

  let isLoading = true;
  if (
    isLoadingSections ||
    isLoadingVideos ||
    isLoadingReadings ||
    isLoadingQuizes ||
    (questionQueries.length > 0 &&
      questionQueries[questionQueries.length - 1].isLoading)
  )
    isLoading = true;
  else {
    isLoading = false;
  }

  if (
    dataSections &&
    dataVideos &&
    dataReadings &&
    dataQuizes &&
    questionRes.length > 0
  ) {
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

      section.quizes.forEach((quiz) => {
        questionRes.forEach((res) => {
          if (res.data[0].quizId === quiz._id) {
            res?.data.forEach((question) => {
              question.formatAnswers = question.answers.map((item, index) => {
                return {
                  id: question.answerIds[index],
                  description: item,
                  checked: false,
                  isCorrect: question.correctAnswers.includes(item),
                };
              });
            });
            quiz.questions = res?.data;
          }
        });
      });
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ maxHeight: 300 }}>
        <ScrollView>
          {lessonType === "video" && (
            <VideoLesson
              url={(selectedLesson as IVideo)?.videoUrl ?? ""}
              handleSetDefaultLesson={handleSetDefaultLesson}
            />
          )}

          {lessonType === "reading" && (
            <ReadingLesson
              body={(selectedLesson as IReading).body}
              title={selectedLesson.title}
            />
          )}

          {lessonType === "quiz" && (
            <Quiz
              quiz={selectedLesson as IQuiz}
              handleCheckAnswer={handleCheckAnswer}
              handleSubmitQuiz={handleSubmitQuiz}
              showResult={showResult}
              handleRetry={handleRetry}
              userAnswers={result.userAnswers}
              mutation={mutation}
            />
          )}
        </ScrollView>
      </View>

      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.instructor}>{course.instructor}</Text>
      </View>

      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />

      <Snackbar
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onIconPress={() => setShowAlert(false)}
        duration={5000}
        style={{ backgroundColor: isError ? "#bb2124" : "#22bb33" }}
      >
        {alert}
      </Snackbar>

      <View>
        <Portal>
          <Dialog visible={show} dismissable={false}>
            <Dialog.Title>Attempt Result</Dialog.Title>
            <Dialog.Content>
              <Text
                style={{
                  color: result.isPassed ? "#2e7d32" : "red",
                  fontSize: 16,
                }}
              >
                {result.isPassed ? "You Passed" : "You Failed This Exam"}
              </Text>

              <View style={styles.row}>
                <Text style={styles.heading}>Point:</Text>
                <Text style={styles.value}>{result.point}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.heading}>Total Questions:</Text>
                <Text style={styles.value}>{result.total}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.heading}>Total Wrong:</Text>
                <Text style={styles.value}>{result.wrongCount}</Text>
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShow(false)}>Close</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F8",
  },
  courseInfo: {
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  courseTitle: {
    fontWeight: "500",
    fontSize: 24,
  },
  instructor: {
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    marginVertical: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    flex: 2,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
});

export default LearnCourse;
