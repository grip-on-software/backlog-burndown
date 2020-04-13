import { combineReducers } from 'redux';

import projectReducer from './project';
import projectsReducer from './projects';
import releasesReducer from './releases';

const rootReducer = combineReducers({
  project: projectReducer,
  projects: projectsReducer,
  releases: releasesReducer,
});

export default rootReducer;