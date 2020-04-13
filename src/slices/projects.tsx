import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { Project } from './project'; 

interface State {
  hasErrors: boolean,
  isLoading: boolean,
  projects: Project[],
}

const initialState: State = {
  hasErrors: false,
  isLoading: false,
  projects: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    getProjects: state => {
      state.isLoading = true
    },
    getProjectsSuccess: (state, { payload }) => {
      state.hasErrors = false
      state.isLoading = false
      state.projects = payload
    },
    getProjectsFailure: state => {
      state.isLoading = false
      state.hasErrors = true
    }
  },
});

export const { getProjects, getProjectsSuccess, getProjectsFailure } = projectsSlice.actions;
export const projectsSelector = (state: any) => state.projects as State;
export default projectsSlice.reducer;

export const fetchProjects = () => {
  return async (dispatch: Dispatch) => {
    dispatch(getProjects());
    try {
      const response = await fetch("data/projects.json");
      const data = await response.json();
      dispatch(getProjectsSuccess(data))
    } catch (error) {
      dispatch(getProjectsFailure())
    }
  }
}