import mongoose from "mongoose";
import Leaderboard from "./models/Leaderboard.js";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    // Join Quiz Room
    socket.on("joinQuiz", ({ quizId, user }) => {
      if (!user) return; // prevent Guest join
      socket.join(quizId);
      console.log(`${user} joined quiz ${quizId}`);
    });

    // Leave Quiz Room
    socket.on("leaveQuiz", ({ quizId, user }) => {
      if (!user) return;
      socket.leave(quizId);
      console.log(`${user} left quiz ${quizId}`);
    });

    // On Quiz Submit → Update Leaderboard
    socket.on("quizSubmitted", async ({ quizId }) => {
      if (!quizId) return;
      try {
        const leaders = await Leaderboard.find({
          quizId: new mongoose.Types.ObjectId(quizId), // ✅ must use 'new'
        })
          .sort({ score: -1 })
          .limit(10);

        io.to(quizId).emit("leaderboardUpdate", leaders);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      }
    });

    // Get leaderboard on request
    socket.on("getLeaderboard", async ({ quizId }) => {
      if (!quizId) return;
      try {
        const leaders = await Leaderboard.find({
          quizId: new mongoose.Types.ObjectId(quizId), // ✅ must use 'new'
        })
          .sort({ score: -1 })
          .limit(10);

        socket.emit("leaderboardUpdate", leaders);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}
