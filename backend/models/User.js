import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  score: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
  wrong: { type: Number, default: 0 },
  notAttempted: { type: Number, default: 0 },
  subject: { type: String, default: "General" },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    score: { type: Number, default: 0 }, // total score
    submitted: { type: Map, of: attemptSchema, default: {} }, // store per-quiz attempts
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
