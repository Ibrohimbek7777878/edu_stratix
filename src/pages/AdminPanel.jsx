import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";
import {
  showSuccessAlert,
  showErrorAlert,
  confirmAction,
} from "../utils/customAlert";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({});

  // 1. Ma'lumotlarni yuklash
  useEffect(() => {
    if (activeTab === "settings") {
      api.get("/core/settings/").then((res) => setSettings(res.data));
    } else if (activeTab === "users") {
      api.get("/users/all/").then((res) => setUsers(res.data));
    }
  }, [activeTab]);

  // 2. Sayt sozlamalarini saqlash
  const handleSaveSettings = async () => {
    try {
      await api.put("/core/settings/", settings);
      showSuccessAlert("Saqlandi!", "Sozlamalar yangilandi.");
    } catch (e) {
      showErrorAlert(e);
    }
  };

  // 3. Userni o'chirish
  const handleDeleteUser = async (id) => {
    const isConfirmed = await confirmAction(
      "Foydalanuvchini o'chirasizmi?",
      "Bu amalni qaytarib bo'lmaydi!",
    );
    if (isConfirmed) {
      try {
        await api.delete(`/users/delete/${id}/`);
        setUsers(users.filter((u) => u.id !== id));
        showSuccessAlert("O'chirildi", "Foydalanuvchi bazadan o'chirildi.");
      } catch (e) {
        showErrorAlert(e);
      }
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">⚙️ Boshqaruv Paneli</h1>

          {/* TABS */}
          <div className="glass-panel p-1 rounded-lg flex">
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === "settings" ? "bg-blue-600 text-white" : "text-gray-400"}`}
            >
              Site Settings
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === "users" ? "bg-blue-600 text-white" : "text-gray-400"}`}
            >
              Users Manager
            </button>
          </div>
        </div>

        {/* --- SITE SETTINGS --- */}
        {activeTab === "settings" && (
          <div className="glass-panel p-8 rounded-2xl space-y-6">
            <h2 className="text-xl text-white font-bold mb-4">
              Sayt Ma'lumotlari
            </h2>
            {/* ... (Eski inputlar shu yerda qoladi) ... */}
            <div>
              <label className="text-gray-300 block mb-2">Sayt Nomi</label>
              <input
                value={settings.site_name || ""}
                onChange={(e) =>
                  setSettings({ ...settings, site_name: e.target.value })
                }
                className="w-full glass-input p-3 rounded-lg"
              />
            </div>
            {/* ... Qolgan inputlar (Address, Phone, etc) ... */}
            <button
              onClick={handleSaveSettings}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold w-full"
            >
              Saqlash
            </button>
          </div>
        )}

        {/* --- USERS MANAGER --- */}
        {activeTab === "users" && (
          <div className="glass-panel rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/10 uppercase text-xs font-bold text-white">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4">#{user.id}</td>
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                        {user.avatar ? (
                          <img
                            src={`http://127.0.0.1:8000${user.avatar}`}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <div className="font-bold text-white">
                          {user.username}
                        </div>
                        <div className="text-xs">
                          {user.first_name} {user.last_name}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${user.role === "teacher" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {!user.is_superuser && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-400 hover:text-red-300 font-bold border border-red-500/30 px-3 py-1 rounded hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
