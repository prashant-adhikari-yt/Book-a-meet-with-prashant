import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../api/axios";

export interface Booking {
  _id?: string;
  name: string;
  email: string;
  date: string;
  time: string;
  note?: string;
  status: "booked" | "cancelled";
  createdAt?: string;
}

interface BookingState {
  bookings: Booking[];
  slots: string[];
  availableDates: string[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  slots: [],
  availableDates: [],
  loading: false,
  error: null,
};

// Get available dates (Public)
export const fetchAvailableDates = createAsyncThunk(
  "booking/fetchAvailableDates",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/bookings/available-dates");
      return data.dates;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dates",
      );
    }
  },
);

// Get available slots (Public)
export const fetchSlots = createAsyncThunk(
  "booking/fetchSlots",
  async (date: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/bookings/slots?date=${date}`);
      return data.slots;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch slots",
      );
    }
  },
);

// Create booking (Public)
export const createBooking = createAsyncThunk(
  "booking/create",
  async (
    bookingData: Omit<Booking, "_id" | "status" | "createdAt">,
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post("/bookings", bookingData);
      return data.booking;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booking",
      );
    }
  },
);

// Fetch all bookings (Admin)
export const fetchBookings = createAsyncThunk(
  "booking/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/bookings");
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings",
      );
    }
  },
);

// Cancel booking (Admin)
export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/bookings/${id}`);
      return data.booking;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel",
      );
    }
  },
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearSlots: (state) => {
      state.slots = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Slots
      .addCase(fetchSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSlots.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.loading = false;
          state.slots = action.payload;
        },
      )
      .addCase(fetchSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Available Dates
      .addCase(
        fetchAvailableDates.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.availableDates = action.payload;
        },
      )
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Bookings
      .addCase(
        fetchBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.bookings = action.payload;
        },
      )
      // Cancel Booking
      .addCase(
        cancelBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          const index = state.bookings.findIndex(
            (b) => b._id === action.payload._id,
          );
          if (index !== -1) {
            state.bookings[index] = action.payload;
          }
        },
      );
  },
});

export const { clearSlots } = bookingSlice.actions;
export default bookingSlice.reducer;
