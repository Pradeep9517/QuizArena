// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Nav from "../components/Navbar";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [user, setUser] = useState({ name: "", score: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🌀 Run both API calls in parallel for speed
        const [userRes, quizRes] = await Promise.all([
          axiosInstance.get("/api/auth/me"),
          axiosInstance.get("/api/quiz"),
        ]);

        setUser(userRes.data.user || { name: "Guest", score: 0 });
        setQuizzes(quizRes.data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setUser({ name: "Guest", score: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold text-purple-700">
        Loading dashboard...
      </div>
    );

  return (
    <>
      <Nav user={user} />
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-purple-700">
            Welcome, {user?.name || "Guest"}!
          </h2>
        </div>

        {/* Quiz Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-2xl transition flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-lg sm:text-xl mb-2">{quiz.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  {quiz.description || "No description available"}
                </p>
              </div>
              <button
                onClick={() => navigate(`/quiz/${quiz._id}`)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-xl w-full sm:w-auto transition"
              >
                Join Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
