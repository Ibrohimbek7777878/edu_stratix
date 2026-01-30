import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { confirmAction } from '../utils/customAlert';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate qo'shildi

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('Student');
  const navigate = useNavigate(); // Hookni chaqirib qo'yamiz

  useEffect(() => {
    // 1. Tokendan usernameni olish
    const token = localStorage.getItem('access_token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUsername(payload.username || 'Student');
        } catch (e) {
            console.error("Token xatosi", e);
        }
    }

    // 2. Kurslarni va Balansni tekshirish funksiyalari
    const fetchData = async () => {
      try {
        // Kurslarni yuklash
        const res = await api.get('/courses/my-enrollments/');
        setEnrollments(res.data);

        // Balansni tekshirish va taklif qilish
        const payRes = await api.get('/payments/');
        const balance = parseFloat(payRes.data.balance);
        
        if (balance === 0 && !sessionStorage.getItem('walletPromptShown')) {
            sessionStorage.setItem('walletPromptShown', 'true');
            
            const wantTopUp = await confirmAction(
                "Xush kelibsiz! 👋", 
                "Kurslarni sotib olish uchun hisobingizni to'ldirishingiz kerak. Hozir Hamyonga o'tamizmi?",
                "Ha, To'ldirish"
            );

            if (wantTopUp) {
                navigate('/wallet');
            }
        }
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xato:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]); // useEffect to'g'ri yopildi

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* HEADER */}
        <div className="mb-10">
            <h1 className="text-4xl font-bold">
                Xush kelibsiz, <span className="text-blue-400 capitalize">{username}</span>!
            </h1>
            <p className="text-gray-400 mt-2">O'qishda davom eting va yangi marralarni zabt eting.</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
                { label: 'Kurslarim', value: enrollments.length, icon: '📚', color: 'bg-blue-500/20 text-blue-400' },
                { label: 'Tugallangan', value: '0', icon: '🏆', color: 'bg-green-500/20 text-green-400' },
                { label: 'Sertifikatlar', value: '0', icon: '📜', color: 'bg-purple-500/20 text-purple-400' },
                { label: 'Ballar', value: '120', icon: '⭐', color: 'bg-yellow-500/20 text-yellow-400' }
            ].map((stat, index) => (
                <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md flex items-center gap-4">
                    <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                        {stat.icon}
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold">{stat.value}</h3>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* MY COURSES GRID */}
        <h2 className="text-2xl font-bold mb-6">Mening Kurslarim</h2>

        {enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {enrollments.map((item) => {
                    const course = item.course_details || {}; 
                    return (
                        <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all group">
                            <div className="h-48 bg-gray-800 relative">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">Rasm mavjud emas</div>
                                )}
                                <div className="absolute top-4 left-4 bg-blue-600 text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                                    {course.category_name || 'Kurs'}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                                <p className="text-gray-400 text-sm mb-6 line-clamp-2">{course.description}</p>
                                
                                <Link 
                                    to={`/course/${course.id}`} 
                                    className="block text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all"
                                >
                                    Darsni boshlash
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
                <p className="text-gray-400 mb-4">Siz hali birorta kursga a'zo bo'lmagansiz.</p>
                <Link to="/courses" className="text-blue-400 hover:underline font-bold">Kurslarni ko'rish</Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;