// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Nav from "../components/Navbar";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState(() => {
    // ✅ Cached quizzes (instant UI on reload)
    const cached = sessionStorage.getItem("quizzes");
    return cached ? JSON.parse(cached) : [];
  });

  const [user, setUser] = useState(() => {
    const cachedUser = sessionStorage.getItem("user");
    return cachedUser ? JSON.parse(cachedUser) : { name: "", score: 0 };
  });

  const [loading, setLoading] = useState(!quizzes.length);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, quizRes] = await Promise.all([
          axiosInstance.get("/api/auth/me"),
          axiosInstance.get("/api/quiz"),
        ]);

        const userData = userRes.data.user || { name: "Guest", score: 0 };
        const quizData = quizRes.data || [];

        // ✅ Update UI
        setUser(userData);
        setQuizzes(quizData);

        // ✅ Save cache (fast reloads)
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("quizzes", JSON.stringify(quizData));
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setError("Failed to load dashboard. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white px-6 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-purple-200 rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(8)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-md p-6 space-y-4"
                >
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-purple-200 rounded w-1/2 mt-4"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <p className="text-red-600 text-lg font-semibold mb-3">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple-600 text-white px-5 py-2 rounded-xl"
        >
          Retry
        </button>
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
          <p className="text-gray-600 text-sm sm:text-base">
            Choose a quiz below and start your challenge 💪
          </p>
        </div>

        {/* Quiz Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-2xl transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2">
                    {quiz.title}
                  </h3>
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
            ))
          ) : (
            <div className="text-center text-gray-600 col-span-full py-10">
              No quizzes available at the moment.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
