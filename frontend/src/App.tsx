// src/App.tsx
import { Routes, Route } from "react-router-dom";
import RouteGuard from "./components/RouteGuard";
import { Toaster } from "react-hot-toast";
import LoginPage from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/login"
          element={
            <RouteGuard requireAuth={false}>
              <LoginPage />
            </RouteGuard>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RouteGuard requireAuth={true}>
              <Dashboard />
            </RouteGuard>
          }
        />
        <Route path="*" element={<RouteGuard requireAuth={true}><Dashboard /></RouteGuard>} />
      </Routes>
    </>
  );
}
