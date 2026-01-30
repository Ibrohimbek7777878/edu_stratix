import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const CreateAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    secret_key: "",
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/create-admin/", formData);
      alert("Admin yaratildi! Endi Login qiling.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Xatolik!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleCreate}
        className="glass-panel p-8 rounded-2xl w-96 space-y-4 border border-red-500/30"
      >
        <h2 className="text-2xl font-bold text-red-500 text-center">
          Admin Yaratish 🔐
        </h2>
        <p className="text-xs text-gray-400 text-center">Bu sahifa maxfiy!</p>

        <input
          type="text"
          placeholder="Yangi Admin Login"
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="w-full glass-input p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Yangi Parol"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full glass-input p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Maxfiy Kalit So'z"
          onChange={(e) =>
            setFormData({ ...formData, secret_key: e.target.value })
          }
          className="w-full glass-input p-3 rounded-lg border-red-500/50"
        />

        <button className="w-full bg-red-600 py-3 rounded-lg font-bold hover:bg-red-500 transition">
          Yaratish
        </button>
      </form>
    </div>
  );
};

export default CreateAdmin;
