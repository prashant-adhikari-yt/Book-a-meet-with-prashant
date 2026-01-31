import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../api/axios";

interface AuthState {
  token: string | null;
  user: { email: string; role: string } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
  loading: false,
  error: null,
};

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

// Verify Session
export const verifySession = createAsyncThunk(
  "auth/verifySession",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/verify");
      return data;
    } catch (error: any) {
      localStorage.removeItem("token");
      return rejectWithValue(
        error.response?.data?.message || "Session invalid",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify Session
      .addCase(verifySession.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifySession.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(verifySession.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
