import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom"; // useNavigate importi shu yerda bo'lgani ma'qul

const TeacherDashboard = () => {
  // 1-XATO: useNavigate() qavslar bilan chaqirilishi kerak
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/courses/my-created/");
        setCourses(res.data);
      } catch (err) {
        console.error("Kurslarni yuklashda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  if (loading)
    return <div className="text-center py-20 text-white">Yuklanmoqda...</div>;

  const handleStartLive = async () => {
    const title = prompt("Jonli efir mavzusini kiriting:");
    if (!title) return;

    try {
      await api.post("/communication/stream/", { title: title });
      // Efir sahifasiga o'tamiz
      navigate("/live");
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi!");
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#0f172a]">
      {/* 2-TARTIB: Navbar odatda eng tepada turadi */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header qismi */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
            <p className="text-gray-400">Manage your content</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleStartLive}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-lg flex items-center gap-2 animate-pulse"
            >
              📡 Start Live
            </button>

            <Link
              to="/create-course" // 3-XATO: Pastdagi Link bilan bir xil bo'lishi kerak
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-bold transition flex items-center gap-2"
            >
              <span>+</span> Create Course
            </Link>
          </div>
        </div>

        {/* Stats qismi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-gray-400">Total Courses</h3>
            <p className="text-3xl font-bold text-white">{courses.length}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-gray-400">Total Students</h3>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="text-gray-400">Revenue</h3>
            <p className="text-3xl font-bold text-green-400">0 UZS</p>
          </div>
        </div>

        {/* Kurslar ro'yxati */}
        <h2 className="text-white text-xl font-semibold mb-4">My Courses</h2>

        {courses.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
            Sizda hali kurslar yo'q. Kurs yaratish uchun yuqoridagi tugmani
            bosing.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {course.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                  <span className="text-blue-400 font-bold">
                    {course.price
                      ? `${parseFloat(course.price).toLocaleString()} UZS`
                      : "Free"}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      to={`/course/${course.id}/add-lesson`}
                      className="text-green-400 hover:text-white text-sm font-bold border border-green-500/50 px-2 py-1 rounded"
                    >
                      + Add Video
                    </Link>

                    <Link
                      to={`/course/${course.id}`}
                      className="text-gray-400 hover:text-white text-sm font-medium px-2 py-1"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
