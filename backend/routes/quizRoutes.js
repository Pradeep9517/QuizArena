import express from "express";
import { getQuiz, createQuiz, submitQuiz } from "../controllers/quizController.js";
import Quiz from "../models/Quiz.js";

const router = express.Router();

// Get all quizzes (dashboard)
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get quiz by ID
router.get("/:id", getQuiz);

// Create quiz (admin)
router.post("/", createQuiz);

// Submit quiz
router.post("/:id/submit", submitQuiz);

export default router;
