import mongoose from "mongoose";
import Leaderboard from "./models/Leaderboard.js";

const leaderboardCache = new Map(); // 🧠 cache to store latest leaderboard per quiz

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    // Join Room
    socket.on("joinQuiz", ({ quizId, user }) => {
      if (!quizId || !user) return;
      socket.join(quizId);
      console.log(`${user} joined quiz ${quizId}`);
    });

    // Leave Room
    socket.on("leaveQuiz", ({ quizId, user }) => {
      socket.leave(quizId);
      console.log(`${user} left quiz ${quizId}`);
    });

    // ✅ Get leaderboard instantly (cached)
    socket.on("getLeaderboard", async ({ quizId }) => {
      if (!quizId) return;

      // Step 1: Send cached leaderboard instantly
      if (leaderboardCache.has(quizId)) {
        socket.emit("leaderboardUpdate", leaderboardCache.get(quizId));
      }

      // Step 2: Fetch latest from DB in background (update cache)
      try {
        const leaders = await Leaderboard.find({
          quizId: new mongoose.Types.ObjectId(quizId),
        })
          .sort({ score: -1 })
          .limit(10);

        leaderboardCache.set(quizId, leaders);
        socket.emit("leaderboardUpdate", leaders);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      }
    });

    // ✅ On quiz submit — instantly broadcast updated leaderboard
    socket.on("quizSubmitted", async ({ quizId }) => {
      if (!quizId) return;

      try {
        const leaders = await Leaderboard.find({
          quizId: new mongoose.Types.ObjectId(quizId),
        })
          .sort({ score: -1 })
          .limit(10);

        leaderboardCache.set(quizId, leaders);
        io.to(quizId).emit("leaderboardUpdate", leaders);
      } catch (err) {
        console.error("Leaderboard update error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}
