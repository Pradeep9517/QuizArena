import { useState } from "react";
import axios from "axios";
import { FaUserAlt, FaLock, FaIdBadge } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // for redirect

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      // Optional: save token if backend returns one
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      alert("Registration successful!");

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col space-y-4">
      
      {/* Heading */}
      <h1 className="text-2xl font-bold text-purple-700 text-center">
        Register
      </h1>

      {/* Name Input */}
      <div className="relative">
        <FaIdBadge className="absolute left-3 top-3 text-purple-400" />
        <input
          type="text"
          placeholder="Name"
          className="pl-10 pr-3 py-2 w-full rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Email Input */}
      <div className="relative">
        <FaUserAlt className="absolute left-3 top-3 text-purple-400" />
        <input
          type="email"
          placeholder="Email"
          className="pl-10 pr-3 py-2 w-full rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <FaLock className="absolute left-3 top-3 text-purple-400" />
        <input
          type="password"
          placeholder="Password"
          className="pl-10 pr-3 py-2 w-full rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Register Button */}
      <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition">
        Register
      </button>
    </form>
  );
}
