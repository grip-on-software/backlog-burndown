import { Dispatch, createSlice } from '@reduxjs/toolkit';

interface Timeframe {
  label: string,
  url: string,
  startTime: number,
  endTime: number,
  forecast?: boolean,
};

interface NumberObject {
  [key: string]: number;
}

interface Bars extends NumberObject {
  added: number,
  completed: number,
  discarded: number,
  reestimatedHigher: number,
  reestimatedLower: number,
  remaining: number,
  unestimated: number,
};

interface Stack {
  timeFrame: Timeframe,
  bars: Bars,
};

interface State {
  hasErrors: boolean,
  isLoading: boolean,
  stacks: Stack[]
}

const initialState: State = {
  hasErrors: false,
  isLoading: false,
  stacks: []
};

const stacksSlice = createSlice({
  name: "stacks",
  initialState,
  reducers: {
    getStacks: state => {
      state.isLoading = true;
    },
    getStacksSuccess: (state, { payload }) => {
      state.hasErrors = false;
      state.isLoading = false;
      state.stacks = payload;
    },
    getStacksFailure: state => {
      state.hasErrors = true;
      state.isLoading = false;
    }
  },
});

export const { getStacks, getStacksFailure, getStacksSuccess } = stacksSlice.actions;
export const stacksSelector = (state: any) => state.stacks as State;
export default stacksSlice.reducer;

export const fetchStacks = (projectKey: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(getStacks());
    try {
      const response = await fetch("data/TEST/stacks.json");
      const data = await response.json();
      dispatch(getStacksSuccess(data));
    } catch (error) {
      console.error(error);
      dispatch(getStacksFailure());
    }
  }
}