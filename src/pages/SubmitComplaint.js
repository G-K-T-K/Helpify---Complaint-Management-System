import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPaperPlane, FaArrowLeft, FaCamera } from 'react-icons/fa';

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  const { category, description } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !description || !image) {
      return toast.warn('Please fill out all fields and upload an image.');
    }

    const complaintData = new FormData();
    complaintData.append('category', category);
    complaintData.append('description', description);
    complaintData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      };

      await axios.post('http://localhost:5000/api/complaints', complaintData, config);
      
      toast.success('Complaint submitted successfully!');
      navigate('/home');
    } catch (err) {
      console.error(err.response.data);
      toast.error('Failed to submit complaint. Please try again.');
    }
  };

  return (
    <div className="min-h-screen animated-gradient p-8 relative overflow-hidden text-white">
      {/* --- THIS BUTTON IS NOW CORRECTED --- */}
      <div className="absolute top-8 left-8">
        <button
          onClick={() => navigate(-1)} // Takes user to the previous page
          className="flex items-center gap-2 text-lg hover:opacity-80 transition"
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full pt-10">
        <div className="relative w-full max-w-2xl">
          <div className="absolute -inset-1 rounded-3xl opacity-75 animate-pulse neon-glow"></div>
          <div className="relative backdrop-blur-xl bg-black/30 border border-white/10 shadow-2xl rounded-3xl p-8">
            <h2 className="text-4xl font-bold text-center mb-8 font-sans">
              Submit a Complaint
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-white mb-2 text-sm">Category</label>
                <select name="category" value={category} onChange={handleChange} className="w-full pl-4 pr-10 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 appearance-none">
                  <option value="" disabled className="text-gray-500">Select a category...</option>
                  <option value="Electrical" className="text-black">Electrical</option>
                  <option value="Plumbing" className="text-black">Plumbing</option>
                  <option value="Cleanliness" className="text-black">Cleanliness</option>
                  <option value="Other" className="text-black">Other</option>
                </select>
              </div>
              {/* Description */}
              <div>
                <label className="block text-white mb-2 text-sm">Description of Issue</label>
                <textarea name="description" value={description} onChange={handleChange} className="w-full pl-4 pr-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300" placeholder="Please describe the issue in detail..." rows="5"></textarea>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-white mb-2 text-sm">Upload Photo</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300/50 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Complaint Preview" className="mx-auto h-40 w-auto rounded-lg object-cover" />
                    ) : (
                      <FaCamera className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex justify-center text-sm text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-black/30 rounded-md font-medium text-purple-400 hover:text-purple-300 px-3 py-1">
                        <span>Upload a file</span>
                        <input id="file-upload" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" required />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">A photo is required (PNG, JPG, JPEG)</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 font-semibold py-3 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
                <FaPaperPlane />
                Submit Complaint
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;