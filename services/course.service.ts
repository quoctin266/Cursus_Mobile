import { ICourse, ICourseQuery } from "../custom/data.interface";
import { IListResponse, IResponse } from "../custom/response.interface";
import axios from "../util/axios.custom";

const getCourseList = async (
  params: ICourseQuery,
  page: number,
  limit: number
) => {
  return axios.get<unknown, IResponse<IListResponse<ICourse[]>>>(
    `courses?${params.searchQuery ? `searchQuery=${params.searchQuery}&` : ""}${
      params.categoryId ? `categoryId=${params.categoryId}&` : ""
    }${params.sortBy ? `sortBy=${params.sortBy}&` : ""}${
      params.sortDescending ? `sortDescending=${params.sortDescending}&` : ""
    }${params.creatorId ? `creatorId=${params.creatorId}&` : ""}${
      params.status ? `status=${params.status}&` : ""
    }pageIndex=${page}&pageSize=${limit}`
  );
};

const getCourseDetail = async (courseId: string) => {
  return axios.get<unknown, IResponse<ICourse>>(`courses/${courseId}`);
};

const getEnrolledCourses = async (userId: string) => {
  return axios.get<unknown, IResponse<ICourse[]>>(`courses/users/${userId}`);
};

export { getCourseList, getCourseDetail, getEnrolledCourses };
