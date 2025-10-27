import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import Timer from "../components/Timer";
import Leaderboard from "../components/Leaderboard";
import Nav from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [user, setUser] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const token = localStorage.getItem("token");

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get("https://quizarena-8un2.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.log("User fetch failed:", err);
        setUser({ name: "Guest", score: 0 });
      }
    };
    fetchUser();
  }, [token]);

  // Fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`https://quizarena-8un2.onrender.com/api/quiz/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuiz();
  }, [id]);

  // Socket join/leave (wait for user + quiz to load)
  useEffect(() => {
    if (!user || !quiz) return;
    const username = user.username || user.name;

    socket.emit("joinQuiz", { quizId: id, user: username });

    return () => {
      socket.emit("leaveQuiz", { quizId: id, user: username });
    };
  }, [id, user, quiz]);

  const handleAnswer = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = async () => {
    if (!token) return alert("User not authenticated");

    try {
      const res = await axios.post(
        `https://quizarena-8un2.onrender.com
/api/quiz/${id}/submit`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Emit socket event for leaderboard update
      socket.emit("quizSubmitted", {
        quizId: id,
        subject: quiz.subject || "General",
      });

      // Navigate to result page
      navigate(`/result/${id}`, { state: { result: res.data, quiz } });
    } catch (err) {
      console.error(err);
      alert("Quiz submission failed");
    }
  };

  if (!quiz || !user)
    return (
      <h1 className="p-6 text-center text-xl font-semibold">
        Loading quiz...
      </h1>
    );

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <>
      <Nav user={user} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 bg-gradient-to-b from-purple-50 to-white min-h-screen mt-0">
        {/* Left Column: Quiz */}
        <div className="md:col-span-2 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white shadow-2xl rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg sm:text-xl font-bold text-purple-700">{quiz.title}</h1>
              <p className="text-sm sm:text-base text-gray-500">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
              {/* Progress Bar */}
              <div className="w-full bg-purple-100 h-2 rounded-full mt-1 sm:mt-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <Timer duration={quiz.duration} onTimeUp={handleSubmit} />
          </div>

          {/* Question Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-6 border-2 border-purple-300 rounded-2xl bg-white shadow hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-base sm:text-lg mb-4 text-purple-700">
                {currentQuestionIndex + 1}. {currentQuestion.text}
              </h2>
              <div className="grid gap-2 sm:gap-3">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = answers[currentQuestion._id] === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(currentQuestion._id, opt)}
                      className={`p-2 sm:p-3 rounded-xl border-2 text-left text-sm sm:text-base transition-all w-full ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-lg scale-[1.02]"
                          : "bg-purple-50 border-purple-300 hover:border-purple-400 hover:bg-purple-100"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Navigation */}
          <div className="sticky bottom-0 bg-white shadow-inner rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-4">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              className="w-full sm:w-auto bg-purple-200 hover:bg-purple-300 text-purple-800 px-4 sm:px-5 py-2 rounded-xl transition disabled:opacity-50"
            >
              Previous
            </button>
            {currentQuestionIndex < quiz.questions.length - 1 && (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white px-4 sm:px-5 py-2 rounded-xl transition"
              >
                Next
              </button>
            )}
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-4 sm:px-5 py-2 rounded-xl transition"
            >
              Submit Quiz
            </button>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="md:col-span-1 mt-4 md:mt-0">
          <div className="sticky top-6 space-y-4 sm:space-y-6">
            <Leaderboard
              quizId={id}
              subject={quiz.subject || "General"}
              currentUser={user.username || user.name}
            />
          </div>
        </div>
      </div>
    </>
  );
}
