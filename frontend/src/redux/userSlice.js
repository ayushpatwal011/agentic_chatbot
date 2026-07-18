import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
		setUserdata:( state, action)=>{
			state.userData = action.payload
		}
  },
});

export const {
	setUserdata
} = userSlice.actions;

export default userSlice.reducer;