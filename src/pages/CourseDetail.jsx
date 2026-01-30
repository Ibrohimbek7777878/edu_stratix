import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";
import {
  confirmCoursePurchase,
  showSuccessAlert,
  showErrorAlert,
  confirmAction,
} from "../utils/customAlert";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}/`);
        setCourse(response.data);

        if (response.data.lessons && response.data.lessons.length > 0) {
          setActiveVideo(response.data.lessons[0]);
        }
      } catch (error) {
        showErrorAlert(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);
  const handleBuy = async () => {
    // 1. Chiroyli so'rovnoma
    const isConfirmed = await confirmCoursePurchase(course);
    if (!isConfirmed) return;

    try {
      await api.post("/courses/enroll/", { course: course.id });
      showSuccessAlert("Tabriklaymiz!", "Kurs muvaffaqiyatli sotib olindi. 🎉");
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      // Backenddan xato kelsa
      const errorMsg = error.response?.data?.error || "";

      // Agar "Mablag' yetarli emas" degan xato bo'lsa:
      if (errorMsg.includes("Mablag'")) {
        const goToWallet = await confirmAction(
          "Mablag' yetarli emas 😔",
          "Hisobingizni to'ldirish uchun Hamyon sahifasiga o'tishni xohlaysizmi?",
          "Ha, Hamyonga o'tish"
        );

        if (goToWallet) {
          navigate("/wallet"); // Avtomatik Walletga o'tadi
        }
      } else {
        // Boshqa xato bo'lsa shunchaki ko'rsat
        showErrorAlert(errorMsg || "Xatolik yuz berdi");
      }
    }
  };

  const getVideoUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `http://127.0.0.1:8000${url}`;
  };

  if (loading && !course)
    return (
      <div className="text-center text-white py-20 animate-pulse">
        Yuklanmoqda...
      </div>
    );
  if (!course)
    return <div className="text-center text-white py-20">Kurs topilmadi</div>;

  const hasAccess = course.is_enrolled || course.is_owner;

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHAP TOMON: Video Player */}
        <div className="lg:col-span-2 space-y-6">
          <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-white/10 group">
            {hasAccess ? (
              activeVideo?.video_file ? (
                <video
                  key={activeVideo.id} // Video o'zgarganda qayta yuklanishi uchun
                  controls
                  autoPlay
                  className="w-full h-full"
                  src={getVideoUrl(activeVideo.video_file)}
                ></video>
              ) : (
                <div className="flex items-center justify-center h-full bg-slate-900 text-gray-400">
                  Video mavjud emas
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full flex-col bg-slate-900/90 backdrop-blur-md">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                  <span className="text-4xl">🔒</span>
                </div>
                <h2 className="font-bold text-2xl">Kurs yopiq</h2>
                <p className="text-gray-400 mt-2">
                  Darslarni ko'rish uchun kursni sotib oling
                </p>
                <button
                  onClick={handleBuy}
                  className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30"
                >
                  Kursga a'zo bo'lish
                </button>
              </div>
            )}
          </div>

          <div className="glass-panel p-8 rounded-3xl bg-white/5 border border-white/10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">
                  {course.category?.toUpperCase()}
                </span>
              </div>
              <div className="text-right font-mono text-2xl text-green-400 font-bold">
                {parseFloat(course.price).toLocaleString()}{" "}
                <span className="text-sm">UZS</span>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed mb-8">
              {course.description}
            </p>

            <div className="flex items-center gap-4 border-t border-white/5 pt-6">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center font-bold text-xl border-2 border-white/10">
                {course.teacher?.first_name?.[0] || "T"}
              </div>
              <div>
                <h4 className="font-bold text-lg leading-none">
                  {course.teacher
                    ? `${course.teacher.first_name} ${course.teacher.last_name}`
                    : "Mentor"}
                </h4>
                <p className="text-xs text-blue-400 mt-1 uppercase tracking-widest font-bold">
                  Professional Instructor
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* O'NG TOMON: Darslar ro'yxati */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-3xl bg-white/5 border border-white/10 sticky top-24">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <span>📚</span> Darslar ro'yxati
              <span className="ml-auto text-xs bg-white/10 px-2 py-1 rounded text-gray-400">
                {course.lessons?.length || 0} ta dars
              </span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {course.lessons?.map((lesson, index) => (
                <div
                  key={lesson.id}
                  onClick={() => {
                    if (hasAccess) setActiveVideo(lesson);
                    else
                      showErrorAlert(
                        "Xarid talab etiladi",
                        "Ushbu darsni ko'rish uchun kursni sotib olishingiz kerak."
                      );
                  }}
                  className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer
                                        ${
                                          activeVideo?.id === lesson.id
                                            ? "bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10"
                                            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                                        }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110
                                        ${
                                          activeVideo?.id === lesson.id
                                            ? "bg-blue-600 text-white"
                                            : "bg-white/10 text-gray-400"
                                        }`}
                  >
                    {hasAccess
                      ? activeVideo?.id === lesson.id
                        ? "▶"
                        : index + 1
                      : "🔒"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-bold truncate ${
                        activeVideo?.id === lesson.id
                          ? "text-blue-400"
                          : "text-gray-200"
                      }`}
                    >
                      {lesson.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 uppercase mt-1">
                      Davomiyligi: {lesson.duration || "00:00"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {!hasAccess && (
              <button
                onClick={handleBuy}
                className="w-full mt-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-500/20 active:scale-95"
              >
                Kursni sotib olish 🛒
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
