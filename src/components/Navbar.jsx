import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const [userName, setUserName] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState("student");

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setThemeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (token) {
      api
        .get("/users/profile/")
        .then((res) => {
          if (res.data.is_superuser || res.data.username === "admin")
            setIsAdmin(true);
          setUserRole(res.data.role);
          setUserName(res.data.first_name);
        })
        .catch(() => {});
    }
  }, [token]);

  const changeSeason = (newSeason) => {
    const event = new CustomEvent("changeSeason", { detail: newSeason });
    window.dispatchEvent(event);
    setThemeOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-black/20">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/50 group-hover:scale-110 transition">
            E
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            EduVision
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-300 hover:text-white font-medium transition"
          >
            Home
          </Link>
          <Link
            to="/courses"
            className="text-gray-300 hover:text-white font-medium transition"
          >
            Courses
          </Link>
          <Link
            to="/teachers"
            className="text-gray-300 hover:text-white font-medium transition"
          >
            Teachers
          </Link>
        </div>

        <div className="flex items-center gap-4" ref={dropdownRef}>
          <div className="relative">
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-xl border border-white/10 transition"
            >
              🎨
            </button>
            {themeOpen && (
              <div className="absolute top-12 right-0 glass-panel p-2 rounded-xl flex gap-2 shadow-xl z-50 animate__animated animate__fadeInDown bg-[#1a1a2e] border border-white/10">
                <button
                  onClick={() => changeSeason("winter")}
                  className="w-8 h-8 rounded-lg bg-blue-900/80 hover:scale-110 transition"
                >
                  ❄️
                </button>
                <button
                  onClick={() => changeSeason("spring")}
                  className="w-8 h-8 rounded-lg bg-green-900/80 hover:scale-110 transition"
                >
                  🌧️
                </button>
                <button
                  onClick={() => changeSeason("summer")}
                  className="w-8 h-8 rounded-lg bg-indigo-900/80 hover:scale-110 transition"
                >
                  💻
                </button>
                <button
                  onClick={() => changeSeason("autumn")}
                  className="w-8 h-8 rounded-lg bg-orange-900/80 hover:scale-110 transition"
                >
                  🍂
                </button>
              </div>
            )}
          </div>

          {token ? (
            <div className="relative flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-white text-sm font-bold leading-none">
                  {userName || "User"}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold mt-1 ${
                    userRole === "teacher"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                      : "bg-green-500/20 text-green-400 border border-green-500/50"
                  }`}
                >
                  {userRole}
                </span>
              </div>

              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/20 hover:border-white transition shadow-lg"
              >
                {userName ? userName[0].toUpperCase() : "👤"}
              </button>

              {dropdownOpen && (
                <div className="absolute top-14 right-0 w-64 glass-panel rounded-xl shadow-2xl overflow-hidden py-2 z-50 animate__animated animate__fadeInDown bg-[#1a1a2e]/95 border border-white/10">
                  <div className="px-4 py-2 border-b border-white/10 mb-2">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                      Menu
                    </p>
                  </div>

                  <Link
                    to="/dashboard"
                    className="block px-4 py-3 text-white hover:bg-white/10 flex items-center gap-3 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>📊</span> Dashboard
                  </Link>
                  <Link
                    to="/wallet"
                    className="block px-4 py-3 text-white hover:bg-white/10 flex items-center gap-3 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>💳</span> My Wallet
                  </Link>
                  <Link
                    to="/messages"
                    className="block px-4 py-3 text-white hover:bg-white/10 flex items-center gap-3 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>💬</span> Messages
                  </Link>
                  <Link
                    to="/ai-assistant"
                    className="block px-4 py-3 text-white hover:bg-white/10 flex items-center gap-3 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>🤖</span> AI Yordamchi
                  </Link>
                  <Link
                    to="/live"
                    className="block px-4 py-3 text-white hover:bg-white/10 flex items-center gap-3 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>📡</span> Live Stream
                  </Link>

                  {userRole === "teacher" && (
                    <Link
                      to="/teacher-dashboard"
                      className="block px-4 py-3 text-white hover:bg-white/10 flex items-center gap-3 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>👨‍🏫</span> O'qituvchi Paneli
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-white hover:bg-white/10 flex items-center gap-3 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>⚙️</span> Sozlamalar
                  </Link>

                  {(isAdmin || userRole === "teacher") && (
                    <Link
                      to="/parent-control"
                      className="block px-4 py-3 text-green-400 hover:bg-white/10 flex items-center gap-3 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>🛡️</span> Ota-ona Nazorati
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin-panel"
                      className="block px-4 py-3 text-red-400 font-bold hover:bg-white/10 flex items-center gap-3 transition border-t border-white/10 mt-1"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>⚙️</span> Admin Panel
                    </Link>
                  )}

                  <div className="border-t border-white/10 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 font-bold flex items-center gap-3 transition"
                  >
                    <span>🚪</span> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-white font-bold hover:text-blue-400 transition"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-500/30"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
