import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import Leaderboard from "../components/Leaderboard";
import socket from "../socket";

export default function ResultPage() {
  const location = useLocation();
  const result = location.state?.result;
  const [user, setUser] = useState(() => {
    // ✅ Try reading cached user to avoid delay
    const cached = sessionStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(!user);

  // ✅ Fetch user only if not cached
  useEffect(() => {
    if (user || !result) return;

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/me");
        const fetched = res.data.user || { name: "Guest", username: "Guest" };
        setUser(fetched);
        sessionStorage.setItem("user", JSON.stringify(fetched));
      } catch {
        setUser({ name: "Guest", username: "Guest" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [result]);

  // ✅ Setup socket only after user + result available
  useEffect(() => {
    if (!result || !user) return;
    if (user.username === "Guest") return;

    const username = user.username;
    const subject = result.subject || "General";

    socket.emit("joinQuiz", { quizId: result.quizId, user: username });
    socket.emit("getLeaderboard", { quizId: result.quizId, subject });

    return () => {
      socket.emit("leaveQuiz", { quizId: result.quizId, user: username });
    };
  }, [user, result]);

  if (!result) {
    return (
      <h1 className="p-6 text-center text-xl font-semibold">No result found</h1>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg text-purple-700 font-semibold">
        Loading result...
      </div>
    );
  }

  const totalAttempted = result.correct + result.wrong;
  const totalQuestions =
    result.total || totalAttempted + (result.notAttempted || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">
      <Navbar user={user} />

      <div className="p-4 sm:p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Result Card */}
        <div className="md:col-span-2 bg-white shadow-2xl rounded-2xl p-6 sm:p-8 text-center transition hover:shadow-3xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-purple-700">
            Quiz Result
          </h1>

          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-3xl sm:text-4xl font-extrabold shadow-lg">
              {result.score}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-base sm:text-lg font-semibold mb-6">
            <div className="p-4 bg-purple-50 rounded-xl shadow">
              <p className="text-purple-600 text-sm">Correct</p>
              <p className="text-2xl text-green-600">{result.correct}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl shadow">
              <p className="text-purple-600 text-sm">Wrong</p>
              <p className="text-2xl text-red-600">{result.wrong}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl shadow">
              <p className="text-purple-600 text-sm">Not Attempted</p>
              <p className="text-2xl text-gray-600">{result.notAttempted || 0}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl shadow">
              <p className="text-purple-600 text-sm">Total Attempted</p>
              <p className="text-2xl text-blue-600">{totalAttempted}</p>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* ✅ Lazy load leaderboard after result UI */}
        <div className="bg-white shadow-2xl rounded-2xl p-6 transition hover:shadow-3xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-700 text-center">
            Leaderboard
          </h2>
          {user && (
            <Leaderboard
              quizId={result.quizId}
              subject={result.subject || "General"}
              currentUser={user.username || user.name}
              key={result.quizId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
