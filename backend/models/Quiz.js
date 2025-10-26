import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true }, // ✅ Add this
    duration: { type: Number, default: 300 }, // seconds
    questions: [questionSchema],
  },
  { timestamps: true } // createdAt, updatedAt
);

export default mongoose.model("Quiz", quizSchema);
