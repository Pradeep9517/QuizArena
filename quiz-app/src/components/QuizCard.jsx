import { Link } from "react-router-dom";

export default function QuizCard({ quiz }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition">
      <h2 className="text-lg font-bold">{quiz.title}</h2>
      <p className="text-gray-600">Questions: {quiz.questions.length}</p>
      <p className="text-gray-600">Duration: {quiz.duration} sec</p>
      <Link
        to={`/quiz/${quiz._id}`}
        className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Start Quiz
      </Link>
    </div>
  );
}
