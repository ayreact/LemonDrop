import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

const PrivateRoute = () => {
  const auth = useAuth();

  if (!auth) {
    return <div>Loading...</div>; // Show loading if auth state is still initializing
  }

  if (auth.loading) {
    return <div>Loading...</div>; // Ensure we don't redirect before auth state is checked
  }

  return auth.user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
