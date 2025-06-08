import { createSlice } from "@reduxjs/toolkit";

type UserType = {
  _id: string;
  email: string;
  isBusiness: boolean;
  name: {
    first: string;
    last: string;
  };
};

type UserState = {
  user: UserType | null;
};

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
