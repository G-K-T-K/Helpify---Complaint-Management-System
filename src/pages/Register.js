import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify'; // Import toast
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineHashtag,
} from "react-icons/hi";
import {
  FaTools,
  FaLightbulb,
  FaExclamationCircle,
  FaComments,
} from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      // --- REPLACED alert() WITH a warning toast ---
      toast.warn("Passwords do not match!");
      return;
    }

    try {
      const API_URL = "http://localhost:5000/api/auth/register";
      const { rollNumber, name, email, password } = formData;
      const response = await axios.post(API_URL, {
        rollNumber,
        name,
        email,
        password,
      });

      console.log(response.data);
      // --- REPLACED alert() WITH a success toast ---
      toast.success("Registration successful! Please log in.");
      navigate("/");

    } catch (error) {
      const message = error.response ? error.response.data.message : "An error occurred.";
      console.error("Registration error:", message);
      
      // --- REPLACED alert() WITH an error toast ---
      toast.error(`Registration failed: ${message}`);
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
            Create Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Roll Number Input (Added) */}
            <div className="relative">
              <HiOutlineHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="text"
                name="rollNumber"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
                placeholder="Enter your Roll Number"
                onChange={handleChange}
                value={formData.rollNumber}
                required
              />
            </div>

            {/* Name Input */}
            <div className="relative">
              <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="text"
                name="name"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
                placeholder="Enter your name"
                onChange={handleChange}
                value={formData.name}
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="email"
                name="email"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
                placeholder="you@example.com"
                onChange={handleChange}
                value={formData.email}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="password"
                name="password"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
                placeholder="••••••••"
                onChange={handleChange}
                value={formData.password}
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="password"
                name="confirmPassword"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
                placeholder="••••••••"
                onChange={handleChange}
                value={formData.confirmPassword}
                required
              />
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 font-semibold py-3 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
            >
              Register
            </button>
          </form>
          <p className="text-center text-sm text-gray-300 mt-6">
            Already have an account?{" "}
            <Link to="/" className="font-semibold underline hover:text-white">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;