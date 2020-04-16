import { createSlice } from '@reduxjs/toolkit';

interface State {
  isAligned: boolean,
  range: [Date, Date] | null
}

const initialState: State = {
  isAligned: false,
  range: null
};

const burndownSlice = createSlice({
  name: "burndown",
  initialState,
  reducers: {
    toggleAlign: state => {
      state.isAligned = !state.isAligned;
    },
    updateRange: (state, { payload }) => {
      state.range = payload;
    }
  },
});

export const { toggleAlign, updateRange } = burndownSlice.actions;
export const burndownSelector = (state: any) => state.burndown as State;
export default burndownSlice.reducer;