import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', phone: '', bio: '', avatar: null, role: '', username: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile/');
        setFormData(response.data);
      } catch (error) {
        console.error("Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.patch('/users/profile/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        bio: formData.bio
      });
      alert("Ma'lumotlar saqlandi! ✅");
    } catch (error) {
      alert("Xatolik yuz berdi ❌");
    }
  };

  if (loading) return <div className="text-center text-white py-20">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* TABS */}
        <div className="glass-panel rounded-xl p-1 inline-flex mb-8">
            {['account', 'statistics', 'security'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition ${activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                    {tab}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* CHAP TOMON: Karta */}
            <div className="md:col-span-1">
                <div className="glass-panel p-6 rounded-2xl text-center sticky top-24">
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                        {formData.avatar ? (
                            <img src={formData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-blue-500/50 shadow-md" />
                        ) : (
                            <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-blue-400">
                                {formData.username ? formData.username[0].toUpperCase() : 'U'}
                            </div>
                        )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-white">
                        {formData.first_name} {formData.last_name}
                    </h2>
                    <p className="text-blue-300 text-sm mb-2">@{formData.username}</p>
                    <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase border border-blue-500/30">
                        {formData.role}
                    </span>
                </div>
            </div>

            {/* O'NG TOMON */}
            <div className="md:col-span-2">
                
                {/* ACCOUNT TAB */}
                {activeTab === 'account' && (
                    <div className="glass-panel p-8 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">First Name</label>
                                <input type="text" name="first_name" value={formData.first_name || ''} onChange={handleChange} className="w-full rounded-lg px-4 py-2 glass-input" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Last Name</label>
                                <input type="text" name="last_name" value={formData.last_name || ''} onChange={handleChange} className="w-full rounded-lg px-4 py-2 glass-input" />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone Number</label>
                            <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full rounded-lg px-4 py-2 glass-input" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Bio</label>
                            <textarea rows="3" name="bio" value={formData.bio || ''} onChange={handleChange} className="w-full rounded-lg px-4 py-2 glass-input"></textarea>
                        </div>
                        <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg">
                            Save Changes
                        </button>
                    </div>
                )}

                {/* STATISTICS TAB */}
                {activeTab === 'statistics' && (
                    <div className="glass-panel p-8 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-6">Your Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-600/10 rounded-xl border border-blue-500/30">
                                <h4 className="text-2xl font-bold text-blue-400">5</h4>
                                <p className="text-gray-400 text-sm">Courses</p>
                            </div>
                            <div className="p-4 bg-green-600/10 rounded-xl border border-green-500/30">
                                <h4 className="text-2xl font-bold text-green-400">3</h4>
                                <p className="text-gray-400 text-sm">Completed</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === 'security' && (
                    <div className="glass-panel p-8 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-6">Security Settings</h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">New Password</label>
                                <input type="password" placeholder="Enter new password" className="w-full rounded-lg px-4 py-2 glass-input" />
                            </div>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                                Update Password
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;