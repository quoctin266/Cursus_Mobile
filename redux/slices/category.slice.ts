import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ICategory } from "../../custom/data.interface";

interface IState {
  categoryList: ICategory[];
}

const initialState: IState = {
  categoryList: [],
  //   selectedCategory: "",
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    saveList: (state, action: PayloadAction<ICategory[]>) => {
      state.categoryList = action.payload;
    },
  },
});

export const { saveList } = categoriesSlice.actions;

export default categoriesSlice.reducer;
