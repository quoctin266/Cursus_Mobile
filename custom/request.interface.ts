export interface ICreateOrder {
  userId: string;

  paymentMethod: number;

  coursesId: string[];
}

export interface ICheckout {
  orderId: string;

  totalPrice: number;
}

export interface IUpdateProfile {
  username?: string;

  firstName?: string;

  lastName?: string;

  phone?: string;

  description?: string;

  dob?: string;

  address?: string;

  biography?: string;

  expoPushToken?: string;

  file?: {
    data: string;

    mimetype: string;

    size: number;

    name: string;

    isMobile: boolean;
  };
}

export interface IVerifyPW {
  userId: string;

  currentPassword: string;
}

export interface IChangePW {
  userId: string;

  newPassword: string;

  confirmNewPassword: string;
}

export interface ISubmitQuiz {
  userId: string;

  quizId: string;

  questions: {
    questionId: string;

    userAnswers: string[];
  }[];
}

export interface IRegisterUser {
  username: string;

  email: string;

  role: number;

  password: string;

  mobile: boolean;
}

export interface ICheckOtp {
  otp: string;

  email: string;
}

export interface IGoogleAuth {
  username: string;

  email: string;

  firstName: string;

  lastName: string;

  image: string;
}

export interface ITransaction {
  price: number;

  paymentId: string;

  payerId: string;

  orderId: string;
}
