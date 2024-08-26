export interface IResponse<T> {
  status: number;

  message?: string;

  error?: string | string[];

  data?: T | null;
}

export interface IListResponse<T> {
  pageIndex: number;

  pageSize: number;

  totalPages: number;

  resultCount: number;

  items: T;
}

export interface ICartItemResponse {
  userId: string;

  courseId: string;

  checked?: boolean;

  key?: string;
}

export interface ICheckoutResponse {
  url: string;
}

export interface IQuizSubmitResponse {
  _id: string;

  userId: string;

  quizId: string;

  point: number;

  isPassed: boolean;

  createdAt: string;

  updatedAt: string;
}
