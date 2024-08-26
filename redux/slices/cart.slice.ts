import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCartItems } from "../../services/cart.service";
import { ICartItemResponse } from "../../custom/response.interface";

interface initState {
  itemsList: ICartItemResponse[];

  tmpList: ICartItemResponse[];

  status: string;

  error: string;
}

const initialState: initState = {
  itemsList: [],
  tmpList: [], // used for removing items from cart when payment is successful
  status: "idle",
  error: "",
};

export const fetchCartItems = createAsyncThunk(
  "cartItems/fetchCartItems",
  async (userId: string) => {
    let res = await getCartItems(userId);
    if (res.status === 200) {
      res.data.forEach((item) => {
        // default un-check all items in cart page
        item.checked = false;
      });
      return res.data;
    } else return [];
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ==> normal reducer functions go here
    refreshCart: (state, action: PayloadAction<ICartItemResponse[]>) => {
      state.itemsList = action.payload.map((item) => {
        const oldItem = state.itemsList.find(
          (i) => i.courseId === item.courseId
        );

        // restore checked state of item
        let checked = false;
        if (oldItem) {
          checked = oldItem.checked;
        }

        return { ...item, checked };
      });
    },
    addToCart: (state, { payload }: PayloadAction<ICartItemResponse>) => {
      // add item to cart logic
      const existingItem = state.itemsList.find(
        (item) => item.courseId === payload.courseId
      );

      if (!existingItem) {
        state.itemsList.push(payload);
      }
    },

    removeFromCart: (state, { payload }: PayloadAction<string>) => {
      // remove item from cart logic
      state.itemsList = state.itemsList.filter(
        (item) => item.courseId !== payload
      );
    },

    toggleItemCheckout: (state, { payload }: PayloadAction<string>) => {
      // update 'checked' property of item to true/false
      state.itemsList.forEach((item) => {
        if (item.courseId === payload) item.checked = !item.checked;
      });
    },

    // saveToTmpList: (state, { payload }) => {
    //   state.tmpList = payload;
    // },

    // deleteTmpList: (state) => {
    //   state.tmpList = [];
    // },

    changeStatusAllItems: (state, { payload }: PayloadAction<boolean>) => {
      state.itemsList.forEach((item) => {
        item.checked = payload;
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCartItems.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.itemsList = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  refreshCart,
  addToCart,
  removeFromCart,
  toggleItemCheckout,
  // saveToTmpList,
  // deleteTmpList,
  changeStatusAllItems,
} = cartSlice.actions;
export default cartSlice.reducer;
