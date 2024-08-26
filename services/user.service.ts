import { IInstructor, IUserInfo } from "../custom/data.interface";
import { IUpdateProfile } from "../custom/request.interface";
import { IListResponse, IResponse } from "../custom/response.interface";
import axios from "../util/axios.custom";

const userImageHeader = {
  headers: {
    folder_type: "image",
    folder_name: "users",
  },
};

const getUserInfo = async (id: string) => {
  return axios.get<unknown, IResponse<IInstructor>>(`/users/${id}`);
};

const getInstructorsList = async (page: number, limit: number) => {
  return axios.get<unknown, IResponse<IListResponse<IInstructor[]>>>(
    `/users?role=2&pageIndex=${page}&pageSize=${limit}`
  );
};

const patchUpdateUser = async (data: IUpdateProfile, id: string) => {
  return await axios.patch<unknown, IResponse<IUserInfo>>(
    `/users/${id}`,
    data,
    userImageHeader
  );
};

export { getUserInfo, getInstructorsList, patchUpdateUser };
