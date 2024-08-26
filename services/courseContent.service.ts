import {
  IQuestion,
  IQuiz,
  IReading,
  ISection,
  IVideo,
} from "../custom/data.interface";
import { ISubmitQuiz } from "../custom/request.interface";
import { IQuizSubmitResponse, IResponse } from "../custom/response.interface";
import axios from "../util/axios.custom";

const getCourseSections = async (courseId: string) => {
  return axios.get<unknown, IResponse<ISection[]>>(`sections/${courseId}`);
};

const getCourseVideos = async (courseId: string) => {
  return axios.get<unknown, IResponse<IVideo[]>>(`videos/courses/${courseId}`);
};

const getCourseReadings = async (courseId: string) => {
  return axios.get<unknown, IResponse<IReading[]>>(
    `readings/courses/${courseId}`
  );
};

const getCourseQuizes = async (courseId: string) => {
  return axios.get<unknown, IResponse<IQuiz[]>>(`quizes/courses/${courseId}`);
};

const getQuizQuestions = async (quizId: string) => {
  return axios.get<unknown, IResponse<IQuestion[]>>(
    `questions/quizes/${quizId}`
  );
};

const postSubmitQuiz = async (data: ISubmitQuiz) => {
  return axios.post<unknown, IResponse<IQuizSubmitResponse>>(
    `attempts/quizes`,
    data
  );
};

export {
  getCourseSections,
  getCourseVideos,
  getCourseReadings,
  getCourseQuizes,
  getQuizQuestions,
  postSubmitQuiz,
};
