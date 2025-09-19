import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

// --- IMPORTS FOR CHART ---
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// --- CLEANED UP ICON IMPORTS ---
import {
  FaUserCircle, FaSignOutAlt, FaClipboardList, FaChartLine, FaPlusCircle, FaUsersCog, FaTasks
} from 'react-icons/fa';

// --- REGISTER CHART.JS COMPONENTS ---
ChartJS.register(ArcElement, Tooltip, Legend);

// --- Reusable Dashboard Card Component ---
const DashboardCard = ({ icon, title, description, onClick }) => (
  <div className="relative group">
    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-md opacity-50 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
    <div
      className="relative backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl p-8 cursor-pointer h-full flex flex-col justify-between"
      onClick={onClick}
    >
      <div>
        {icon}
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async (token, userPayload) => {
    setUser(userPayload);
    if (userPayload.role === 'admin') {
      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/admin/complaints/stats', config);
        setStats(res.data);
      } catch (err) {
        toast.error('Could not load dashboard stats.');
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        fetchData(token, decodedToken.user);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        toast.error("Your session has expired. Please log in again.");
        navigate("/");
      }
    } else {
      toast.error("You must be logged in to view this page.");
      navigate("/");
    }
  }, [fetchData, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("You have been logged out successfully.");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const chartData = {
    labels: ['Pending', 'Resolved'],
    datasets: [
      {
        data: [stats?.pending, stats?.resolved],
        backgroundColor: ['rgba(192, 75, 192, 0.5)', 'rgba(75, 192, 192, 0.5)'],
        borderColor: ['rgba(192, 75, 192, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#e5e7eb', font: { size: 14 } } },
      title: { display: false },
    },
    cutout: '60%',
  };

  const renderDashboardCards = () => {
    switch (user.role) {
      case "student":
        return (
          <>
            <DashboardCard
              icon={<FaPlusCircle size={48} className="mb-4 text-green-400" />}
              title="Submit a Complaint"
              description="Register a new complaint for any issues."
              onClick={() => navigate("/submit-complaint")}
            />
            <DashboardCard
              icon={<FaChartLine size={48} className="mb-4 text-pink-400" />}
              title="Track My Complaints"
              description="View the status and history of your complaints."
              onClick={() => navigate("/track")}
            />
          </>
        );
      case "staff":
        return (
          <>
            <DashboardCard
              icon={<FaClipboardList size={48} className="mb-4 text-yellow-400" />}
              title="View Assigned Complaints"
              description="Check and update the status of your assigned tasks."
              onClick={() => navigate("/assigned-complaints")}
            />
          </>
        );
      default:
        return user.role === 'admin' ? null : <p>No role assigned.</p>;
    }
  };

  return (
    <div className="min-h-screen animated-gradient p-8 relative overflow-hidden text-white flex flex-col">
      <div className="background-icons">{/* Background icons can be added here if needed */}</div>
      <div className="relative z-10 flex flex-col flex-grow">
        <header className="flex-shrink-0 flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-sans">
            Welcome, {user.name}!
          </h1>
          <div className="relative">
            <button onClick={() => setShowUserInfo(!showUserInfo)}>
              <FaUserCircle size={40} className="cursor-pointer hover:opacity-80 transition" />
            </button>
            {showUserInfo && (
              <div className="absolute top-14 right-0 w-64 backdrop-blur-xl bg-black/30 border border-white/10 rounded-2xl p-4 shadow-lg animate-fade-in-down">
                <h3 className="font-semibold text-lg border-b border-white/20 pb-2 mb-2">
                  {user.name}
                </h3>
                <p className="text-sm">Role: <span className="font-semibold capitalize">{user.role}</span></p>
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600/50 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center pb-24">
          {user.role === 'admin' && stats ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl w-full">
              <div className="flex flex-col gap-10">
                <DashboardCard
                  icon={<FaTasks size={48} className="mb-4 text-purple-400" />}
                  title="Manage All Complaints"
                  description="View, assign, and oversee all submitted complaints."
                  onClick={() => navigate("/complaints")}
                />
                <DashboardCard
                  icon={<FaUsersCog size={48} className="mb-4 text-blue-400" />}
                  title="Manage Staff"
                  description="Add, remove, and manage technical staff."
                  onClick={() => navigate("/manage-staff")}
                />
              </div>
              <div className="relative backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold mb-4">Complaint Overview</h2>
                <div className="w-full max-w-sm">
                   <Doughnut data={chartData} options={chartOptions} />
                </div>
                <p className="mt-4 text-2xl font-bold">Total Complaints: {stats.total}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full">
              {renderDashboardCards()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;

