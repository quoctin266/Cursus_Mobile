import { IFeedback } from "../custom/data.interface";
import { IResponse } from "../custom/response.interface";
import axios from "../util/axios.custom";

const getAllFeedbacks = async () => {
  return axios.get<unknown, IResponse<IFeedback[]>>(`/feedbacks`);
};

export { getAllFeedbacks };
