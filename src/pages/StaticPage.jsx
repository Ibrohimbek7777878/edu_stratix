import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const content = {
  'help': { title: 'Help Center', text: 'Bu yerda siz savollaringizga javob topishingiz mumkin. Biz bilan bog\'lanish: support@eduvision.uz' },
  'terms': { title: 'Terms of Service', text: 'Platformadan foydalanish qoidalari: 1. Tartibni saqlash. 2. Mualliflik huquqini buzmaslik...' },
  'privacy': { title: 'Privacy Policy', text: 'Biz sizning ma\'lumotlaringizni uchinchi shaxslarga bermaymiz. Hamma ma\'lumotlar himoyalangan.' },
  'pricing': { title: 'Pricing & Plans', text: 'Bizda kurslar har xil narxda. Hamyoningizni to\'ldiring va istalgan kursni xarid qiling.' }
};

const StaticPage = () => {
  const { page } = useParams();
  const data = content[page] || { title: 'Page Not Found', text: 'Ma\'lumot topilmadi.' };

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="glass-panel p-8 rounded-2xl">
            <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
            <p className="text-gray-300 leading-relaxed mb-8">{data.text}</p>
            <Link to="/" className="text-blue-400 hover:text-white transition">← Bosh sahifaga qaytish</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StaticPage;