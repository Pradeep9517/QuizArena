import { useEffect, useState } from "react";
import socket from "../socket";

export default function Leaderboard({ quizId, subject, currentUser }) {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    // Listen for leaderboard updates
    const handleUpdate = (data) => {
      const filtered = data.filter(
        (u) => String(u.quizId) === String(quizId) && u.subject === subject
      );
      setLeaders(filtered);
    };

    socket.on("leaderboardUpdate", handleUpdate);

    // Request leaderboard
    socket.emit("getLeaderboard", { quizId });

    return () => {
      socket.off("leaderboardUpdate", handleUpdate);
    };
  }, [quizId, subject]);

  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">🏆 Leaderboard</h2>

      {leaders.length === 0 ? (
        <p className="text-gray-500 text-center">No players yet</p>
      ) : (
        <ul className="space-y-2">
          {leaders.map((user, i) => {
            let bgColor = "bg-white";
            let medal = "";
            let medalColor = "";

            if (i === 0) { bgColor = "bg-[#FFD700]"; medal = "🥇"; medalColor = "#FFD700"; }
            else if (i === 1) { bgColor = "bg-[#C0C0C0]"; medal = "🥈"; medalColor = "#C0C0C0"; }
            else if (i === 2) { bgColor = "bg-[#CD7F32]"; medal = "🥉"; medalColor = "#CD7F32"; }

            const isSelf = currentUser && (user.username === currentUser || user.name === currentUser);

            return (
              <li
                key={i}
                className={`p-2 shadow rounded-lg flex justify-between items-center ${
                  isSelf ? "border-2 border-blue-500 bg-blue-50" : bgColor
                }`}
              >
                <span>
                  {i + 1}. {user.username || user.name}{" "}
                  {medal && <span style={{ color: medalColor, marginLeft: 4 }}>{medal}</span>}
                  {isSelf && <span className="text-blue-600 font-semibold ml-1">(You)</span>}
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
