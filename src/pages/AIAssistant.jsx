import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

const AiAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/ai/chat/");
        const formatted = [];
        res.data.forEach((item) => {
          formatted.push({ sender: "me", text: item.user_message });
          formatted.push({ sender: "ai", text: item.ai_response });
        });
        setMessages(formatted); // Teskari qilish shart emas, chunki scroll pastga tushadi
      } catch (e) {
        console.error(e);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { sender: "me", text: userText }]);
    setLoading(true);

    try {
      const res = await api.post("/ai/chat/", { message: userText });
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: res.data.ai_response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Uzr, xatolik yuz berdi." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 h-[calc(100vh-80px)]">
        <div className="glass-panel h-full rounded-3xl flex flex-col shadow-2xl border border-blue-500/30 overflow-hidden relative">
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl shadow-lg animate-pulse">
              🤖
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                EduVision AI Mentor
              </h2>
              <p className="text-xs text-blue-300">Gemini Pro</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                <p className="text-4xl mb-4">👋</p>
                <p>Salom! Savolingizni yozing.</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                    msg.sender === "me"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white/10 text-gray-100 rounded-tl-none border border-white/10"
                  }`}
                >
                  {msg.text.split("\n").map((line, i) => (
                    <p key={i} className="mb-1">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-300 p-4 rounded-2xl rounded-tl-none flex gap-2">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white/5 border-t border-white/10">
            <form onSubmit={handleSend} className="relative flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Savol bering..."
                className="w-full glass-input rounded-xl pl-5 pr-14 py-4 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-lg text-white"
              >
                🚀
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MANA BU QATOR ENG MUHIMI ---
export default AiAssistant;
