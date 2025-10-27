import { Link } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User } from "lucide-react";
import React from "react";

function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovering, setHovering] = useState(false);

  const avatarUrl = useMemo(
    () => `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "Guest"}`,
    [user?.name]
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setTimeout(() => (window.location.href = "/"), 400);
  }, []);

  return (
    <motion.nav
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative flex justify-between items-center bg-white/80 backdrop-blur-lg border-b border-purple-200/60 shadow-[0_8px_30px_rgba(187,134,252,0.2)] px-8 py-4 sticky top-0 z-50"
    >
      {/* Logo */}
      <motion.div whileHover={{ scale: 1.05 }}>
        <Link
          to="/dashboard"
          className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent tracking-tight"
        >
          QuizArena
        </Link>
      </motion.div>

      {/* Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-purple-600"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menu */}
      <div
        className={`${
          menuOpen
            ? "flex flex-col absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-purple-100 shadow-lg md:static md:flex md:flex-row md:shadow-none"
            : "hidden md:flex"
        } items-center gap-4 p-4 md:p-0 transition-all duration-500`}
      >
        <Link
          to="/dashboard"
          className="px-5 py-2 font-semibold text-purple-700 rounded-xl hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:shadow-md transition-all duration-200"
        >
          Home
        </Link>

        {user && user.name !== "Guest" ? (
          <div
            className="relative"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <div className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all">
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-9 h-9 rounded-full border-2 border-purple-400 shadow-sm"
              />
              <span className="font-semibold text-purple-700">{user.name}</span>
            </div>

            {hovering && (
              <motion.div
                key="dropdown"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 bg-white border border-purple-100 rounded-2xl shadow-lg p-3 w-44"
              >
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 text-purple-700 rounded-lg hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-all"
                >
                  <User size={18} /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-red-500 rounded-lg hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 transition-all w-full"
                >
                  <LogOut size={18} /> Logout
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/login"
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-pink-500 hover:to-purple-500 text-white px-5 py-2 rounded-xl font-medium shadow-md transition-all"
              >
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/register"
                className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 hover:from-pink-500 hover:to-orange-400 text-white px-5 py-2 rounded-xl font-medium shadow-md transition-all"
              >
                Register
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

export default React.memo(Navbar);
