import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const GuestRoute = () => {
  const { token } = useAuth();

  // Redirect to dashboard if user is already logged in
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
