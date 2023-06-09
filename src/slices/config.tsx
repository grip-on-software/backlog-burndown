import { Dispatch, createSlice } from '@reduxjs/toolkit';
import { addAlert } from './alerts';

interface Release {
  id: number,
  name: string,
}

export interface Project {
  isCore: boolean,
  isRecent: boolean,
  key: string,
  name: string,
  releases: Release[],
};

interface Timeframe {
  label: string,
  url?: string,
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

export interface Stack {
  timeFrame: Timeframe,
  bars: Bars,
};

interface Estimate {
  input: string,
  numeric: number
}

export interface Estimates {
  added: Estimate,
  completed: Estimate,
  discarded: Estimate,
  reestimatedHigher: Estimate,
  reestimatedLower: Estimate,
  unestimated: Estimate,
}

interface State {
  bounds: [number, number],
  estimate: Estimates,
  forecast: "off" | "estimate" | "simulation",
  isAligned: boolean,
  pastStacks: Stack[],
  project: Project | null,
  projects: Project[],
  range: [number, number] | null,
  releases: Release[],
  simulatedStacks: Stack[],
}

const initialState: State = {
  bounds: [0,0],
  estimate: {
    added: {
      input: "0",
      numeric: 0
    },
    completed: {
      input: "0",
      numeric: 0
    },
    discarded: {
      input: "0",
      numeric: 0
    },
    reestimatedHigher: {
      input: "0",
      numeric: 0
    },
    reestimatedLower: {
      input: "0",
      numeric: 0
    },
    unestimated: {
      input: "0",
      numeric: 0
    },
  },
  forecast: "off",
  isAligned: false,
  pastStacks: [],
  project: null,
  projects: [],
  range: null,
  releases: [],
  simulatedStacks: [],
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    addEstimate: (state: State, { payload }: { payload: { feature: keyof Estimates, estimate: number | string } }) => {
      console.log(payload);
      if (typeof payload.estimate === "number" && ! isNaN(payload.estimate)) {
        state.estimate[payload.feature] = {
          input: parseFloat(payload.estimate.toFixed(1)).toString(),
          numeric: payload.estimate
        }
      } else if (typeof payload.estimate === "string") {
        const numericEstimate = parseFloat(payload.estimate);
        state.estimate[payload.feature].input = payload.estimate;
        if (isNaN(numericEstimate)) return;
        state.estimate[payload.feature].numeric = numericEstimate;
      }
    },
    resetReleases: (state: State) => {
      state.releases = []
    },
    setBounds: (state: State, { payload }: { payload: [number, number] }) => {
      state.bounds = payload;
    },
    setForecast: (state: State, { payload }: { payload: "off" | "estimate" | "simulation" }) => {
      state.forecast = payload;
    },
    setPastStacks: (state: State, { payload }: { payload: Stack[] }) => {
      state.pastStacks = payload;
    },
    setProject: (state: State, { payload }: { payload: Project | null }) => {
      state.project = payload
    },
    setProjects: (state: State, { payload }: { payload: Project[] }) => {
      state.projects = payload
    },
    setRange: (state: State, { payload }: { payload: [number, number] | null }) => {
      state.range = payload;
    },
    setReleases: (state: State, { payload }: { payload: Release[] }) => {
      state.releases = payload
    },
    setSimulatedStacks: (state: State, { payload }: { payload: Stack[] }) => {
      state.simulatedStacks = payload;
    },
    toggleAlign: (state: State) => {
      state.isAligned = !state.isAligned;
    }
  },
});

export const { addEstimate, resetReleases, setBounds, setForecast, setPastStacks, setProject, setProjects, setRange, setReleases, setSimulatedStacks, toggleAlign } = configSlice.actions;
export const configSelector = (state: any) => state.config as State;
export default configSlice.reducer;

export const fetchProjects = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await fetch("data/projects.json");
      const data: Project[] = await response.json();
      dispatch(setProjects(data));
    } catch (error) {
      console.error(error);
      dispatch(addAlert({
        dismissible: false,
        message: "Something went wrong while fetching projects. Please reload the page.",
        variant: "danger"
      }));
    }
  }
}

export const fetchStacks = (projectKey: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await fetch("data/TEST/stacks.json");
      const data: Stack[] = await response.json();
      dispatch(setPastStacks(data.filter(s => !s.timeFrame.forecast)));
      dispatch(setSimulatedStacks(data.filter(s => s.timeFrame.forecast)));
    } catch (error) {
      console.error(error);
      dispatch(addAlert({
        dismissible: false,
        message: "Something went wrong while fetching stacks. Please reload the page.",
        variant: "danger"
      }));
    }
  }
}