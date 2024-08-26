import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ILoginResponse, IUserInfo } from "../../custom/data.interface";

export interface AuthState {
  isAuthenticated: boolean;

  accessToken: string;

  refreshToken: string;

  userInfo: IUserInfo;
}

const initialState: AuthState = {
  isAuthenticated: false,

  accessToken: "",

  refreshToken: "",

  userInfo: {
    id: "",
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    address: "",
    imageUrl: "",
    description: "",
    biography: "",
    role: -1,
    status: -1,
    googleAuth: false,
    isVerified: false,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<ILoginResponse>) => {
      const { userCredentials, accessToken, refreshToken } = action.payload;
      state.isAuthenticated = true;
      state.userInfo = userCredentials;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = initialState.userInfo;
      state.accessToken = "";
      state.refreshToken = "";
    },
    update: (state, { payload }: PayloadAction<IUserInfo>) => {
      state.userInfo.address = payload.address;
      state.userInfo.biography = payload.biography;
      state.userInfo.description = payload.description;
      state.userInfo.dob = payload.dob;
      state.userInfo.firstName = payload.firstName;
      state.userInfo.lastName = payload.lastName;
      state.userInfo.phone = payload.phone;
      state.userInfo.username = payload.username;
      state.userInfo.imageUrl = payload.imageUrl;
    },
    updateGoogleAuth: (state, { payload }: PayloadAction<boolean>) => {
      state.userInfo.googleAuth = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, update, updateGoogleAuth } = authSlice.actions;

export default authSlice.reducer;
