import { NavigatorScreenParams } from "@react-navigation/native";
import {
  ICategory,
  ICourse,
  IFeedback,
  IInstructor,
  IOrder,
  IRateInfo,
} from "./data.interface";

export type DrawerParamList = {
  Profile: undefined;
};

export type RootStackParamList = {
  Intro: undefined;

  SignIn: undefined;

  SignUp: undefined;

  EmailSignUp: undefined;

  EmailSignIn: undefined;

  Home: NavigatorScreenParams<TabParamList>;

  Account: undefined;

  MyLearning: undefined;

  Status: undefined;

  Search: undefined;

  SearchResult: { searchQuery: string };

  CategorySearch: { category: ICategory };

  CategoryPage: undefined;

  InstructorDetail: { instructor: IInstructor };

  InstructorCourses: { instructorId: string };

  CourseDetail: { course: ICourse };

  AllFeedback: {
    courseId?: string;
    feedbackList: IFeedback[];
    rateInfo: IRateInfo;
  };

  PreviewCourse: { videoUrl: string };

  Cart: undefined;

  Checkout: { courseList: ICourse[]; order: IOrder };

  PaymentGate: { url: string };

  PaymentStatus: {
    status: boolean;
    orderId?: string;
    paymentId?: string;
    payerId?: string;
  };

  CompanyLocation: undefined;

  Profile: undefined;

  Security: undefined;

  LearnCourse: { course: ICourse };

  AccountVerify: { email: string; message: string };

  VerifySuccess: undefined;

  ResetPassword: { email: string };

  RequestStatus: { email: string };

  FeatureList: undefined;

  NewestList: undefined;
};

export type TabParamList = {
  Browse: undefined;

  Account: undefined;

  MyLearning: undefined;

  Search: undefined;
};
