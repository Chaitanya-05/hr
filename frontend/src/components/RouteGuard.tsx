// src/components/RouteGuard.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";


import type { ReactNode } from "react";

interface RouteGuardProps {
  children: ReactNode;
  requireAuth: boolean;
}

export default function RouteGuard({ children, requireAuth }: RouteGuardProps) {
  const token = useSelector((state: RootState) => state.auth.token);

  if (requireAuth && !token) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
