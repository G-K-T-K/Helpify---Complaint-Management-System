import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCheckCircle, FaTimes, FaSync, FaHistory, FaTasks } from 'react-icons/fa';

// --- Reusable Modal for Updating Status ---
const UpdateStatusModal = ({ complaint, onClose, onUpdate }) => {
  const [remarks, setRemarks] = useState('');

  const handleUpdate = () => {
    if (!remarks) {
      return toast.warn('Please add remarks before resolving the complaint.');
    }
    onUpdate(complaint.id, { status: 'Resolved', remarks });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative bg-black/50 border border-white/20 rounded-3xl max-w-lg w-full p-8 animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition"><FaTimes size={24} /></button>
        <h2 className="text-3xl font-bold mb-6 text-center">Resolve Complaint</h2>
        <p className="mb-2"><strong className="text-purple-400">Category:</strong> {complaint.category}</p>
        <p className="text-gray-300 bg-black/30 p-3 rounded-lg mb-4">{complaint.description}</p>
        
        <label htmlFor="remarks" className="block text-white mb-2 text-sm">Add Completion Remarks</label>
        <textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="e.g., 'Replaced faulty tube light in Room 201.'"
          rows="4"
          className="w-full p-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
        />

        <button
          onClick={handleUpdate}
          className="w-full mt-6 bg-gradient-to-r from-green-500 to-teal-500 font-semibold py-3 rounded-lg shadow-lg hover:scale-105 transform transition flex items-center justify-center gap-2"
        >
          <FaCheckCircle /> Mark as Resolved
        </button>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const AssignedComplaints = () => {
  const [activeComplaints, setActiveComplaints] = useState([]);
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'resolved'
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      
      // Fetch both active and resolved complaints at the same time
      const [activeRes, resolvedRes] = await Promise.all([
        axios.get('http://localhost:5000/api/staff/complaints/active', config),
        axios.get('http://localhost:5000/api/staff/complaints/resolved', config)
      ]);

      setActiveComplaints(activeRes.data);
      setResolvedComplaints(resolvedRes.data);
    } catch (err) {
      toast.error('Could not fetch your assigned complaints.');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (complaintId, { status, remarks }) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const body = { status, remarks };
      const res = await axios.put(`http://localhost:5000/api/staff/complaints/${complaintId}/status`, body, config);
      
      const updatedComplaint = res.data;

      // Move the complaint from the active list to the resolved list in the UI
      setActiveComplaints(activeComplaints.filter(c => c.id !== complaintId));
      setResolvedComplaints([updatedComplaint, ...resolvedComplaints]);
      
      setSelectedComplaint(null);
      toast.success('Complaint resolved successfully!');
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="min-h-screen animated-gradient p-8 relative overflow-hidden text-white flex flex-col">
      <header className="flex justify-between items-center mb-10 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lg hover:opacity-80 transition"
        >
          <FaArrowLeft />
          Back
        </button>
        <h1 className="text-4xl font-bold text-center">My Complaints</h1>
        <button
          onClick={fetchData}
          className="p-2 rounded-full hover:bg-white/10 transition"
          disabled={loading}
          aria-label="Refresh complaints"
        >
          <FaSync className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      {/* --- TAB INTERFACE --- */}
      <div className="w-full flex justify-center mb-8">
        <div className="bg-black/30 p-2 rounded-xl flex gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${activeTab === 'active' ? 'bg-purple-600' : 'hover:bg-white/10'}`}
          >
            <FaTasks /> Active Tasks ({activeComplaints.length})
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${activeTab === 'resolved' ? 'bg-purple-600' : 'hover:bg-white/10'}`}
          >
            <FaHistory /> Completed History ({resolvedComplaints.length})
          </button>
        </div>
      </div>
      
      <main className="relative z-10 flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-full"><p className="text-xl">Loading...</p></div>
        ) : (
          activeTab === 'active' ? (
            activeComplaints.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-center bg-black/30 p-10 rounded-2xl max-w-md mx-auto">
                  <h2 className="text-2xl font-semibold">All Clear!</h2>
                  <p className="text-gray-400 mt-2">You have no pending complaints.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeComplaints.map(complaint => (
                  <div key={complaint.id} className="relative group backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl overflow-hidden shadow-lg flex flex-col">
                    <img src={`data:${complaint.image.contentType};base64,${complaint.image.data}`} alt={complaint.category} className="w-full h-48 object-cover" />
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-2">{complaint.category}</h3>
                      <p className="text-sm text-gray-400">From: {complaint.student.name} ({complaint.student.rollNumber})</p>
                      <p className="text-gray-300 my-4 flex-grow">{complaint.description}</p>
                      <button onClick={() => setSelectedComplaint(complaint)} className="w-full mt-auto bg-green-600/50 hover:bg-green-600 font-semibold py-2 rounded-lg transition">Resolve</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            resolvedComplaints.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-center bg-black/30 p-10 rounded-2xl max-w-md mx-auto">
                  <h2 className="text-2xl font-semibold">No History</h2>
                  <p className="text-gray-400 mt-2">You haven't resolved any complaints yet.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resolvedComplaints.map(complaint => (
                  <div key={complaint.id} className="relative group backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl overflow-hidden shadow-lg flex flex-col opacity-70">
                    <img src={`data:${complaint.image.contentType};base64,${complaint.image.data}`} alt={complaint.category} className="w-full h-48 object-cover" />
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-2">{complaint.category}</h3>
                      <p className="text-sm text-gray-400">From: {complaint.student.name}</p>
                      <p className="text-gray-300 my-2 text-sm">Description: {complaint.description}</p>
                      <p className="text-green-400 text-sm bg-green-900/50 p-2 rounded-lg mt-auto">Resolved on: {new Date(complaint.updatedAt).toLocaleDateString()}</p>
                      <p className="text-gray-300 mt-2 text-sm">Remarks: {complaint.remarks}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )
        )}
      </main>
      
      {selectedComplaint && <UpdateStatusModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} onUpdate={handleUpdateStatus} />}
    </div>
  );
};

export default AssignedComplaints;