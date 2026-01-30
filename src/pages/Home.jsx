import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteInfo, setSiteInfo] = useState({
    address: "Yuklanmoqda...",
    phone: "...",
    working_hours: "...",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, teachersRes] = await Promise.all([
          api.get("/courses/"),
          api.get("/users/teachers/"),
        ]);
        setCourses(coursesRes.data);
        setTeachers(teachersRes.data);
      } catch (error) {
        console.error("Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem("siteSettings");
    if (cached) setSiteInfo(JSON.parse(cached));
    api.get("/core/settings/").then((res) => {
      setSiteInfo(res.data);
      localStorage.setItem("siteSettings", JSON.stringify(res.data));
    });
  }, []);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `http://127.0.0.1:8000${url}`;
  };

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-40 px-4 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-white drop-shadow-xl">
            THE MORE YOU <span className="text-blue-400 text-glow">LEARN</span>
            <br />
            <div className="text-4xl md:text-6xl mt-2 text-blue-200 h-20">
              <Typewriter
                options={{
                  strings: ["THE MORE YOU EARN", "THE BETTER YOU CODE"],
                  autoStart: true,
                  loop: true,
                }}
              />
            </div>
          </h1>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg backdrop-blur-sm bg-black/20 p-4 rounded-xl border border-white/10">
            O'zbekistondagi eng kuchli mutaxassislardan zamonaviy kasblarni
            o'rganing.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition"
            >
              🚀 Join as Student
            </Link>
            <Link
              to="/upload"
              className="px-8 py-4 glass-panel text-white rounded-xl font-bold hover:bg-white/10 transition"
            >
              👨‍🏫 Become a Teacher
            </Link>
          </div>
        </div>
      </section>

      {/* --- INFO SECTION --- */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-500/30 shadow-2xl shadow-blue-900/20">
            <div className="text-left md:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-4">
                <span className="text-blue-400">EduVision</span> O'quv Markazi
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Biz Toshkent shahrining markazida joylashgan zamonaviy IT va
                kasb-hunar maktabimiz. 5 yillik tajriba va 10,000 dan ortiq
                bitiruvchilar.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-xl">
                    📍
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Manzilimiz:</p>
                    <p className="text-white font-medium">{siteInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center text-xl">
                    📞
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Aloqa uchun:</p>
                    <p className="text-white font-medium">{siteInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-xl">
                    ⏰
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Ish vaqti:</p>
                    <p className="text-white font-medium">
                      {siteInfo.working_hours}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center relative">
              <div className="absolute w-64 h-64 bg-blue-500/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-6 rounded-2xl text-center">
                  <div className="text-4xl mb-2">🏢</div>
                  <p className="text-gray-300 text-sm">Zamonaviy Ofis</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl text-center mt-8">
                  <div className="text-4xl mb-2">⚡</div>
                  <p className="text-gray-300 text-sm">Tezkor Wi-Fi</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl text-center">
                  <div className="text-4xl mb-2">☕</div>
                  <p className="text-gray-300 text-sm">Coworking</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl text-center mt-8">
                  <div className="text-4xl mb-2">🤝</div>
                  <p className="text-gray-300 text-sm">Community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TOP TEACHERS --- */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            Top Teachers
          </h2>
          <Link
            to="/teachers"
            className="text-blue-300 font-bold hover:text-white transition"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {teachers.slice(0, 4).map((teacher) => (
            <div
              key={teacher.id}
              className="glass-panel p-6 rounded-2xl text-center hover:scale-105 transition"
            >
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 overflow-hidden border-4 border-blue-500/50">
                {teacher.avatar ? (
                  <img
                    src={getImageUrl(teacher.avatar)}
                    alt={teacher.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                    {teacher.first_name?.[0] || "T"}
                  </div>
                )}
              </div>
              <h4 className="font-bold text-white">
                {teacher.first_name} {teacher.last_name}
              </h4>
              <p className="text-blue-400 text-sm">Expert Teacher</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- LATEST COURSES --- */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            Latest Courses
          </h2>
          <Link
            to="/courses"
            className="text-blue-300 font-bold hover:text-white transition"
          >
            View All →
          </Link>
        </div>
        {loading ? (
          <p className="text-white">Yuklanmoqda...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Link
                  to={`/course/${course.id}`}
                  key={course.id}
                  className="glass-panel p-4 rounded-2xl hover:bg-white/10 transition group block"
                >
                  <div className="h-52 rounded-xl mb-4 overflow-hidden relative bg-black/30">
                    {course.thumbnail ? (
                      <img
                        src={getImageUrl(course.thumbnail)}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        Rasm yo'q
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                      New
                    </div>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-bold px-2 py-1 rounded uppercase">
                      {course.category}
                    </span>
                    <span className="font-bold text-blue-400">
                      {parseFloat(course.price).toLocaleString()} UZS
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-xl mb-1 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    By:{" "}
                    <span className="text-gray-200">
                      {course.teacher ? course.teacher.first_name : "Unknown"}
                    </span>
                  </p>
                  <div className="w-full bg-blue-600/20 py-2 rounded-lg text-center text-blue-300 font-bold group-hover:bg-blue-600 group-hover:text-white transition">
                    View Course
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-400 py-10 glass-panel rounded-2xl">
                Hozircha kurslar mavjud emas.
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Home;
