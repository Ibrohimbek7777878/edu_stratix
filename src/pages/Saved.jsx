import React from 'react';
import { Bookmark } from 'lucide-react';

const Saved = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
        <Bookmark className="text-blue-600" /> Saqlangan darslar
      </h1>
      
      <div className="bg-white rounded-2xl p-12 text-center border border-blue-100">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bookmark className="w-10 h-10 text-blue-300" />
        </div>
        <h3 className="text-xl font-bold text-blue-900 mb-2">Hozircha bo'sh</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Siz hali hech qanday darsni saqlamadingiz. Qiziqarli darslarni topib, "Saqlash" tugmasini bosing.
        </p>
      </div>
    </div>
  );
};

export default Saved;