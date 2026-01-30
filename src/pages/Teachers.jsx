import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    
    useEffect(() => {
        api.get('/users/teachers/').then(res => setTeachers(res.data));
    }, []);

    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 text-white">
            Our Expert Teachers
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="glass-panel p-6 rounded-xl text-center hover:scale-105 transition"
              >
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 overflow-hidden border-2 border-blue-500">
                  {teacher.avatar ? (
                    <img
                      src={teacher.avatar}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      👨‍🏫
                    </div>
                  )}
                  {/* ... Rasm va Ism tagida ... */}
                  <p className="text-sm text-blue-300 mb-2">
                    @{teacher.username}
                  </p>

                  {/* TELEFON RAQAM (YANGI) */}
                  <div className="flex items-center justify-center gap-2 mb-4 text-gray-300 text-sm bg-white/5 py-1 rounded-lg">
                    <span>📞</span>
                    <span>{teacher.phone || "+998 -- --- -- --"}</span>
                  </div>
                </div>
                <h3 className="font-bold text-white">
                  {teacher.first_name} {teacher.last_name}
                </h3>
                <p className="text-sm text-blue-300">@{teacher.username}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default Teachers;