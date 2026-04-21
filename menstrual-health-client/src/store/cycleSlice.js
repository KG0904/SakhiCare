/**
 * store/cycleSlice.js — Cycle Tracking State (Bleeding Days Update)
 *
 * Handles cycle CRUD, predictions, and irregularity detection.
 * Supports bleedingDays field and Anonymous Mode.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// --------------- Anonymous Helpers ---------------
const getAnonCycles = () => JSON.parse(localStorage.getItem('anonCycles') || '[]');
const saveAnonCycles = (cycles) => localStorage.setItem('anonCycles', JSON.stringify(cycles));

const isAnon = () => {
  const token = localStorage.getItem('token');
  return token?.startsWith('anon_');
};

// Calculate prediction locally for anonymous mode
const calcPrediction = (cycle) => {
  if (!cycle) return null;
  const bleedingDays = cycle.bleedingDays || 5;
  const start = new Date(cycle.lastPeriodDate);
  start.setDate(start.getDate() + cycle.cycleLength);
  const end = new Date(start);
  end.setDate(end.getDate() + bleedingDays);
  return {
    lastPeriodDate: cycle.lastPeriodDate,
    cycleLength: cycle.cycleLength,
    bleedingDays,
    nextPeriodStart: start.toISOString(),
    nextPeriodEnd: end.toISOString(),
    predictedNextPeriod: start.toISOString(),
    isLate: start < new Date(),
  };
};

const calcOvulation = (cycle) => {
  if (!cycle) return null;
  const bleedingDays = cycle.bleedingDays || 5;
  const start = new Date(cycle.lastPeriodDate);
  start.setDate(start.getDate() + cycle.cycleLength);
  const end = new Date(start);
  end.setDate(end.getDate() + bleedingDays);
  const ov = new Date(start);
  ov.setDate(ov.getDate() - 14);
  const fs = new Date(ov); fs.setDate(fs.getDate() - 2);
  const fe = new Date(ov); fe.setDate(fe.getDate() + 2);
  return {
    lastPeriodDate: cycle.lastPeriodDate,
    cycleLength: cycle.cycleLength,
    bleedingDays,
    nextPeriodStart: start.toISOString(),
    nextPeriodEnd: end.toISOString(),
    predictedNextPeriod: start.toISOString(),
    estimatedOvulationDate: ov.toISOString(),
    fertileWindow: { start: fs.toISOString(), end: fe.toISOString() },
  };
};

// --------------- Async Thunks ---------------

export const addCycle = createAsyncThunk('cycle/add', async (cycleData, { rejectWithValue }) => {
  try {
    if (isAnon()) {
      const cycles = getAnonCycles();
      const newCycle = {
        _id: 'cycle_' + Date.now(),
        lastPeriodDate: cycleData.lastPeriodDate,
        cycleLength: cycleData.cycleLength || 30,
        bleedingDays: cycleData.bleedingDays || 5,
        cycleHistory: [cycleData.lastPeriodDate],
        createdAt: new Date().toISOString(),
      };
      cycles.unshift(newCycle);
      saveAnonCycles(cycles);
      return newCycle;
    }
    const res = await API.post('/cycle/add', cycleData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add cycle');
  }
});

export const getCycleHistory = createAsyncThunk('cycle/history', async (_, { rejectWithValue }) => {
  try {
    if (isAnon()) return getAnonCycles();
    const res = await API.get('/cycle/history');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch history');
  }
});

export const getNextPeriod = createAsyncThunk('cycle/nextPeriod', async (_, { rejectWithValue }) => {
  try {
    if (isAnon()) {
      const cycles = getAnonCycles();
      return calcPrediction(cycles[0]) || rejectWithValue('No cycle data');
    }
    const res = await API.get('/prediction/next-period');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to get prediction');
  }
});

export const getOvulation = createAsyncThunk('cycle/ovulation', async (_, { rejectWithValue }) => {
  try {
    if (isAnon()) {
      const cycles = getAnonCycles();
      return calcOvulation(cycles[0]) || rejectWithValue('No cycle data');
    }
    const res = await API.get('/prediction/ovulation');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to get ovulation data');
  }
});

export const getIrregularities = createAsyncThunk('cycle/irregularities', async (_, { rejectWithValue }) => {
  try {
    if (isAnon()) {
      const cycles = getAnonCycles();
      if (cycles.length < 2) {
        return { data: { isIrregular: false, irregularCycles: [] }, message: 'Not enough data' };
      }
      const avg = cycles.reduce((s, c) => s + c.cycleLength, 0) / cycles.length;
      const irregular = cycles.filter((c) => Math.abs(c.cycleLength - avg) > 7);
      return {
        data: {
          isIrregular: irregular.length > 0,
          averageCycleLength: parseFloat(avg.toFixed(1)),
          totalCyclesAnalyzed: cycles.length,
          irregularCycles: irregular,
        },
        message: irregular.length > 0
          ? `⚠️ ${irregular.length} irregular cycle(s) detected`
          : '✅ Cycles appear regular',
      };
    }
    const res = await API.get('/cycle/irregularities');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to detect irregularities');
  }
});

// --------------- Slice ---------------

const cycleSlice = createSlice({
  name: 'cycle',
  initialState: {
    cycles: [],
    prediction: null,
    ovulation: null,
    irregularities: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCycleError: (state) => { state.error = null; },
    clearCycleData: (state) => {
      state.cycles = [];
      state.prediction = null;
      state.ovulation = null;
      state.irregularities = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCycle.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addCycle.fulfilled, (state, action) => {
        state.loading = false;
        state.cycles.unshift(action.payload);
      })
      .addCase(addCycle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCycleHistory.pending, (state) => { state.loading = true; })
      .addCase(getCycleHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.cycles = action.payload;
      })
      .addCase(getCycleHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getNextPeriod.fulfilled, (state, action) => { state.prediction = action.payload; })
      .addCase(getOvulation.fulfilled, (state, action) => { state.ovulation = action.payload; })
      .addCase(getIrregularities.fulfilled, (state, action) => { state.irregularities = action.payload; });
  },
});

export const { clearCycleError, clearCycleData } = cycleSlice.actions;
export default cycleSlice.reducer;
