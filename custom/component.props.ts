import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./router.types";
import {
  ICategory,
  ICourse,
  IFeedback,
  IInstructor,
  IQuiz,
  IRateInfo,
  IReading,
  ISection,
  IVideo,
} from "./data.interface";
import { UseMutationResult } from "@tanstack/react-query";
import { IQuizSubmitResponse, IResponse } from "./response.interface";
import { ISubmitQuiz } from "./request.interface";

export type IntroStackProps = NativeStackScreenProps<
  RootStackParamList,
  "Intro"
>;

export type SignInStackProps = NativeStackScreenProps<
  RootStackParamList,
  "SignIn"
>;

export type SignUpStackProps = NativeStackScreenProps<
  RootStackParamList,
  "SignUp"
>;

export type EmailSignUpStackProps = NativeStackScreenProps<
  RootStackParamList,
  "EmailSignUp"
>;

export type EmailSignInStackProps = NativeStackScreenProps<
  RootStackParamList,
  "EmailSignIn"
>;

export type AccountVerifyStackProps = NativeStackScreenProps<
  RootStackParamList,
  "AccountVerify"
>;

export type VerifySuccessStackProps = NativeStackScreenProps<
  RootStackParamList,
  "VerifySuccess"
>;

export type ResetPasswordStackProps = NativeStackScreenProps<
  RootStackParamList,
  "ResetPassword"
>;

export type RequestStatusStackProps = NativeStackScreenProps<
  RootStackParamList,
  "RequestStatus"
>;

export type BrowseStackProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;

export type AccountStackProps = NativeStackScreenProps<
  RootStackParamList,
  "Account"
>;

export type SearchStackProps = NativeStackScreenProps<
  RootStackParamList,
  "Search"
>;

export type SearchResultStackProps = NativeStackScreenProps<
  RootStackParamList,
  "SearchResult"
>;

export type CategorySearchStackProps = NativeStackScreenProps<
  RootStackParamList,
  "CategorySearch"
>;

export type InstructorDetailStackProps = NativeStackScreenProps<
  RootStackParamList,
  "InstructorDetail"
>;

export type InstructorCoursesStackProps = NativeStackScreenProps<
  RootStackParamList,
  "InstructorCourses"
>;

export type CourseDetailStackProps = NativeStackScreenProps<
  RootStackParamList,
  "CourseDetail"
>;

export type AllFeedbackStackProps = NativeStackScreenProps<
  RootStackParamList,
  "AllFeedback"
>;

export type PreviewCourseStackProps = NativeStackScreenProps<
  RootStackParamList,
  "PreviewCourse"
>;

export type CartStackProps = NativeStackScreenProps<RootStackParamList, "Cart">;

export type CheckoutStackProps = NativeStackScreenProps<
  RootStackParamList,
  "Checkout"
>;

export type PaymentGateStackProps = NativeStackScreenProps<
  RootStackParamList,
  "PaymentGate"
>;

export type PaymentStatusStackProps = NativeStackScreenProps<
  RootStackParamList,
  "PaymentStatus"
>;

export type LearnCourseStackProps = NativeStackScreenProps<
  RootStackParamList,
  "LearnCourse"
>;

export interface ICategoryList {
  categories: ICategory[];

  columnsNum?: number;

  routeName?: string;
}

export interface ICourseProps {
  course: ICourse;

  button?: boolean;
}

export interface IResultListProps {
  courseList: ICourse[];

  setAlert?: (v: string) => void;

  setIsError?: (v: boolean) => void;

  setShowAlert?: (v: boolean) => void;
}

export interface IInstructorListProps {
  instructorList: IInstructor[];
}

export interface IInstructorProps {
  instructor: IInstructor;
}

export interface IFeedbackProps {
  feedback: IFeedback;
}

export interface IRatingInfoProps {
  rateInfo: IRateInfo;
}

export interface ICurriculumProps {
  course: ICourse;
}

export interface ISwipeableRowProps {
  children: React.ReactNode;

  handleRemove?: (v: string) => void;

  courseId?: string;
}

export interface IChangePWProps {
  setPWVerified: (v: boolean) => void;

  setAlert: (v: string) => void;

  setIsError: (v: boolean) => void;

  setShowAlert: (v: boolean) => void;
}

export interface ILecturesProps {
  isLoading: boolean;

  selectedLesson: IVideo | IReading | IQuiz;

  data: ISection[];

  handleSelectLesson: (lesson: IVideo | IReading | IQuiz, type: string) => void;
}

export interface IVideoLessonProps {
  url: string;

  handleSetDefaultLesson: () => void;
}

export interface IReadingLessonProps {
  body: string;

  title: string;
}

export interface IQuizProps {
  quiz: IQuiz;

  handleCheckAnswer: (questionId: string, answerId: string) => void;

  handleSubmitQuiz: () => void;

  showResult: boolean;

  handleRetry: () => void;

  userAnswers: string[];

  mutation: UseMutationResult<
    IResponse<IQuizSubmitResponse>,
    Error,
    ISubmitQuiz,
    unknown
  >;
}

export interface IGoogleAuthProps {
  setAlert: (v: string) => void;

  setShowAlert: (v: boolean) => void;
}
