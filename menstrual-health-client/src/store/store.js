import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cycleReducer from './cycleSlice';
import healthReducer from './healthSlice';

/**
 * Redux Store Configuration
 * Combines all feature slices into a single store.
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    cycle: cycleReducer,
    health: healthReducer,
  },
});

export default store;
