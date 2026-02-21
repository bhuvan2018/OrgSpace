import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");

  if (!token || !orgId) return <Navigate to="/" />;

  return children;
}