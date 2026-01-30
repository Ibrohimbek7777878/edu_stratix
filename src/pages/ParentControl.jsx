import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

const ParentControl = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/parent-control/")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-center text-white py-20">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="glass-panel p-8 rounded-2xl mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Ota-ona Nazorati 🛡️
            </h1>
            <p className="text-gray-300">
              Farzandingizning ta'lim jarayonini kuzatib boring.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">O'quvchi:</p>
            <h2 className="text-xl font-bold text-blue-400">
              {data?.student_name}
            </h2>
          </div>
        </div>

        {/* ASOSIY JADVAL */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-white">
              Kurslar va O'zlashtirish
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                <tr>
                  <th className="p-4">Kurs Nomi</th>
                  <th className="p-4">O'qituvchi & Aloqa</th>
                  <th className="p-4 text-center">Jarayon (Darslar)</th>
                  <th className="p-4 text-center">Qoldirilgan (Soat)</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-200">
                {data?.courses_summary.length > 0 ? (
                  data.courses_summary.map((course, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="p-4 font-bold text-white">
                        {course.course_title}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{course.teacher_name}</div>
                        <div className="text-sm text-blue-400 flex items-center gap-1">
                          📞 {course.teacher_phone}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                          {course.progress}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {course.missed_classes > 0 ? (
                          <span className="text-red-400 font-bold">
                            {course.missed_classes} soat
                          </span>
                        ) : (
                          <span className="text-green-400">A'lo</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-green-500 text-xs font-bold border border-green-500/30 px-2 py-1 rounded">
                          AKTIV
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      Farzandingiz hali hech qanday kursga yozilmagan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* QO'SHIMCHA MA'LUMOTLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">📢 Tavsiyalar</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">💡</span>
                Farzandingiz "Python" kursida faol, uni qo'llab-quvvatlang!
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">⚠️</span>
                So'nggi 3 kunda platformaga kirmadi.
              </li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              📞 Ma'muriyat bilan aloqa
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Savollar yoki takliflar bo'lsa, bizga bog'laning.
            </p>
            <div className="flex items-center gap-4 text-white font-bold text-lg">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                📞
              </div>
              +998 71 200-00-00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentControl;
