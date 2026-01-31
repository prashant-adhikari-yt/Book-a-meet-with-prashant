import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import React, { useEffect, useState } from "react";
import { verifySession } from "./redux/authSlice";
import BookingPage from "./pages/BookingPage";
import SuccessPage from "./pages/SuccessPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

// Component to protect routes (Redirect to /admin/login if not authenticated)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, user, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If we have a token but no user data yet (and not loading), we might want to wait or just verify
  // But verify is triggered in AppWrapper.
  // If verifying failed, token would be null.
  // If verify is pending, show loading.
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

// Component for public routes (Redirect to /admin/dashboard if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (token && user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

// Wrapper ensuring verification runs on app load
const AppWrapper = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (token) {
        await dispatch(verifySession());
      }
      setIsVerifying(false);
    };
    verify();
  }, [dispatch, token]);

  if (isVerifying && token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/success" element={<SuccessPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        <Route
          path="/admin/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

export default App;
