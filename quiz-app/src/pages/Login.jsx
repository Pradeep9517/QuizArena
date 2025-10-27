import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return; // ✅ Prevent double submit

    // ✅ Simple validations
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Logging in...");

    try {
      // ✅ Send login request
      const res = await axiosInstance.post("/api/auth/login", { email, password });

      // ✅ Store token & optional user data
      localStorage.setItem("token", res.data.token);
      if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Optional expiry (if backend sends)
      if (res.data.expiry) {
        localStorage.setItem("token_expiry", res.data.expiry);
      }

      toast.success("Login successful!", { id: loadingToast });

      // ✅ Redirect after short delay
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      // ✅ Smart error handling
      const msg =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Server not reachable. Please check your connection."
          : "Invalid credentials or server error.");

      toast.error(msg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-purple-700 text-center">
          Login
        </h1>

        {/* Email Input */}
        <div className="relative">
          <FaUserAlt className="absolute left-3 top-3 text-purple-400" />
          <input
            type="email"
            placeholder="Email"
            className="pl-10 pr-3 py-2 w-full rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-purple-400" />
          <input
            type="password"
            placeholder="Password"
            className="pl-10 pr-3 py-2 w-full rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition ${
            loading
              ? "opacity-60 cursor-not-allowed"
              : "hover:from-pink-500 hover:to-purple-500"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
}
