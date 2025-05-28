import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { toastError, toastSuccess } from "../utils/toasts";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signup(form);
      localStorage.setItem("token", res.data.token);

      toastSuccess("Account created! Welcome " + res.data.user.name);
      navigate("/dashboard");
    } catch (err) {
      toastError("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/2 bg-gradient-to-br from-purple-600 to-blue-600 text-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Forsa Internships</h2>
          <p className="text-lg">
            Create your free account and connect with future opportunities
            powered by AI.
          </p>
        </div>

        <div className="md:w-1/2 p-10">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">
            Sign up for a new account
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                required
                type="text"
                placeholder=" "
                className="peer w-full border border-gray-300 px-4 py-3 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <label className="absolute left-4 top-2 text-sm text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
                Full name
              </label>
            </div>

            <div className="relative">
              <input
                required
                type="email"
                placeholder=" "
                className="peer w-full border border-gray-300 px-4 py-3 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <label className="absolute left-4 top-2 text-sm text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
                Email address
              </label>
            </div>

            <div className="relative">
              <input
                required
                type="password"
                placeholder=" "
                className="peer w-full border border-gray-300 px-4 py-3 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <label className="absolute left-4 top-2 text-sm text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
                Password
              </label>
            </div>

            <div className="relative">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="company">Company</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition duration-300 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-purple-500 hover:underline">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
