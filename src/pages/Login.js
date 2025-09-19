import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify'; // Import toast
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import {
  FaTools,
  FaLightbulb,
  FaExclamationCircle,
  FaComments,
} from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Corrected this line
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = "http://localhost:5000/api/auth/login";
      const response = await axios.post(API_URL, { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);

      // --- REPLACED alert() WITH a success toast ---
      toast.success('Login successful! Welcome back.');
      
      navigate("/home");

    } catch (error) {
      const message = error.response ? error.response.data.message : "An error occurred.";
      console.error("Login error:", message);

      // --- REPLACED alert() WITH an error toast ---
      toast.error(`Login failed: ${message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient p-4 relative overflow-hidden">
      {/* Animated Background Icons */}
      <div className="background-icons">
        <FaExclamationCircle className="icon icon-1 text-purple-400 opacity-30" />
        <FaTools className="icon icon-2 text-pink-400 opacity-30" />
        <FaLightbulb className="icon icon-3 text-blue-400 opacity-30" />
        <FaComments className="icon icon-4 text-green-400 opacity-30" />
        <FaExclamationCircle className="icon icon-5 text-indigo-400 opacity-30" />
        <FaTools className="icon icon-6 text-red-400 opacity-30" />
      </div>

      <div className="relative w-full max-w-lg z-10">
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-3xl opacity-75 animate-pulse neon-glow"></div>

        {/* Form Card */}
        <div className="relative backdrop-blur-xl bg-black/30 border border-white/10 shadow-2xl rounded-3xl p-8 text-white">
          <h2 className="text-4xl font-bold text-center mb-8 font-sans">
            Helpify
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="email"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="password"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Corrected this line
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 font-semibold py-3 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-sm text-gray-300 mt-6">
            Don’t have an account?{" "}
            <a href="/register" className="font-semibold underline hover:text-white">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;