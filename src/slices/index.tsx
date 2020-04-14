import { combineReducers } from 'redux';

import alertsReducer from './alerts';
import burndownReducer from './burndown';
import stacksReducer from './stacks';
import projectReducer from './project';
import projectsReducer from './projects';
import releasesReducer from './releases';

const rootReducer = combineReducers({
  alerts: alertsReducer,
  burndown: burndownReducer,
  project: projectReducer,
  projects: projectsReducer,
  releases: releasesReducer,
  stacks: stacksReducer
});

export default rootReducer;