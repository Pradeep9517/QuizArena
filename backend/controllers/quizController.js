import Quiz from "../models/Quiz.js";
import User from "../models/User.js";
import Leaderboard from "../models/Leaderboard.js";
import jwt from "jsonwebtoken";

// Helper: get user from JWT
const getUserFromToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    return null;
  }
};

// GET Quiz by ID
export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE Quiz (Admin)
export const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SUBMIT Quiz (only first submission stored)
// SUBMIT Quiz (only first submission stored, scoring: correct +4, wrong -1)
export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = getUserFromToken(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0,
      correct = 0,
      wrong = 0,
      notAttempted = 0;

    // Evaluate each question
    quiz.questions.forEach((q) => {
      const userAnswer = answers ? answers[q._id] : undefined;

      if (!userAnswer) {
        notAttempted++;
        return;
      }

      if (userAnswer === q.correctAnswer) {
        score += 4;
        correct++;
      } else {
        score -= 1; // penalty for wrong
        wrong++;
      }
    });

    const dbUser = await User.findById(userId);
    if (!dbUser) return res.status(404).json({ message: "User not found" });

    // Leaderboard: store only first submission
    const existingEntry = await Leaderboard.findOne({
      userId,
      quizId: quiz._id,
    });

    if (!existingEntry) {
      await Leaderboard.create({
        userId,
        username: dbUser.name,
        subject: quiz.subject || "General",
        score,
        quizId: quiz._id,
      });
    }

    // Return latest attempt result (without modifying leaderboard)
    res.json({
      score,
      correct,
      wrong,
      notAttempted,
      total: quiz.questions.length,
      quizId: quiz._id,
      subject: quiz.subject,
      message:
        "Leaderboard updated only for first submission. Latest attempt marks shown here.",
    });
  } catch (err) {
    console.error("submitQuiz error:", err);
    res.status(500).json({ error: err.message });
  }
};
