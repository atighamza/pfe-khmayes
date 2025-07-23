import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  if (!mounted) return null;

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}

      <Link
        to="/"
        className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        <img src={logo} alt="forsa" width={150} height={150}/>
        {/* Forsa */}
      </Link>

      {/* Menu */}
      {isAuthenticated ? (
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          {role === "company" ? (
            <>
              <Link to="/company/post-internship" className="nav-link">
                Post Internship
              </Link>
              <Link to="/company/dashboard" className="nav-link">
                My Internships
              </Link>
              <Link to="/company/student-posts" className="nav-link">
                Student Posts
              </Link>
            </>
          ) : (
            <>
              <Link to="/internships" className="nav-link">
                Browse Internships
              </Link>
              <Link to="/student/profile" className="nav-link">
                My Profile
              </Link>
            </>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/signup" className="nav-link">
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
}
