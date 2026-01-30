import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filterlash uchun statelar
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    // Backenddan filter bilan olish
    const fetchCourses = async () => {
        setLoading(true);
        try {
            // URL params yasadik: /courses/?search=react&category=it
            const res = await api.get(`/courses/?search=${search}&category=${category}`);
            setCourses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Search yoki Category o'zgarganda qayta yuklaymiz
    useEffect(() => {
        // Debounce (har harf yozganda so'rov ketmasligi uchun 500ms kutamiz)
        const timeout = setTimeout(() => {
            fetchCourses();
        }, 500);
        return () => clearTimeout(timeout);
    }, [search, category]);

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `http://127.0.0.1:8000${url}`;
    };

    return (
        <div className="min-h-screen font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-12">
                
                {/* --- HEADER & FILTERS --- */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-white drop-shadow-md">All Courses</h1>
                    
                    <div className="flex gap-4 w-full md:w-auto">
                        {/* Kategoriya */}
                        <select 
                            onChange={(e) => setCategory(e.target.value)}
                            className="glass-panel px-4 py-2 rounded-lg outline-none text-gray-300"
                        >
                            <option value="">All Categories</option>
                            <option value="it">IT & Programming</option>
                            <option value="design">Design</option>
                            <option value="marketing">Marketing</option>
                            <option value="business">Business</option>
                        </select>

                        {/* Qidiruv */}
                        <input 
                            type="text" 
                            placeholder="Search courses..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="glass-panel px-4 py-2 rounded-lg outline-none w-full md:w-64 placeholder-gray-400 text-white"
                        />
                    </div>
                </div>
                
                {/* --- COURSE LIST --- */}
                {loading ? <p className="text-white text-center">Yuklanmoqda...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {courses.length > 0 ? courses.map(course => (
                            <Link to={`/course/${course.id}`} key={course.id} className="glass-panel p-4 rounded-2xl hover:bg-white/10 transition group block">
                                <div className="h-48 rounded-xl mb-4 overflow-hidden relative bg-black/30">
                                    {course.thumbnail ? (
                                        <img src={getImageUrl(course.thumbnail)} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">Rasm yo'q</div>
                                    )}
                                </div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-bold px-2 py-1 rounded uppercase">{course.category}</span>
                                    <span className="font-bold text-blue-400">{parseFloat(course.price).toLocaleString()} UZS</span>
                                </div>
                                <h3 className="font-bold text-lg text-white mb-1">{course.title}</h3>
                                <p className="text-sm text-gray-400">
                                    By: {course.teacher ? course.teacher.first_name : 'Unknown'}
                                </p>
                            </Link>
                        )) : (
                            <div className="col-span-3 text-center py-20">
                                <p className="text-gray-400 text-xl">So'rovingiz bo'yicha kurslar topilmadi 😔</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Courses;