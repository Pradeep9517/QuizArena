import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Leaderboard from "../components/Leaderboard";
import socket from "../socket";

export default function ResultPage() {
  const location = useLocation();
  const result = location.state?.result;

  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://quizarena-8un2.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user || { name: "Guest", username: "Guest" });
      } catch (err) {
        console.log("User fetch failed:", err);
        setUser({ name: "Guest", username: "Guest" });
      }
    };
    if (token) fetchUser();
  }, [token]);

  // Join leaderboard room for live updates
  useEffect(() => {
    if (!result?.quizId || !user || user.username === "Guest") return;

    const username = user.username;
    const subject = result.subject || "General";

    socket.emit("joinQuiz", { quizId: result.quizId, user: username });
    socket.emit("getLeaderboard", { quizId: result.quizId, subject });

    return () => {
      socket.emit("leaveQuiz", { quizId: result.quizId, user: username });
    };
  }, [result?.quizId, result?.subject, user]);

  if (!result) {
    return (
      <h1 className="p-6 text-center text-xl font-semibold">
        No result found
      </h1>
    );
  }

  const totalAttempted = result.correct + result.wrong;
  const totalQuestions = result.total || totalAttempted + (result.notAttempted || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">
      <Navbar user={user} />

      <div className="p-4 sm:p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Result Card */}
        <div className="md:col-span-2 bg-white shadow-2xl rounded-2xl p-6 sm:p-8 text-center transition hover:shadow-3xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-purple-700">
            Quiz Result
          </h1>

          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-3xl sm:text-4xl font-extrabold shadow-lg">
              {result.score}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-base sm:text-lg font-semibold mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-purple-50 rounded-xl shadow">
              <p className="text-purple-600 text-sm sm:text-base">Correct</p>
              <p className="text-2xl sm:text-2xl text-green-600">{result.correct}</p>
            </div>
            <div className="p-3 sm:p-4 bg-purple-50 rounded-xl shadow">
              <p className="text-purple-600 text-sm sm:text-base">Wrong</p>
              <p className="text-2xl sm:text-2xl text-red-600">{result.wrong}</p>
            </div>
            <div className="p-3 sm:p-4 bg-purple-50 rounded-xl shadow">
              <p className="text-purple-600 text-sm sm:text-base">Not Attempted</p>
              <p className="text-2xl sm:text-2xl text-gray-600">{result.notAttempted || 0}</p>
            </div>
            <div className="p-3 sm:p-4 bg-purple-50 rounded-xl shadow">
              <p className="text-purple-600 text-sm sm:text-base">Total Attempted</p>
              <p className="text-2xl sm:text-2xl text-blue-600">{totalAttempted}</p>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="inline-block w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold px-6 py-2 sm:px-8 sm:py-3 rounded-xl shadow-lg transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Leaderboard */}
        <div className="bg-white shadow-2xl rounded-2xl p-4 sm:p-6 transition hover:shadow-3xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-purple-700 text-center">
            Leaderboard
          </h2>
          {user && (
            <Leaderboard
              quizId={result.quizId}
              subject={result.subject || "General"}
              currentUser={user.username || user.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}
