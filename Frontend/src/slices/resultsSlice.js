// slices/resultsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentResults: null,
  loading: false,
  error: null,
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setResults(state, action) {
      state.currentResults = action.payload;
      state.error = null;
    },
    clearResults(state) {
      return initialState;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setResults, clearResults, setLoading, setError } = resultsSlice.actions;
export default resultsSlice.reducer;
