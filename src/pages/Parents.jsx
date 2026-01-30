import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

const Parents = () => {
  const [form, setForm] = useState({ phone: "", telegram_username: "" });
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await api.post("/users/parents-check/", form);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Ma'lumot topilmadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Navbar /> {/* Navbar login qilmagan holatda chiqadi */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="glass-panel p-8 rounded-2xl text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            👨‍👩‍👧 Ota-onalar Nazorati
          </h1>
          <p className="text-gray-400 mb-6">
            Farzandingizning natijalarini ko'rish uchun ma'lumotlarini kiriting.
          </p>

          <form onSubmit={handleCheck} className="space-y-4 max-w-sm mx-auto">
            <input
              type="text"
              placeholder="Farzandingiz Telefoni (+998...)"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full glass-input px-4 py-3 rounded-lg"
              required
            />
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-400">@</span>
              <input
                type="text"
                placeholder="Telegram Username"
                onChange={(e) =>
                  setForm({ ...form, telegram_username: e.target.value })
                }
                className="w-full glass-input pl-8 pr-4 py-3 rounded-lg"
                required
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-500 transition"
            >
              {loading ? "Izlanmoqda..." : "Tekshirish"}
            </button>
          </form>

          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>

        {/* NATIJALAR */}
        {data && (
          <div className="glass-panel p-6 rounded-2xl animate__animated animate__fadeInUp">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              {data.student_name}
            </h2>

            <h3 className="text-white font-bold mb-3 border-b border-white/10 pb-2">
              O'qiyotgan Kurslari:
            </h3>
            {data.courses_summary.length > 0 ? (
              <div className="space-y-4">
                {data.courses_summary.map((course, i) => (
                  <div
                    key={i}
                    className="bg-white/5 p-4 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-white font-bold">
                        {course.course_title}
                      </h4>
                      <p className="text-sm text-gray-400">
                        O'qituvchi: {course.teacher_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <a
                        href={`tel:${course.teacher_phone}`}
                        className="text-green-400 font-bold text-sm block mb-1 hover:underline"
                      >
                        📞 {course.teacher_phone}
                      </a>
                      <span className="text-xs text-gray-500">
                        Qo'shilgan:{" "}
                        {new Date(course.joined_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Hozircha kurslarga yozilmagan.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Parents;
