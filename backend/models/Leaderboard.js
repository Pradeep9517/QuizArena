import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  date: { type: Date, default: Date.now }
});

// 🚫 Prevent same user from submitting same quiz twice
leaderboardSchema.index({ userId: 1, quizId: 1 }, { unique: true });

export default mongoose.model("Leaderboard", leaderboardSchema);
