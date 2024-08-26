import { ICartItemResponse, IResponse } from "../custom/response.interface";
import axios from "../util/axios.custom";

const getCartItems = (userId: string) => {
  return axios.get<unknown, IResponse<ICartItemResponse[]>>(
    `/payment/users/${userId}/cart`
  );
};

const postAddToCart = async (data: {
  courses: string[];
  userId: string;
  toCart: boolean;
}) => {
  const { userId, ...rest } = data;

  return await axios.post<unknown, IResponse<ICartItemResponse[]>>(
    `/payment/users/${userId}/cart/items`,
    rest
  );
};

const deleteFromCart = async (userId: string, courseId: string) => {
  return await axios.delete<unknown, IResponse<ICartItemResponse[]>>(
    `/payment/users/${userId}/cart/items/${courseId}`
  );
};

export { getCartItems, postAddToCart, deleteFromCart };
