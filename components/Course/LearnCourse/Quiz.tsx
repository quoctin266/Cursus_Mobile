import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { IQuizProps } from "../../../custom/component.props";
import { Button, Checkbox } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";

function Quiz(props: IQuizProps) {
  const {
    quiz,
    handleCheckAnswer,
    handleSubmitQuiz,
    showResult,
    handleRetry,
    userAnswers,
    mutation,
  } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz - {quiz.title}</Text>

      <View style={styles.content}>
        {quiz.questions.map((question, index) => {
          return (
            <View key={question._id}>
              {question.imageUrl && (
                <Image
                  source={{ uri: question.imageUrl }}
                  resizeMode="contain"
                  style={styles.image}
                />
              )}
              <Text style={styles.questionTitle}>
                Question {index + 1}: {question.title}
              </Text>
              <Text style={styles.questionContent}>{question.content}</Text>

              <View style={{ marginTop: 12 }}>
                {question.formatAnswers.map((answer) => {
                  if (showResult)
                    return (
                      <View key={answer.id} style={styles.answer}>
                        <Checkbox.Item
                          position="leading"
                          label={answer.description}
                          status={answer.checked ? "checked" : "unchecked"}
                          onPress={() => {
                            handleCheckAnswer(question._id, answer.id);
                          }}
                          style={{
                            justifyContent: "flex-start",
                            gap: 20,
                          }}
                          labelStyle={{ flexGrow: 0 }}
                        />
                        {userAnswers.includes(answer.id) &&
                          !answer.isCorrect && (
                            <FontAwesome name="close" size={20} color="red" />
                          )}
                        {userAnswers.includes(answer.id) &&
                          answer.isCorrect && (
                            <FontAwesome
                              name="check"
                              size={20}
                              color="#198754"
                            />
                          )}
                      </View>
                    );
                  else
                    return (
                      <Checkbox.Item
                        position="leading"
                        key={answer.id}
                        label={answer.description}
                        status={answer.checked ? "checked" : "unchecked"}
                        onPress={() => {
                          handleCheckAnswer(question._id, answer.id);
                        }}
                        style={{
                          justifyContent: "flex-start",
                          gap: 20,
                        }}
                        labelStyle={{ flexGrow: 0 }}
                      />
                    );
                })}
              </View>
            </View>
          );
        })}

        {showResult ? (
          <Button
            buttonColor="#ff6000"
            labelStyle={{ color: "white", fontSize: 16 }}
            style={styles.submitBtn}
            onPress={handleRetry}
          >
            Try Again
          </Button>
        ) : (
          <Button
            buttonColor="#ff6000"
            labelStyle={{ color: "white", fontSize: 16 }}
            style={styles.submitBtn}
            onPress={handleSubmitQuiz}
            loading={mutation.isPending}
          >
            Submit
          </Button>
        )}
      </View>
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
    marginVertical: 16,
    textAlign: "center",
  },
  content: {
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 200,
  },
  questionTitle: {
    fontWeight: "500",
    fontSize: 16,
  },
  questionContent: {
    fontWeight: "500",
    fontSize: 16,
    color: "gray",
    marginTop: 8,
  },
  submitBtn: {
    borderRadius: 5,
    marginTop: 40,
    marginBottom: 20,
    paddingVertical: 6,
    width: 300,
  },
  answer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Quiz;
