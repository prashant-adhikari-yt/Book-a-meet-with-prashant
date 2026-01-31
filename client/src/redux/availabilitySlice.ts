import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../api/axios";

interface Availability {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}

interface AvailabilityState {
  availabilities: Availability[];
  loading: boolean;
  error: string | null;
}

const initialState: AvailabilityState = {
  availabilities: [],
  loading: false,
  error: null,
};

// Fetch all availability (Admin)
export const fetchAvailabilities = createAsyncThunk(
  "availability/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/availability");
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch",
      );
    }
  },
);

// Add availability (Admin)
export const addAvailability = createAsyncThunk(
  "availability/add",
  async (
    availabilityData: {
      dates: string[];
      startTime: string;
      endTime: string;
      duration: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post("/availability", availabilityData);
      return data.availabilities;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add");
    }
  },
);

// Delete availability (Admin)
export const deleteAvailability = createAsyncThunk(
  "availability/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/availability/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete",
      );
    }
  },
);

const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAvailabilities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAvailabilities.fulfilled,
        (state, action: PayloadAction<Availability[]>) => {
          state.loading = false;
          state.availabilities = action.payload;
        },
      )
      .addCase(fetchAvailabilities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add
      .addCase(
        addAvailability.fulfilled,
        (state, action: PayloadAction<Availability[]>) => {
          state.availabilities.push(...action.payload);
        },
      )
      // Delete
      .addCase(
        deleteAvailability.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.availabilities = state.availabilities.filter(
            (a) => a._id !== action.payload,
          );
        },
      );
  },
});

export default availabilitySlice.reducer;
