import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaArrowLeft,
  FaSync,
  FaCheckCircle,
  FaSpinner,
  FaExclamationCircle,
  FaTimes,
} from 'react-icons/fa';

// --- Reusable Complaint Card Component ---
const ComplaintCard = ({ complaint, onViewDetails }) => (
  <div
    onClick={() => onViewDetails(complaint)}
    className="relative group backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl overflow-hidden shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform duration-300"
  >
    <div className="absolute top-4 right-4 z-10">
      <span
        className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${
          {
            Submitted: 'bg-yellow-500/80',
            'In Progress': 'bg-blue-500/80',
            Resolved: 'bg-green-500/80',
          }[complaint.status]
        }`}
      >
        {complaint.status}
      </span>
    </div>
    <img
      src={`data:${complaint.image.contentType};base64,${complaint.image.data}`}
      alt={complaint.category}
      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
    />
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2">{complaint.category}</h3>
      <p className="text-gray-300 text-sm mb-4 h-20 overflow-y-auto">{complaint.description}</p>
      <p className="text-xs text-gray-400">
        Submitted on: {new Date(complaint.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
);

// --- New Status Tracker Component ---
const ComplaintStatusTracker = ({ status, createdAt, updatedAt }) => {
  const statuses = ['Submitted', 'In Progress', 'Resolved'];
  const currentStatusIndex = statuses.indexOf(status);

  const getStepClass = (stepIndex) => {
    if (stepIndex < currentStatusIndex) return 'text-green-400';
    if (stepIndex === currentStatusIndex) return 'text-purple-400 animate-pulse';
    return 'text-gray-500';
  };

  const getIcon = (stepIndex) => {
    if (stepIndex < currentStatusIndex) return <FaCheckCircle />;
    if (stepIndex === currentStatusIndex) return <FaSpinner className="animate-spin" />;
    return <FaExclamationCircle />;
  };

  return (
    <div className="w-full mt-6">
      <h4 className="font-semibold mb-4 text-center">Complaint Timeline</h4>
      <div className="flex justify-between items-center">
        {statuses.map((step, index) => (
          <React.Fragment key={step}>
            <div className={`flex flex-col items-center ${getStepClass(index)}`}>
              <div className="text-3xl mb-2">{getIcon(index)}</div>
              <span className="text-sm font-semibold">{step}</span>
              <span className="text-xs">
                {index === 0 ? new Date(createdAt).toLocaleDateString() : ''}
                {index === 2 && currentStatusIndex === 2 ? new Date(updatedAt).toLocaleDateString() : ''}
              </span>
            </div>
            {index < statuses.length - 1 && (
              <div className={`flex-1 h-1 mx-4 rounded ${index < currentStatusIndex ? 'bg-green-400' : 'bg-gray-700'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// --- New Complaint Detail Modal ---
const ComplaintDetailModal = ({ complaint, onClose }) => {
  if (!complaint) return null;
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-black/50 border border-white/20 rounded-3xl max-w-2xl w-full p-8 animate-fade-in-down"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <FaTimes size={24} />
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={`data:${complaint.image.contentType};base64,${complaint.image.data}`}
            alt="Complaint"
            className="w-full md:w-1/2 h-auto rounded-2xl object-cover"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{complaint.category}</h2>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${
                {
                  Submitted: 'bg-yellow-500/80',
                  'In Progress': 'bg-blue-500/80',
                  Resolved: 'bg-green-500/80',
                }[complaint.status]
              }`}
            >
              {complaint.status}
            </span>
            <p className="text-gray-300 mt-4">{complaint.description}</p>
          </div>
        </div>
        <ComplaintStatusTracker
          status={complaint.status}
          createdAt={complaint.createdAt}
          updatedAt={complaint.updatedAt || new Date()} // Use updatedAt if available
        />
      </div>
    </div>
  );
};


// --- Main Page Component ---
const TrackComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const navigate = useNavigate();

  // --- THIS IS THE COMPLETE, CORRECT FETCH FUNCTION ---
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.get('http://localhost:5000/api/complaints/my-complaints', config);
      setComplaints(res.data);
    } catch (err) {
      toast.error('Could not fetch complaints. Please try again.');
      console.error(err);
    } finally {
      setLoading(false); // This line ensures loading stops
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen animated-gradient p-8 relative overflow-hidden text-white">
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lg hover:opacity-80 transition"
        >
          <FaArrowLeft />
          Back
        </button>
        <h1 className="text-4xl font-bold text-center">Track My Complaints</h1>
        <button
          onClick={fetchComplaints}
          className="p-2 rounded-full hover:bg-white/10 transition"
          disabled={loading}
          aria-label="Refresh complaints"
        >
          <FaSync className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="relative z-10">
        {loading ? (
          <p className="text-center text-xl">Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <div className="text-center bg-black/30 p-10 rounded-2xl max-w-md mx-auto">
            <h2 className="text-2xl font-semibold">No Complaints Found</h2>
            <p className="text-gray-400 mt-2">You haven't submitted any complaints yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onViewDetails={setSelectedComplaint}
              />
            ))}
          </div>
        )}
      </div>

      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
};

export default TrackComplaints;