import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    // user is not authenticated
    return <Navigate to="/admin-login" />;
  }

  return children;
};