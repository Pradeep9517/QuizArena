import { useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import Login from "./Login";
import Register from "./Register";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/10740576.webp')" }}
    >
      {/* Card */}
      <div className="w-full max-w-md bg-gradient-to-br from-purple-200 via-purple-100 to-white rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition p-8 relative overflow-hidden bg-opacity-90 backdrop-blur-md">

        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-pink-500 to-purple-700 animate-pulse">
          {isLogin ? "⚡ Login to QuizArena" : "🔥 Register for QuizArena"}
        </h2>

        {/* Form */}
        <div className="transition-all duration-500 space-y-4">
          {isLogin ? <Login /> : <Register />}
        </div>

        {/* Toggle link */}
        <div className="text-center mt-6 text-purple-600 font-semibold">
          {isLogin ? (
            <span>
              Don't have an account?{" "}
              <button
                className="hover:text-purple-700 hover:underline font-bold transition"
                onClick={() => setIsLogin(false)}
              >
                Register here
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                className="hover:text-purple-700 hover:underline font-bold transition"
                onClick={() => setIsLogin(true)}
              >
                Login here
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-gray-100 text-sm text-center tracking-wide animate-pulse drop-shadow-lg">
        &copy; 2025 QuizArena. Enter the arena.
      </p>
    </div>
  );
}
