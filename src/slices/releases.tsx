import { createSlice } from '@reduxjs/toolkit';
import { Release } from './project';

interface State {
  releases: Release[]
}

const initialState: State = {
  releases: [],
};

const releasesSlice = createSlice({
  name: "releases",
  initialState,
  reducers: {
    resetReleases: state => {
      state.releases = []
    },
    updateReleases: (state, { payload }) => {
      state.releases = payload
    },
  },
});

export const { resetReleases, updateReleases } = releasesSlice.actions;
export const releasesSelector = (state: any) => state.releases as State;
export default releasesSlice.reducer;