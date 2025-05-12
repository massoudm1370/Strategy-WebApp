import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}
