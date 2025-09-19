import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaEye, FaTimes, FaUserPlus } from 'react-icons/fa';

// --- Reusable Modal for Viewing Details ---
const ComplaintDetailModal = ({ complaint, onClose }) => {
  if (!complaint) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative bg-black/50 border border-white/20 rounded-3xl max-w-4xl w-full p-8 animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition"><FaTimes size={24} /></button>
        <h2 className="text-3xl font-bold mb-6 text-center">Complaint Details</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={`data:${complaint.image.contentType};base64,${complaint.image.data}`}
            alt="Complaint"
            className="w-full md:w-1/2 h-auto rounded-2xl object-cover"
          />
          <div className="flex-1 text-lg">
            <p className="mb-2"><strong className="text-purple-400">Student:</strong> {complaint.student.name}</p>
            <p className="mb-2"><strong className="text-purple-400">Roll No:</strong> {complaint.student.rollNumber}</p>
            <p className="mb-2"><strong className="text-purple-400">Category:</strong> {complaint.category}</p>
            <p className="mb-2"><strong className="text-purple-400">Status:</strong> {complaint.status}</p>
            <p className="mb-2"><strong className="text-purple-400">Submitted:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
            <p className="mt-4"><strong className="text-purple-400">Description:</strong></p>
            <p className="text-gray-300 bg-black/30 p-3 rounded-lg">{complaint.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Modal for Assigning Staff ---
const AssignComplaintModal = ({ complaint, allStaff, onClose, onAssign }) => {
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const categoryToRole = {
    'Electrical': 'Electrician',
    'Plumbing': 'Plumber',
    'Cleanliness': 'Cleaner',
  };
  const relevantRole = categoryToRole[complaint.category] || null;
  const filteredStaff = relevantRole
    ? allStaff.filter(staff => staff.role === relevantRole)
    : allStaff;
  const handleAssign = () => {
    if (!selectedStaffId) {
      return toast.warn('Please select a staff member.');
    }
    onAssign(complaint.id, selectedStaffId);
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative bg-black/50 border border-white/20 rounded-3xl max-w-lg w-full p-8 animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition"><FaTimes size={24} /></button>
        <h2 className="text-3xl font-bold mb-6 text-center">Assign Complaint</h2>
        <p className="mb-2"><strong className="text-purple-400">Category:</strong> {complaint.category}</p>
        <p className="text-gray-300 bg-black/30 p-3 rounded-lg mb-4">{complaint.description}</p>
        <label htmlFor="staff-select" className="block text-white mb-2 text-sm">Select Staff Member</label>
        <select
          id="staff-select"
          value={selectedStaffId}
          onChange={(e) => setSelectedStaffId(e.target.value)}
          className="w-full pl-4 pr-10 py-3 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="" disabled>
            {filteredStaff.length > 0 ? `Select from ${filteredStaff.length} available staff...` : 'No relevant staff found'}
          </option>
          {filteredStaff.map(staff => (
            <option key={staff._id} value={staff._id} className="text-black">{staff.name} ({staff.role})</option>
          ))}
        </select>
        <button onClick={handleAssign} className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 font-semibold py-3 ...">
          Confirm Assignment
        </button>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignModalComplaint, setAssignModalComplaint] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        const [complaintsRes, staffRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/complaints', config),
          axios.get('http://localhost:5000/api/admin/staff', config)
        ]);
        setComplaints(complaintsRes.data);
        setAllStaff(staffRes.data);
      } catch (err) {
        toast.error('Could not fetch data. You may not have admin access.');
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleAssignComplaint = async (complaintId, staffId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.put(`http://localhost:5000/api/admin/complaints/${complaintId}/assign`, { staffId }, config);
      const updatedComplaint = res.data;
      setComplaints(complaints.map(c => c.id === complaintId 
        ? { ...c, status: updatedComplaint.status, assignedStaff: updatedComplaint.assignedStaffId } 
        : c));
      toast.success(`Complaint assigned to ${updatedComplaint.assignedStaffId.name}`);
      setAssignModalComplaint(null);
    } catch (err) {
      toast.error('Failed to assign complaint.');
    }
  };

  return (
    <div className="min-h-screen animated-gradient p-8 relative overflow-hidden text-white">
      <div className="flex items-center mb-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-lg hover:opacity-80 transition">
          <FaArrowLeft />
          Back
        </button>
        <h1 className="text-4xl font-bold text-center flex-1">Manage All Complaints</h1>
      </div>

      <div className="relative z-10 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                {/* --- THIS IS THE FIRST FIX --- */}
                <tr className="border-b border-white/20 text-gray-300 uppercase text-sm">
                  <th className="p-4 font-semibold">Student Name</th>
                  <th className="p-4 font-semibold">Roll Number</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Submitted On</th>
                  <th className="p-4 font-semibold">Assigned To</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  // --- THIS IS THE SECOND FIX ---
                  <tr key={complaint.id} className="border-b border-white/10 hover:bg-white/5 text-gray-100 font-medium">
                    <td className="p-4">{complaint.student.name}</td>
                    <td className="p-4">{complaint.student.rollNumber}</td>
                    <td className="p-4">{complaint.category}</td>
                    <td className="p-4">{complaint.status}</td>
                    <td className="p-4">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">{complaint.assignedStaff ? complaint.assignedStaff.name : 'Unassigned'}</td>
                    <td className="p-4 text-center flex justify-center gap-2">
                      <button onClick={() => setSelectedComplaint(complaint)} className="bg-purple-600/50 hover:bg-purple-600 text-white p-2 rounded-lg transition"><FaEye /></button>
                      {complaint.status === 'Submitted' && (
                        <button onClick={() => setAssignModalComplaint(complaint)} className="bg-green-600/50 hover:bg-green-600 text-white p-2 rounded-lg transition"><FaUserPlus /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedComplaint && <ComplaintDetailModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />}
      {assignModalComplaint && <AssignComplaintModal complaint={assignModalComplaint} allStaff={allStaff} onClose={() => setAssignModalComplaint(null)} onAssign={handleAssignComplaint} />}
    </div>
  );
};

export default ManageComplaints;