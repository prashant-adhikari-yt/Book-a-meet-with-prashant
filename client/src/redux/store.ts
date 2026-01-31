import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import availabilityReducer from "./availabilitySlice";
import bookingReducer from "./bookingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    availability: availabilityReducer,
    booking: bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
