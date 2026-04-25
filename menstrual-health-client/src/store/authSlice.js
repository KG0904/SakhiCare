import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// --------------- Async Thunks ---------------

// ✅ SIGNUP
export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      // Anonymous mode — skip backend
      if (userData.isAnonymous) {
        const anonUser = {
          id: 'anon_' + Date.now(),
          name: userData.name || 'Anonymous',
          email: userData.email,
          isAnonymous: true,
          token: 'anon_token_' + Date.now(),
        };

        localStorage.setItem('token', anonUser.token);
        localStorage.setItem('anonUser', JSON.stringify(anonUser));

        return anonUser;
      }

      // ✅ Correct backend route
      const res = await API.post('/auth/signup', userData);

      localStorage.setItem('token', res.data.data.token);
      return res.data.data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Signup failed'
      );
    }
  }
);

// ✅ LOGIN
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Anonymous login
      if (credentials.isAnonymous) {
        const stored = localStorage.getItem('anonUser');

        if (stored) {
          const anonUser = JSON.parse(stored);
          localStorage.setItem('token', anonUser.token);
          return anonUser;
        }

        return rejectWithValue(
          'No anonymous session found. Please sign up first.'
        );
      }

      // ✅ Correct backend route
      const res = await API.post('/auth/login', credentials);

      localStorage.setItem('token', res.data.data.token);
      return res.data.data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed'
      );
    }
  }
);

// --------------- Initial State ---------------

const savedToken = localStorage.getItem('token');
const savedAnon = localStorage.getItem('anonUser');

let initialUser = null;

if (savedAnon && savedToken?.startsWith('anon_')) {
  initialUser = JSON.parse(savedAnon);
}

// --------------- Slice ---------------

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    token: savedToken || null,
    isAnonymous: initialUser?.isAnonymous || false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAnonymous = false;
      state.error = null;

      localStorage.removeItem('token');
      localStorage.removeItem('anonUser');
      localStorage.removeItem('anonCycles');
      localStorage.removeItem('anonHealth');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAnonymous = action.payload.isAnonymous || false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAnonymous = action.payload.isAnonymous || false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

