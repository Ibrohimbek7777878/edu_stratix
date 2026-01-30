import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { showSuccessAlert, showErrorAlert } from "../utils/customAlert";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Login so'rovi
      const response = await api.post("/users/login/", formData);
      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // 2. Profilni olish (Rolni bilish uchun)
      const profileRes = await api.get("/users/profile/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      showSuccessAlert("Xush kelibsiz!", "Tizimga muvaffaqiyatli kirdingiz.");

      // 3. Yo'naltirish
      if (profileRes.data.role === "teacher") {
        navigate("/teacher-dashboard"); // Teacher -> Dashboardga
      } else {
        navigate("/dashboard"); // Student -> Dashboardga
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || "Login yoki parol noto'g'ri.";
      showErrorAlert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-sans">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Orqa fon bezagi */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg animate-pulse text-white">
            E
          </div>
          <h1 className="text-2xl font-bold text-white">Xush kelibsiz</h1>
          <p className="text-gray-400 text-sm mt-1">
            Davom ettirish uchun tizimga kiring
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Telefon Raqam (Username) */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
              Telefon Raqam
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-xl px-4 py-3 glass-input text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
              placeholder="+998 90 123 45 67"
            />
          </div>

          {/* Parol */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
              Parol
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl px-4 py-3 glass-input text-white placeholder-gray-500 outline-none focus:border-blue-500 transition"
              placeholder="••••••••"
            />
          </div>

          {/* Kirish Tugmasi */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition transform hover:scale-[1.02]"
          >
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>

        {/* Footer Linklar */}
        <div className="mt-8 text-center space-y-4 pt-6 border-t border-white/5">
          <p className="text-sm text-gray-400">
            Hisobingiz yo'qmi?{" "}
            <Link
              to="/signup-student"
              className="text-blue-400 font-bold hover:text-blue-300 ml-1 transition"
            >
              Talaba sifatida kirish
            </Link>
          </p>
          <p className="text-sm text-gray-400">
            <Link
              to="/signup-teacher"
              className="text-indigo-400 font-bold hover:text-indigo-300 transition"
            >
              O'qituvchi sifatida kirish
            </Link>
          </p>
          <div className="mt-2">
            <Link
              to="/parents"
              className="text-green-400 font-bold hover:text-green-300 text-sm flex items-center justify-center gap-2"
            >
              <span>👨‍👩‍👧</span> Ota-onalar uchun
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
