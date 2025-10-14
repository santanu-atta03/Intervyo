import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import profileReducer from '../slices/profileSlice';
import interviewReducer from '../slices/interviewSlice'
import resultsReducer from '../slices/resultsSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  interview : interviewReducer,
  results: resultsReducer,
});

export default rootReducer;