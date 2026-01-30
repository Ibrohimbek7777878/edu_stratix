import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const interestsList = [
    { id: 'it', name: 'IT & Programming', icon: '💻' },
    { id: 'auto', name: 'Auto Repair', icon: '🔧' },
    { id: 'fashion', name: 'Sewing & Fashion', icon: '🧵' },
    { id: 'cooking', name: 'Cooking', icon: '🍳' },
    { id: 'carpentry', name: 'Carpentry', icon: '🔨' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'marketing', name: 'Marketing', icon: '📈' },
    { id: 'languages', name: 'Languages', icon: '🗣️' },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (id) => {
    if (selected.includes(id)) {
        setSelected(selected.filter(item => item !== id));
    } else {
        setSelected([...selected, id]);
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
        // Tanlanganlarni vergul bilan birlashtiramiz (masalan: "it,design")
        const interestsString = selected.join(',');
        
        // Profilni yangilaymiz
        await api.patch('/users/profile/', { interests: interestsString });
        
        alert("Qiziqishlaringiz saqlandi! ✅");
        navigate('/dashboard'); // Talaba kabinetiga o'tish
    } catch (error) {
        console.error(error);
        alert("Xatolik yuz berdi");
    } finally {
        setLoading(false);
    }
  };

  // ... importlar ...
// Return qismini o'zgartiring:

return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="glass-panel w-full max-w-4xl p-8 md:p-12 rounded-3xl">
        
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Choose Your Interests</h1>
            <p className="text-gray-300">Select topics you're interested in.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {interestsList.map((item) => {
                const isSelected = selected.includes(item.id);
                return (
                    <div 
                        key={item.id} 
                        onClick={() => toggleInterest(item.id)}
                        className={`cursor-pointer p-6 rounded-2xl border transition flex flex-col items-center justify-center gap-3 h-40 relative backdrop-blur-sm
                            ${isSelected 
                                ? 'border-blue-500 bg-blue-600/30 text-white shadow-lg shadow-blue-500/20' 
                                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <span className="text-3xl">{item.icon}</span>
                        <span className="font-bold text-sm text-center">{item.name}</span>
                        {isSelected && <div className="absolute top-2 right-2 text-blue-400 font-bold">✓</div>}
                    </div>
                );
            })}
        </div>
        
        {/* Footer tugmalari ... */}
        <div className="flex justify-between items-center border-t border-white/10 pt-8">
             <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white">Skip</button>
             <button onClick={handleContinue} className="bg-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition">Continue</button>
        </div>
      </div>
    </div>
);

};


export default Onboarding;