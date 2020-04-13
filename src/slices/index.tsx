import { combineReducers } from 'redux';

import alertsReducer from './alerts';
import projectReducer from './project';
import projectsReducer from './projects';
import releasesReducer from './releases';

const rootReducer = combineReducers({
  alerts: alertsReducer,
  project: projectReducer,
  projects: projectsReducer,
  releases: releasesReducer,
});

export default rootReducer;