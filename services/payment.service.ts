import { IOrder } from "../custom/data.interface";
import {
  ICheckout,
  ICreateOrder,
  ITransaction,
} from "../custom/request.interface";
import { ICheckoutResponse, IResponse } from "../custom/response.interface";
import axios from "../util/axios.custom";

const postCreateOrder = async (data: ICreateOrder) => {
  return axios.post<unknown, IResponse<IOrder>>("payment/orders", data);
};

const postCheckout = async (data: ICheckout) => {
  return axios.post<unknown, IResponse<ICheckoutResponse>>(
    "payment/checkout",
    data
  );
};

const getProcessTransaction = async (data: ITransaction) => {
  const { payerId, paymentId, price, orderId } = data;

  return axios.get<unknown, IResponse<null>>(
    `payment/transaction?payerId=${payerId}&paymentId=${paymentId}&price=${price}&orderId=${orderId}`
  );
};

const getOrder = async (id: string) => {
  return axios.get<unknown, IResponse<IOrder>>(`payment/orders/${id}`);
};

const patchUpdateOrder = async (id: string) => {
  return axios.patch<unknown, IResponse<IOrder>>(`payment/orders/${id}`);
};

export {
  postCreateOrder,
  postCheckout,
  getOrder,
  patchUpdateOrder,
  getProcessTransaction,
};
