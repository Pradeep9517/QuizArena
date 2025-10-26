// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar({ user }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="flex justify-between items-center bg-white shadow-2xl rounded-2xl p-4 mb-6">
      {/* Left Side: App Name */}
      <h1 className="text-2xl font-bold text-purple-700">QuizArena</h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {user && user.name !== "Guest" ? (
          <>
            <span className="font-semibold text-purple-700">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
