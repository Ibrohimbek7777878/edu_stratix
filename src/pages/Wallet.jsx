import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { showSuccessAlert, showErrorAlert, confirmAction } from '../utils/customAlert';

const Wallet = () => {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('click');
    const [courses, setCourses] = useState([]);

    // 1. Ma'lumotlarni yuklash (Hamyon va Kurslar)
    const fetchData = async () => {
        try {
            const [walletRes, coursesRes] = await Promise.all([
                api.get('/payments/'),
                api.get('/courses/')
            ]);
            setWallet(walletRes.data);
            setCourses(coursesRes.data);
        } catch (error) {
            showErrorAlert(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Input formatlash (Masalan: 100 000)
    const handleAmountChange = (e) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val === "") { setAmount(""); return; }
        setAmount(parseInt(val).toLocaleString('ru-RU'));
    };

    // 3. Hisobni To'ldirish
    const handleTopUp = async () => {
        const rawAmount = parseInt(amount.replace(/\s/g, ""));
        
        if (!rawAmount || rawAmount < 1000) {
            showErrorAlert("Minimal to'lov miqdori 1 000 so'm!");
            return;
        }

        const isConfirmed = await confirmAction(
            "To'lovni tasdiqlaysizmi?", 
            `Siz ${paymentMethod.toUpperCase()} orqali <b>${amount} UZS</b> to'lamoqchisiz.`
        );

        if (isConfirmed) {
            try {
                setLoading(true);
                // API so'rovi
                await api.post('/payments/topup/', { 
                    amount: rawAmount, 
                    method: paymentMethod 
                });
                
                showSuccessAlert("Muvaffaqiyatli!", "To'lov qabul qilindi, hisobingiz yangilandi.");
                setAmount('');
                fetchData(); // Ma'lumotlarni qayta yuklash
            } catch (error) {
                showErrorAlert(error);
            } finally {
                setLoading(false);
            }
        }
    };

    // 4. Kurs sotib olish
    const handleQuickBuy = async (course) => {
        const price = parseFloat(course.price);
        const balance = parseFloat(wallet.balance);

        if (balance < price) {
            showErrorAlert("Hisobingizda mablag' yetarli emas! Iltimos, avval hisobni to'ldiring.");
            return;
        }

        const isConfirmed = await confirmAction(
            "Xaridni tasdiqlang", 
            `<b>"${course.title}"</b> kursini sotib olishni istaysizmi? <br/> Narxi: ${price.toLocaleString('ru-RU')} UZS`
        );

        if (isConfirmed) {
            try {
                setLoading(true);
                // Kurs sotib olish API nuqtasi (Backend URLingizga qarab o'zgartiring)
                await api.post(`/courses/${course.id}/buy/`);
                
                showSuccessAlert("Tabriklaymiz!", "Kurs muvaffaqiyatli sotib olindi.");
                fetchData(); // Balans va tarixdagi o'zgarishni ko'rish uchun
            } catch (error) {
                showErrorAlert(error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading && !wallet) return <div className="text-center text-white py-20 italic">Yuklanmoqda...</div>;

    return (
        <div className="min-h-screen font-sans pb-20 bg-[#0f172a]">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-8">
                
                {/* --- BALANS VA TO'LDIRISH --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-white/20">
                        <div className="relative z-10">
                            <p className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-1">Mening Balansim</p>
                            <h2 className="text-5xl font-bold">
                                {wallet ? parseFloat(wallet.balance).toLocaleString('ru-RU') : '0'} 
                                <span className="text-2xl font-medium opacity-70 ml-2">UZS</span>
                            </h2>
                            <p className="mt-4 text-xs text-blue-100 opacity-60">ID: {wallet?.id || '---'}</p>
                        </div>
                        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="glass-panel p-8 rounded-3xl bg-white/5 border border-white/10">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <span>💳</span> Hisobni to'ldirish
                        </h3>
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="Summa: 100 000" 
                                className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/10 text-white font-bold text-xl outline-none focus:border-blue-500 transition" 
                            />
                            
                            <div className="grid grid-cols-2 gap-3">
                                {['click', 'payme'].map(m => (
                                    <button 
                                        key={m}
                                        onClick={() => setPaymentMethod(m)}
                                        className={`py-2 rounded-lg font-bold uppercase text-sm border transition ${paymentMethod === m ? 'bg-blue-500 border-blue-400 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={handleTopUp}
                                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition shadow-lg shadow-green-500/20"
                            >
                                To'ldirish {amount ? `(${amount} UZS)` : ''}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- TEZKOR XARID --- */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <span>🔥</span> Tezkor Xarid (Market)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {courses.slice(0, 3).map(course => (
                            <div key={course.id} className="glass-panel p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition group">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2 py-1 rounded">{course.category || 'Kurs'}</span>
                                    <span className="text-white font-bold">{parseFloat(course.price).toLocaleString('ru-RU')} UZS</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
                                <button 
                                    onClick={() => handleQuickBuy(course)}
                                    className="w-full mt-2 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-white font-bold text-sm transition border border-blue-500/30"
                                >
                                    Sotib Olish 🛒
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

       {/* HISTORY */}
        <div className="glass-panel rounded-2xl p-6">
             <h3 className="font-bold text-white mb-6">O'tkazmalar tarixi</h3>
             <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                 {wallet && wallet.transactions && wallet.transactions.length > 0 ? (
                    // O'ZGARISH SHU YERDA: (tr, index) deb yozdik va key={tr.id || index} qildik
                    [...wallet.transactions].reverse().map((tr, index) => (
                        <div key={tr.id ? `${tr.id}-${index}` : index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${tr.transaction_type === 'deposit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {tr.transaction_type === 'deposit' ? '↓' : '↑'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm capitalize">
                                        {tr.transaction_type === 'deposit' ? 'Hisob to\'ldirish' : 'Kurs xaridi'}
                                    </h4>
                                    <p className="text-xs text-gray-400">{new Date(tr.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold text-base ${tr.transaction_type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                                    {tr.transaction_type === 'deposit' ? '+' : '-'}{parseFloat(tr.amount).toLocaleString('ru-RU')}
                                </p>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">{tr.status}</span>
                            </div>
                        </div>
                    ))
                 ) : (
                    <p className="text-gray-500 text-center py-4">Tarix bo'sh.</p>
                 )}
             </div>
        </div>
            </div>
        </div>
    );
};

export default Wallet;