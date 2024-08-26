import { combineReducers } from "redux";
import authReducer from "./slices/auth.slice";
import categoryReducer from "./slices/category.slice";
import cartReducer from "./slices/cart.slice";

export const rootReducer = combineReducers({
  auth: authReducer,

  category: categoryReducer,

  cart: cartReducer,
});
