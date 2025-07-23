import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../utils/toasts";

export default function Login({ onLogin }: { onLogin?: () => void }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      toastSuccess("Welcome back, " + res.data.user.name);
      if (onLogin) onLogin(); // notify parent
      navigate("/");
    } catch (err) {
      toastError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Forsa Internships</h2>
          <p className="text-lg">
            Unlock career opportunities. Find or publish your perfect internship
            with AI assistance.
          </p>
        </div>

        <div className="md:w-1/2 p-10">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">
            Login to your account
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type="email"
                required
                placeholder=" "
                className="peer w-full border border-gray-300 px-4 py-3 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <label className="absolute left-4 top-0.5 text-sm text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
                Email address
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                required
                placeholder=" "
                className="peer w-full border border-gray-300 px-4 py-3 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <label className="absolute left-4 top-0.5 text-sm text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
                Password
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
