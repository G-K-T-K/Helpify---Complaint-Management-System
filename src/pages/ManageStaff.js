import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaUserPlus, FaEdit, FaTrash, FaTimes, FaSave } from 'react-icons/fa';

// --- Reusable Edit Modal ---
const EditStaffModal = ({ staff, onClose, onSave }) => {
  const [formData, setFormData] = useState(staff);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative bg-black/50 border border-white/20 rounded-3xl max-w-lg w-full p-8 animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition"><FaTimes size={24} /></button>
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Edit Staff Member</h2>
        <div className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white" />
          {/* Staff ID field is usually not editable, or less frequently */}
          <input type="text" name="staffId" value={formData.staffId} onChange={handleChange} placeholder="Staff ID" className="w-full p-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white" />
          <select name="role" value={formData.role} onChange={handleChange} className="w-full p-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white">
            <option value="" className="text-gray-400 bg-black">Select Role...</option>
            <option value="Electrician" className="text-white bg-gray-800">Electrician</option>
            <option value="Plumber" className="text-white bg-gray-800">Plumber</option>
            <option value="Cleaner" className="text-white bg-gray-800">Cleaner</option>
            <option value="Admin" className="text-white bg-gray-800">Admin</option> {/* Added admin role for staff, if applicable */}
          </select>
        </div>
        <button onClick={handleSave} className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 font-semibold py-3 rounded-lg shadow-lg hover:scale-105 transform transition flex items-center justify-center gap-2 text-white">
            <FaSave /> Save Changes
        </button>
      </div>
    </div>
  );
};


// --- Main Page Component ---
const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', staffId: '', role: '' });
  const [editingStaff, setEditingStaff] = useState(null);
  const navigate = useNavigate();

  // Fetch all staff
  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('http://localhost:5000/api/admin/staff', config);
      setStaffList(res.data);
    } catch (err) {
      toast.error('Could not fetch staff data. You may not have admin access.');
      navigate('/home'); // Redirect if not authorized
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle adding new staff
  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.staffId || !formData.role) {
      toast.error('Please fill all fields.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.post('http://localhost:5000/api/admin/staff', formData, config);
      setStaffList([...staffList, res.data]);
      setFormData({ name: '', email: '', password: '', staffId: '', role: '' }); // Clear form
      toast.success('Staff member added successfully!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to add staff member.');
    }
  };
  
  // Handle updating staff
  const handleUpdateStaff = async (updatedStaff) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.put(`http://localhost:5000/api/admin/staff/${updatedStaff._id}`, updatedStaff, config);
      setStaffList(staffList.map(staff => staff._id === updatedStaff._id ? res.data : staff));
      setEditingStaff(null);
      toast.success('Staff details updated!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update staff.');
    }
  };

  // Handle deleting staff
  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        await axios.delete(`http://localhost:5000/api/admin/staff/${staffId}`, config);
        setStaffList(staffList.filter(staff => staff._id !== staffId));
        toast.success('Staff member deleted.');
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Failed to delete staff member.');
      }
    }
  };

  return (
    <div className="min-h-screen animated-gradient p-8 relative overflow-hidden text-white">
      <div className="flex items-center mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lg hover:opacity-80 transition"
        >
          <FaArrowLeft />
          Back
        </button>
        <h1 className="text-4xl font-bold text-center flex-1">Manage Staff</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"> {/* Adjusted grid layout */}
        {/* --- ADD STAFF FORM --- */}
        <div className="lg:col-span-1">
          <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-white">Add New Staff</h2> {/* Added text-white */}
            <form onSubmit={handleAddStaff} className="space-y-5"> {/* Increased spacing */}
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full p-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-400" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-400" />
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full p-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-400" />
              <input type="text" name="staffId" value={formData.staffId} onChange={handleChange} placeholder="Staff ID" required className="w-full p-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-400" />
              <select name="role" value={formData.role} onChange={handleChange} required className="w-full p-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white">
                <option value="" className="text-gray-400 bg-black">Select Role...</option> {/* Improved placeholder styling */}
                <option value="Electrician" className="text-white bg-gray-800">Electrician</option>
                <option value="Plumber" className="text-white bg-gray-800">Plumber</option>
                <option value="Cleaner" className="text-white bg-gray-800">Cleaner</option>
                <option value="Admin" className="text-white bg-gray-800">Admin</option> {/* Added admin role option */}
              </select>
              <button type="submit" className="w-full mt-6 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:scale-105 transform transition flex items-center justify-center gap-2">
                <FaUserPlus /> Add Staff Member
              </button>
            </form>
          </div>
        </div>

        {/* --- STAFF LIST TABLE --- */}
        <div className="lg:col-span-2">
          <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg min-h-[400px]"> {/* Added min-h */}
            <h2 className="text-2xl font-bold mb-6 text-white">Current Staff</h2> {/* Added text-white */}
            {loading ? (
              <p className="text-center text-xl text-gray-300">Loading staff...</p>
            ) : staffList.length === 0 ? (
              <p className="text-center text-xl text-gray-300">No staff members found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/20 text-gray-300 uppercase text-sm">
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Role</th>
                      <th className="p-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map(staff => (
                      <tr key={staff._id} className="border-b border-white/10 hover:bg-white/5 text-gray-100 font-medium">
                        <td className="p-4">{staff.name}</td>
                        <td className="p-4">{staff.email}</td>
                        <td className="p-4">{staff.role}</td>
                        <td className="p-4 flex justify-center gap-3"> {/* Increased gap for buttons */}
                          <button onClick={() => setEditingStaff(staff)} className="bg-blue-600/50 hover:bg-blue-600 text-white p-2 rounded-lg transition"><FaEdit /></button>
                          <button onClick={() => handleDeleteStaff(staff._id)} className="bg-red-600/50 hover:bg-red-600 text-white p-2 rounded-lg transition"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {editingStaff && <EditStaffModal staff={editingStaff} onClose={() => setEditingStaff(null)} onSave={handleUpdateStaff} />}
    </div>
  );
};

export default ManageStaff;
