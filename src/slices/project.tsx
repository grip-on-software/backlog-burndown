import { createSlice } from '@reduxjs/toolkit';

export interface Release {
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

interface State {
  project: Project | null
}

const initialState: State = {
  project: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    updateProject: (state, { payload }) => {
      state.project = payload
    },
  },
});

export const { updateProject } = projectSlice.actions;
export const projectSelector = (state: any) => state.project as State;
export default projectSlice.reducer;