import { useEffect, useState, useRef } from "react";
import socket from "../socket";

export default function Leaderboard({ quizId, subject }) {
  const [leaders, setLeaders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const latestLeaders = useRef([]);

  // ✅ Load user once from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        console.error("Invalid user in localStorage", e);
      }
    }
  }, []);

  // ✅ Real-time leaderboard updates
  useEffect(() => {
    if (!quizId) return;

    // Use throttling to limit re-render frequency (every 300ms)
    let updateTimeout = null;

    const handleUpdate = (data) => {
      const filtered = data
        .filter(
          (u) => String(u.quizId) === String(quizId) && u.subject === subject
        )
        .sort((a, b) => b.score - a.score);

      // Avoid unnecessary re-render if data unchanged
      const same =
        JSON.stringify(filtered) === JSON.stringify(latestLeaders.current);
      if (same) return;

      latestLeaders.current = filtered;

      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => setLeaders(filtered), 300);
    };

    socket.emit("joinQuiz", { quizId });
    socket.emit("getLeaderboard", { quizId });

    socket.on("leaderboardUpdate", handleUpdate);

    return () => {
      clearTimeout(updateTimeout);
      socket.off("leaderboardUpdate", handleUpdate);
      socket.emit("leaveQuiz", { quizId });
    };
  }, [quizId, subject]);

  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow transition-all duration-300">
      <h2 className="text-xl font-bold mb-4 text-center">🏆 Leaderboard</h2>

      {leaders.length === 0 ? (
        <p className="text-gray-500 text-center">No players yet</p>
      ) : (
        <ul className="space-y-2">
          {leaders.map((user, i) => {
            let bgColor = "bg-white";
            let medal = "";

            if (i === 0) bgColor = "bg-[#FFD700]";
            else if (i === 1) bgColor = "bg-[#C0C0C0]";
            else if (i === 2) bgColor = "bg-[#CD7F32]";

            const isSelf =
              currentUser && String(user.userId) === String(currentUser.id);

            return (
              <li
                key={user.userId || i}
                className={`p-2 shadow rounded-lg flex justify-between items-center transition-all duration-300 ${
                  isSelf ? "border-2 border-blue-500 bg-blue-50" : bgColor
                }`}
              >
                <span>
                  {i + 1}. {user.username || user.name}{" "}
                  {isSelf && (
                    <span className="text-blue-600 font-semibold ml-1">(You)</span>
                  )}
                </span>
                <span className="font-bold">{user.score} pts</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
