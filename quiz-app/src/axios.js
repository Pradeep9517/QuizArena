import axios from "axios";

const API = axios.create({
  baseURL: "https://quizarena-8un2.onrender.com/api",
});

// ✅ Request interceptor: JWT token add kare
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
