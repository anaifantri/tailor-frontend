import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = () => {
  const { token } = useAuth();

  // Redirect to login if there is no token
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Render nested child routes
  return <Outlet />;
};
