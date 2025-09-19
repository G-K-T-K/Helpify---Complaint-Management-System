import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- IMPORTS FOR TOAST NOTIFICATIONS ---
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- YOUR PAGE COMPONENTS ---
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackComplaints from './pages/TrackComplaints';
import ManageComplaints from './pages/ManageComplaints';
import ManageStaff from './pages/ManageStaff';
import AssignedComplaints from './pages/AssignedComplaints'; // 1. IMPORT the new staff page component

function App() {
  return (
    <Router>
      {/* This component renders all your pages */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        
        {/* Student Routes */}
        <Route path="/submit-complaint" element={<SubmitComplaint />} />
        <Route path="/track" element={<TrackComplaints />} />
        
        {/* Admin Routes */}
        <Route path="/complaints" element={<ManageComplaints />} />
        <Route path="/manage-staff" element={<ManageStaff />} />
        
        {/* Staff Routes */}
        <Route path="/assigned-complaints" element={<AssignedComplaints />} /> {/* 2. ADD the new route for staff */}
      </Routes>

      {/* --- KEPT THIS COMPONENT FOR SENSATIONAL NOTIFICATIONS --- */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;
