import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock, FaIdBadge } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    // ✅ Basic validation
    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
      const res = await axiosInstance.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // ✅ Save token in localStorage (same as Login)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success(res.data.message || "Registration successful!", {
        id: loadingToast,
      });

      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Server not reachable. Please check your connection."
          : "Registration failed. Try again.");
      toast.error(msg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <form onSubmit={handleRegister} className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-purple-700 text-center">
          Register
        </h1>

        {/* Name Input */}
        <div className="relative">
          <FaIdBadge className="absolute left-3 top-3 text-purple-400" />
          <input
            type="text"
            placeholder="Full Name"
            className="pl-10 pr-3 py-2 w-full rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="pl-10 pr-10 py-2 w-full rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="absolute right-3 top-3 text-purple-400 cursor-pointer select-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-purple-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="pl-10 pr-10 py-2 w-full rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition ${
            loading
              ? "opacity-60 cursor-not-allowed"
              : "hover:from-pink-500 hover:to-purple-500"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </>
  );
}
