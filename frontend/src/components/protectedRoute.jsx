import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // while checking token
  if (!user) return <Navigate to="/login" replace />; // redirect if not logged in

  return children; // show the page if logged in
}
