import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  uid: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthPayload {
  token: string;
  uid: string;
}

const initialState: AuthState = {
  token: null,
  uid: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<AuthPayload>) {
      state.token = action.payload.token;
      state.uid = action.payload.uid;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.uid = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;