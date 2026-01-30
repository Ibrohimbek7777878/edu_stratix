import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      {/* Katta 404 yozuvi */}
      <h1 className="text-9xl font-extrabold text-blue-600 drop-shadow-lg">404</h1>
      
      <div className="mt-4">
        <h2 className="text-3xl font-bold text-gray-800">Sahifa topilmadi</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Uzr, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
        </p>
      </div>

      {/* Uyga qaytish tugmasi */}
      <Link 
        to="/" 
        className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
      >
        <span>🏠</span> Bosh sahifaga qaytish
      </Link>
    </div>
  );
};

export default NotFound;