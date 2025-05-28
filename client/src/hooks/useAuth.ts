import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  role: string;
  exp: number;
}

export function useAuth() {
  const token = localStorage.getItem("token");

  if (!token) return { isAuthenticated: false, role: null };

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const expired = decoded.exp * 1000 < Date.now();

    return {
      isAuthenticated: !expired,
      role: decoded.role,
    };
  } catch (err) {
    return { isAuthenticated: false, role: null };
  }
}
