import { createSlice } from '@reduxjs/toolkit';

interface State {
  isAligned: boolean
}

const initialState: State = {
  isAligned: false
};

const burndownSlice = createSlice({
  name: "burndown",
  initialState,
  reducers: {
    toggleAlign: (state, { payload }) => {
      state.isAligned = !state.isAligned;
    },
  },
});

export const { toggleAlign } = burndownSlice.actions;
export const burndownSelector = (state: any) => state.burndown as State;
export default burndownSlice.reducer;