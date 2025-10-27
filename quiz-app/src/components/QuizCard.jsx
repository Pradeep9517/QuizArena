import { Link } from "react-router-dom";
import React from "react";

function QuizCard({ quiz }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-purple-100">
      <h2 className="text-lg font-bold text-purple-700 mb-2 truncate">
        {quiz.title}
      </h2>
      <p className="text-gray-600 text-sm">
        Questions: {quiz.questions?.length || 0}
      </p>
      <p className="text-gray-600 text-sm mb-3">
        Duration: {Math.floor(quiz.duration / 60)} min
      </p>
      <Link
        to={`/quiz/${quiz._id}`}
        className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-xl shadow hover:from-pink-500 hover:to-purple-500 transition"
      >
        Start Quiz
      </Link>
    </div>
  );
}

export default React.memo(QuizCard);
