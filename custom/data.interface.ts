export interface ILoginRequest {
  email: string;

  password: string;

  mobile: boolean;
}

export interface IUserInfo {
  id: string;

  username: string;

  email: string;

  firstName?: string;

  lastName?: string;

  dob?: string;

  phone?: string;

  address?: string;

  role: number;

  status: number;

  googleAuth: boolean;

  imageUrl: string;

  description: string;

  biography: string;

  isVerified: boolean;

  expoPushToken?: string;
}

export interface ILoginResponse {
  accessToken: string;

  refreshToken: string;

  userCredentials: IUserInfo;
}

export interface INewTokenRequest {
  refreshToken: string;
}

export interface ICourseQuery {
  searchQuery?: string;

  categoryId?: string;

  sortBy?: string;

  sortDescending?: boolean;

  creatorId?: string;

  status?: string;
}

export interface ICourse {
  _id: string;

  title: string;

  body: string;

  status: string;

  price: number;

  imageUrl: string;

  createdAt: string;

  categoryId: string;

  category: string;

  creatorId: string;

  instructor: string;

  students: string[];
}

export interface ICategory {
  _id: string;

  name: string;
}

export interface IInstructor extends IUserInfo {
  _id: string;

  dataCourses: ICourse[];

  studentCount: number;
}

export interface IFeedback {
  _id: string;

  comment: string;

  rating: number;

  createdAt: string;

  username: string;

  userId: string;

  courseId: string;
}

export interface IRateInfo {
  average: number;

  oneStar: number;

  twoStar: number;

  threeStar: number;

  fourStar: number;

  fiveStar: number;
}

export interface ILesson {
  _id: string;

  title: string;

  description: string;

  sectionId: string;
}

export interface IQuiz extends ILesson {
  questions: IQuestion[];
}

export interface IQuestion {
  _id: string;

  imageUrl: string;

  title: string;

  content: string;

  point: number;

  choiceType: number;

  formatAnswers: {
    id: string;

    description: string;

    checked: boolean;

    isCorrect: boolean;
  }[];

  answers: string[];

  answerIds: string[];

  correctAnswers: string[];

  quizId: string;
}

export interface IReading extends ILesson {
  body: string;
}

export interface IVideo extends ILesson {
  videoUrl: string;
}

export interface ISection {
  _id: string;

  name: string;

  quizes: IQuiz[];

  videos: IVideo[];

  readings: IReading[];
}

export interface IOrder {
  _id: string;

  orderStatus: number;

  totalPrice: number;

  paymentMethod: string;

  userId: string;

  courseId: string[];

  createdAt: string;
}
