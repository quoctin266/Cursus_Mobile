import {
  ILoginRequest,
  ILoginResponse,
  INewTokenRequest,
  IUserInfo,
} from "../custom/data.interface";
import {
  IChangePW,
  ICheckOtp,
  IGoogleAuth,
  IRegisterUser,
  IVerifyPW,
} from "../custom/request.interface";
import { IResponse } from "../custom/response.interface";
import axios from "../util/axios.custom";

const postRegister = async (data: IRegisterUser) => {
  return axios.post<unknown, IResponse<IUserInfo>>(`auth/register`, data);
};

const postLogin = (data: ILoginRequest) => {
  return axios.post<unknown, IResponse<ILoginResponse>>(`auth/login`, data);
};

const postGoogleAuth = async (data: IGoogleAuth) => {
  return axios.post<unknown, IResponse<ILoginResponse>>(
    `auth/google-login`,
    data
  );
};

const postLogout = async () => {
  return axios.post<unknown, IResponse<null>>(`auth/logout`);
};

const getNewToken = async (data: INewTokenRequest) => {
  return axios.post<unknown, IResponse<ILoginResponse>>("auth/refresh", data);
};

const postVerifyPassword = async (data: IVerifyPW) => {
  return axios.post<unknown, IResponse<null>>(`auth/verify-password`, data);
};

const postChangePassword = async (data: IChangePW) => {
  return axios.post<unknown, IResponse<IUserInfo>>(`auth/reset-password`, data);
};

const postCheckOtp = async (data: ICheckOtp) => {
  return axios.post<unknown, IResponse<null>>(`auth/check-otp-mobile`, data);
};

const postResendOtp = async (data: { email: string }) => {
  return axios.post<unknown, IResponse<null>>(`auth/resend-otp/mobile`, data);
};

const postSendResetPWRequest = async (data: { email: string }) => {
  return await axios.post<unknown, IResponse<null>>(
    `auth/forget-password`,
    data
  );
};

export {
  postLogin,
  postLogout,
  getNewToken,
  postVerifyPassword,
  postChangePassword,
  postRegister,
  postCheckOtp,
  postResendOtp,
  postSendResetPWRequest,
  postGoogleAuth,
};
