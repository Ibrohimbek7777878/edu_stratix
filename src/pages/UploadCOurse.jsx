import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { showSuccessAlert, showErrorAlert } from '../utils/customAlert';

const UploadCourse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', 
        description: '', 
        price: '', 
        category: 'it', 
        thumbnail: null
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData({ ...formData, thumbnail: e.target.files[0] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);

        if (formData.thumbnail) {
            data.append('thumbnail', formData.thumbnail);
        }

        try {
            await api.post('/courses/', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            showSuccessAlert("Ajoyib!", "Yangi kurs muvaffaqiyatli yaratildi 🎉");
            navigate('/teacher-dashboard');
        } catch (error) {
            showErrorAlert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] pb-20">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-white">Yangi kurs yaratish</h1>
                    <p className="text-gray-400 mt-2">Kurs ma'lumotlarini to'ldiring va talabalarga ulashing.</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl bg-white/5 border border-white/10 shadow-2xl space-y-6">
                    {/* Sarlavha */}
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Kurs nomi</label>
                        <input 
                            required 
                            type="text" 
                            name="title" 
                            onChange={handleChange} 
                            className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 transition placeholder:text-gray-600" 
                            placeholder="Masalan: Python asoslari" 
                        />
                    </div>

                    {/* Tavsif */}
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Kurs haqida batafsil</label>
                        <textarea 
                            required 
                            name="description" 
                            onChange={handleChange} 
                            rows="4" 
                            className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 transition placeholder:text-gray-600" 
                            placeholder="Talabalar bu kursda nimalarni o'rganishadi?"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Narxi */}
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Narxi (UZS)</label>
                            <input 
                                required 
                                type="number" 
                                name="price" 
                                onChange={handleChange} 
                                className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 transition placeholder:text-gray-600" 
                                placeholder="150 000" 
                            />
                        </div>

                        {/* Kategoriya */}
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Kategoriya</label>
                            <select 
                                name="category" 
                                onChange={handleChange} 
                                className="w-full rounded-xl px-4 py-3 bg-[#1e293b] border border-white/10 text-white outline-none focus:border-blue-500 transition cursor-pointer"
                            >
                                <option value="it">IT & Dasturlash</option>
                                <option value="design">Grafik Dizayn</option>
                                <option value="marketing">Marketing</option>
                                <option value="business">Biznes</option>
                                <option value="cooking">Pazandachilik</option>
                                <option value="other">Boshqa</option>
                            </select>
                        </div>
                    </div>

                    {/* Rasm yuklash */}
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Kurs muqovasi (Thumbnail)</label>
                        <div className="relative border-2 border-dashed border-white/10 rounded-xl p-4 hover:border-blue-500/50 transition bg-white/5 text-center">
                            <input 
                                type="file" 
                                onChange={handleFileChange} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                accept="image/*" 
                            />
                            <div className="text-gray-400">
                                {formData.thumbnail ? (
                                    <span className="text-blue-400 font-bold">{formData.thumbnail.name}</span>
                                ) : (
                                    "Rasm tanlash uchun bosing yoki sudrab olib keling"
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Tugmasi */}
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg ${
                            loading 
                            ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                        }`}
                    >
                        {loading ? 'Yaratilmoqda...' : 'Kursni yaratish'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadCourse;