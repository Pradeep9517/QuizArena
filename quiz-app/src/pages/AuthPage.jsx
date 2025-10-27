import { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Lazy load forms
const Login = lazy(() => import("./Login"));
const Register = lazy(() => import("./Register"));

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [bgLoaded, setBgLoaded] = useState(false);

  // ✅ Preload background image for smooth load
  useEffect(() => {
    const img = new Image();
    img.src = "/10740576.jpg";
    img.onload = () => setBgLoaded(true);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-4 transition-all duration-500 ${
        bgLoaded ? "opacity-100" : "opacity-0"
      }`}
      style={{
        backgroundImage: "url('/10740576.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-gradient-to-br from-purple-200 via-purple-100 to-white rounded-3xl shadow-2xl hover:shadow-3xl transform-gpu hover:scale-[1.02] transition p-8 relative overflow-hidden backdrop-blur-md"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-pink-500 to-purple-700 animate-pulse">
          {isLogin ? "⚡ Login to QuizArena" : "🔥 Register for QuizArena"}
        </h2>

        {/* Animate form switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Suspense fallback={<div className="text-center text-purple-600">Loading...</div>}>
              {isLogin ? <Login /> : <Register />}
            </Suspense>
          </motion.div>
        </AnimatePresence>

        {/* Toggle link */}
        <div className="text-center mt-6 text-purple-600 font-semibold">
          {isLogin ? (
            <span>
              Don’t have an account?{" "}
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
      </motion.div>

      {/* Footer */}
      <p className="mt-6 text-gray-100 text-sm text-center tracking-wide animate-pulse drop-shadow-lg">
        &copy; 2025 QuizArena. Enter the arena.
      </p>
    </div>
  );
}
