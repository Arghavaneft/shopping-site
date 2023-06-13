import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";

// export const fetchProducts = createAsyncThunk('', () => {})

export const LoadingSlice = createSlice({
  name: 'loading',
  initialState:{
    loading: false,
  },
  reducers: {
    startLoading: (state, action) => {
      //  state.loading = true
    },
    endLoading: (state, action) => {
       state.loading = false
    },
  }
})
export const { startLoading, endLoading } = LoadingSlice.actions;
export default LoadingSlice.reducer

