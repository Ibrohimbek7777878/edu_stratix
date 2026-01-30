import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/Navbar';

const AddLesson = () => {
  const { id } = useParams(); // Kurs ID
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    video_file: null
  });

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validatsiya
    if (!formData.title || !formData.duration || !formData.video_file) {
        alert("Barcha maydonlarni to'ldiring!");
        setLoading(false);
        return;
    }

 const data = new FormData();
    data.append('title', formData.title);
    data.append('duration', formData.duration);
    data.append('video_file', formData.video_file);

    try {
      // O'ZGARISH: Headersni aniq ko'rsatamiz
      await api.post(`/courses/${id}/lessons/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert("Video muvaffaqiyatli qo'shildi! 🎥");
      navigate('/teacher-dashboard');
    } catch (error) {
      console.error("Xatolik:", error);
      // Xatoni aniq ko'rsatish
      if (error.response && error.response.data) {
          alert("Xatolik: " + JSON.stringify(error.response.data));
      } else {
          alert("Kutilmagan xatolik yuz berdi.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Add Video Lesson</h1>
        
        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl space-y-6">
            <div>
                <label className="text-gray-300 block mb-2 text-sm font-bold">Lesson Title</label>
                <input required type="text" onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full rounded-lg px-4 py-3 glass-input" placeholder="e.g. Introduction to React" />
            </div>

            <div>
                <label className="text-gray-300 block mb-2 text-sm font-bold">Duration (Ex: 10:05)</label>
                <input required type="text" onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full rounded-lg px-4 py-3 glass-input" placeholder="10:00" />
            </div>

            <div>
                <label className="text-gray-300 block mb-2 text-sm font-bold">Video File (MP4)</label>
                <input required type="file" accept="video/*" onChange={(e) => setFormData({...formData, video_file: e.target.files[0]})} className="w-full rounded-lg p-2 glass-input" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-500 transition shadow-lg">
                {loading ? 'Uploading...' : 'Upload Video'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AddLesson;