import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { showSuccessAlert, showErrorAlert } from "../utils/customAlert";

const StudentSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    password: "",
    role: "student",
    phone: "",
    telegram_username: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Django odatda 'username' maydonini xohlaydi.
    // Telefon raqamidan 'username' yasab olamiz.
    const signupData = {
      ...formData,
      username: formData.phone.replace(/\D/g, ""),
    };

    try {
      await api.post("/users/register/", signupData);
      showSuccessAlert(
        "Tabriklaymiz!",
        "Hisobingiz muvaffaqiyatli yaratildi. Endi kirishingiz mumkin.",
      );
      navigate("/login");
    } catch (err) {
      // Xatolik xabarini ob'ekt ko'rinishida emas, matn ko'rinishida chiqarish
      const errorData = err.response?.data;
      const errorMessage =
        typeof errorData === "object"
          ? Object.values(errorData).flat().join(" ")
          : "Ro'yxatdan o'tishda xatolik yuz berdi.";
      showErrorAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 font-sans bg-[#0f172a]">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-blue-500/30 shadow-2xl relative overflow-hidden bg-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg">
            🎓
          </div>
          <h1 className="text-2xl font-bold text-white">
            Talaba sifatida qo'shiling
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            Kelajak kasblarini biz bilan o'rganing
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
                Ism
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Ali"
                required
                className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
                Familiya
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Valiyev"
                required
                className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
              Telefon
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+998 90 123 45 67"
              required
              className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
              Telegram Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400">@</span>
              <input
                type="text"
                name="telegram_username"
                value={formData.telegram_username}
                onChange={handleChange}
                placeholder="username"
                required
                className="w-full rounded-xl pl-8 pr-4 py-3 bg-white/10 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
              Parol
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition transform active:scale-95 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400 border-t border-white/5 pt-6">
          Akkauntingiz bormi?{" "}
          <Link
            to="/login"
            className="text-blue-400 font-bold hover:text-blue-300 ml-1"
          >
            Kirish
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
