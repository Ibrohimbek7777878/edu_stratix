import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { showSuccessAlert, showErrorAlert } from "../utils/customAlert";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    password: "",
    role: "student",
    phone: "",
    telegram_username: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Backend uchun username yaratish (agar telefon raqamini username sifatida ishlatsangiz)
    const signupData = {
      ...formData,
      username: formData.phone.replace(/\D/g, ""), // Faqat raqamlarni username qiladi
    };

    // Student uchun telegram tekshiruvi
    if (formData.role === "student" && !formData.telegram_username) {
      showErrorAlert("Telegram username kiritish shart!");
      setLoading(false);
      return;
    }

    try {
      await api.post("/users/register/", signupData);

      const successMsg =
        formData.role === "teacher"
          ? "Hisob yaratildi. Kirgandan so'ng Profilingizni to'ldiring."
          : "Muvaffaqiyatli ro'yxatdan o'tdingiz.";

      showSuccessAlert("Tabriklaymiz!", successMsg);
      navigate("/login");
    } catch (err) {
      // Backenddan kelgan aniq xatoni ko'rsatish (masalan: "Bu telefon raqami band")
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#0f172a]">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl animate__animated animate__fadeIn bg-white/5 border border-white/10">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Ro'yxatdan o'tish
        </h1>

        {/* ROLE SWITCHER */}
        <div className="bg-white/10 p-1 rounded-xl flex mb-6">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "student" })}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
              formData.role === "student"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "teacher" })}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
              formData.role === "teacher"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Teacher
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Ismingiz"
              required
              className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 transition placeholder-gray-400"
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Familiyangiz"
              required
              className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 transition placeholder-gray-400"
            />
          </div>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Telefon (+998...)"
            required
            className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 transition placeholder-gray-400"
          />

          {formData.role === "student" && (
            <div className="relative animate__animated animate__fadeIn">
              <span className="absolute left-4 top-3 text-gray-400">@</span>
              <input
                type="text"
                name="telegram_username"
                value={formData.telegram_username}
                onChange={handleChange}
                placeholder="Telegram Username"
                required
                className="w-full rounded-lg pl-8 pr-4 py-3 bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 transition placeholder-gray-400"
              />
            </div>
          )}

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Parol o'ylab toping"
            required
            className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 transition placeholder-gray-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Akkauntingiz bormi?{" "}
          <Link to="/login" className="text-blue-400 font-bold hover:underline">
            Kirish
          </Link>
        </div>

        <div className="mt-4 border-t border-white/5 pt-4 text-center">
          <Link
            to="/parents"
            className="text-green-400 font-bold hover:underline flex items-center justify-center gap-2"
          >
            <span>👨‍👩‍👧</span> Ota-onalar uchun kirish
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
