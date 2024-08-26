import { ICategory } from "../custom/data.interface";
import { IResponse } from "../custom/response.interface";
import axios from "../util/axios.custom";

const getAllCategories = async () => {
  return axios.get<unknown, IResponse<ICategory[]>>("/categories");
};

export { getAllCategories };
