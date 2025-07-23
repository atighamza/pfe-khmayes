import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { Briefcase, GraduationCap } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, role } = useAuth();

  // Prevent vertical scroll by setting min-h-screen and hiding overflow
  return (
    <div className="min-h-[92vh] overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      {!isAuthenticated ? (
        <>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to Forsa Internships
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find or offer the best internships powered by AI. Sign up to get
            started!
          </p>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              Signup
            </Link>
          </div>
        </>
      ) : role === "company" ? (
        <>
          <Briefcase size={64} className="text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Welcome, Company Partner!
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-xl text-center">
            Post new internship opportunities, manage your listings, and connect
            with talented students looking for real-world experience.
          </p>
          <div className="flex gap-4">
            <Link
              to="/company/post-internship"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Post Internship
            </Link>
            <Link
              to="/company/dashboard"
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              My Internships
            </Link>
          </div>
        </>
      ) : (
        <>
          <GraduationCap size={64} className="text-purple-600 mb-4" />
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            Welcome, Student!
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-xl text-center">
            Discover internships tailored for you, build your profile, and apply
            to opportunities that match your skills and ambitions.
          </p>
          <div className="flex gap-4">
            <Link
              to="/internships"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Browse Internships
            </Link>
            <Link
              to="/student/profile"
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              My Profile
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
