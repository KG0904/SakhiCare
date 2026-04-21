/**
 * store/healthSlice.js — Health Profile State (Phase 4)
 *
 * Handles get/update of health conditions.
 * Supports Anonymous Mode — uses localStorage when user is anonymous.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

const isAnon = () => {
  const token = localStorage.getItem('token');
  return token?.startsWith('anon_');
};

const getAnonHealth = () => JSON.parse(localStorage.getItem('anonHealth') || 'null');
const saveAnonHealth = (data) => localStorage.setItem('anonHealth', JSON.stringify(data));

// --------------- Async Thunks ---------------

export const getHealth = createAsyncThunk('health/get', async (_, { rejectWithValue }) => {
  try {
    if (isAnon()) {
      const health = getAnonHealth();
      if (!health) return rejectWithValue('No health profile found');
      return health;
    }
    const res = await API.get('/health');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch health data');
  }
});

export const updateHealth = createAsyncThunk('health/update', async (healthData, { rejectWithValue }) => {
  try {
    if (isAnon()) {
      const current = getAnonHealth() || {
        hasPCOS: false, hasPCOD: false, hasThyroid: false, isPregnant: false,
      };
      const updated = { ...current, ...healthData };
      saveAnonHealth(updated);
      return updated;
    }
    const res = await API.post('/health/update', healthData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update health data');
  }
});

// --------------- Slice ---------------

const healthSlice = createSlice({
  name: 'health',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearHealthError: (state) => { state.error = null; },
    clearHealthData: (state) => { state.profile = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHealth.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateHealth.pending, (state) => { state.loading = true; })
      .addCase(updateHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearHealthError, clearHealthData } = healthSlice.actions;
export default healthSlice.reducer;
