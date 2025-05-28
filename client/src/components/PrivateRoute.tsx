import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

type Props = {
  children: JSX.Element;
  requiredRole?: "company" | "student";
};

export default function PrivateRoute({ children, requiredRole }: Props) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" />;

  return children;
}
