import { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

// ✅ Memoized Input Field (Prevents re-render)
const InputField = memo(({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-3 text-purple-400" />
    <input
      {...props}
      className="pl-10 pr-3 py-2 w-full rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
    />
  </div>
));

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Single handler for both inputs
  const handleChange = useCallback(
    (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    []
  );

  // ✅ Memoized submit handler (prevents re-creation)
  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      const { email, password } = form;
      if (!email.includes("@")) return toast.error("Please enter a valid email address");
      if (password.length < 6) return toast.error("Password must be at least 6 characters long");

      setLoading(true);
      const loadingToast = toast.loading("Logging in...");

      try {
        const res = await axiosInstance.post("/api/auth/login", form);
        localStorage.setItem("token", res.data.token);
        if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));

        if (res.data.expiry) localStorage.setItem("token_expiry", res.data.expiry);

        toast.success("Login successful!", { id: loadingToast });
        navigate("/dashboard", { replace: true }); // ✅ Faster navigation (no history push)
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          (err.code === "ERR_NETWORK"
            ? "Server not reachable. Please check your connection."
            : "Invalid credentials or server error.");
        toast.error(msg, { id: loadingToast });
      } finally {
        setLoading(false);
      }
    },
    [form, loading, navigate]
  );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-purple-700 text-center">Login</h1>

        {/* Inputs */}
        <InputField
          name="email"
          type="email"
          placeholder="Email"
          icon={FaUserAlt}
          value={form.email}
          onChange={handleChange}
          required
        />
        <InputField
          name="password"
          type="password"
          placeholder="Password"
          icon={FaLock}
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-transform duration-200 ${
            loading
              ? "opacity-60 cursor-not-allowed"
              : "hover:from-pink-500 hover:to-purple-500 hover:scale-[1.02]"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
}
