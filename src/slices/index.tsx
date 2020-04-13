import { combineReducers } from 'redux';

import projectReducer from './project'
import projectsReducer from './projects'

const rootReducer = combineReducers({
  project: projectReducer,
  projects: projectsReducer,
});

export default rootReducer;