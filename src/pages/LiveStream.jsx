import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

const LiveStream = () => {
  // --- STATE (O'zgaruvchilar) ---
  const [stream, setStream] = useState(null); // Hozirgi efir ma'lumotlari
  const [messages, setMessages] = useState([]); // Chat xabarlari
  const [input, setInput] = useState(""); // Yozilayotgan xabar
  const [myUser, setMyUser] = useState(null); // Men kimman? (Teacher/Student)

  // O'qituvchi uchun formalar
  const [newStreamTitle, setNewStreamTitle] = useState("");
  const [newStreamUrl, setNewStreamUrl] = useState("");
  const [courses, setCourses] = useState([]); // O'qituvchi kurslari
  const [selectedCourse, setSelectedCourse] = useState(""); // Qaysi kurs uchun efir?

  const chatBoxRef = useRef(null); // Chatni pastga tushirish uchun

  // --- 1. DASTLABKI YUKLASH ---
  useEffect(() => {
    // Profilni olamiz (Men kimman?)
    api
      .get("/users/profile/")
      .then((res) => {
        setMyUser(res.data);
        // Agar o'qituvchi bo'lsa, uning kurslarini ham yuklaymiz
        if (res.data.role === "teacher") {
          api.get("/courses/my-created/").then((c) => setCourses(c.data));
        }
      })
      .catch((err) => console.error(err));

    // Aktiv efirni tekshiramiz
    fetchStream();
  }, []);

  // --- 2. EFIRNI OLISH ---
  const fetchStream = async () => {
    try {
      const res = await api.get("/communication/stream/");
      // Agar efir bo'lsa, birinchisini olamiz
      if (res.data.length > 0) setStream(res.data[0]);
    } catch (e) {
      console.error(e);
    }
  };

  // --- 3. CHATNI YANGILAB TURISH (POLLING) ---
  useEffect(() => {
    if (!stream) return; // Efir yo'q bo'lsa, chat ham yo'q

    const fetchChat = async () => {
      try {
        // Faqat SHU efirga (?stream_id=...) tegishli xabarlarni olamiz
        const res = await api.get(
          `/communication/messages/?stream_id=${stream.id}`
        );
        setMessages(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchChat();
    const interval = setInterval(fetchChat, 2000); // Har 2 sekundda yangilash
    return () => clearInterval(interval);
  }, [stream]);

  // --- 4. AVTO-SCROLL (Chat pastga tushishi) ---
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // --- 5. XABAR YUBORISH ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !stream) return;

    try {
      // Backendga yuboramiz (stream ID bilan birga)
      await api.post("/communication/messages/", {
        content: input,
        stream: stream.id,
      });
      setInput("");
      // Darhol yangilaymiz
      const res = await api.get(
        `/communication/messages/?stream_id=${stream.id}`
      );
      setMessages(res.data);
    } catch (e) {
      alert("Xatolik: Xabar ketmadi!");
    }
  };

  // --- 6. EFIR BOSHLASH (Faqat O'qituvchi) ---
  const startStream = async () => {
    // Linkni tekshirish
    if (
      !newStreamUrl.includes("meet.google.com") &&
      !newStreamUrl.includes("zoom")
    ) {
      alert("Iltimos, to'g'ri Google Meet yoki Zoom link kiriting!");
      return;
    }
    try {
      await api.post("/communication/stream/", {
        title: newStreamTitle,
        meeting_link: newStreamUrl,
        course: selectedCourse || null, // Agar tanlangan bo'lsa
      });
      alert("Efir boshlandi! 🚀");
      fetchStream(); // Sahifani yangilash
    } catch (e) {
      alert("Xatolik yuz berdi");
    }
  };

  // --- RENDER (Ko'rinish) ---
  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* --- CHAP TOMON: VIDEO / CREATE OYNASI --- */}
        <div className="flex-1 p-4 flex flex-col relative justify-center">
          {stream ? (
            // A) AGAR EFIR KETAYOTGAN BO'LSA
            <div className="flex-1 glass-panel rounded-2xl flex flex-col items-center justify-center relative border border-white/10 shadow-2xl p-8 text-center">
              <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse border border-green-500/50">
                <span className="text-6xl">📹</span>
              </div>

              <h2 className="text-4xl font-bold text-white mb-2">
                {stream.title}
              </h2>
              <p className="text-gray-300 mb-8 max-w-md">
                {stream.course_title
                  ? `Kurs: ${stream.course_title}`
                  : "Umumiy Jonli Efir"}{" "}
                <br />
                Google Meet orqali ulaning va darsni jonli kuzating.
              </p>

              {/* MEETGA O'TISH TUGMASI */}
              <a
                href={stream.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-500 transition shadow-lg shadow-green-500/30 flex items-center gap-3 hover:scale-105"
              >
                <span>🚀</span> Join Google Meet
              </a>

              <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded text-white font-bold text-xs animate-pulse shadow-red-500/50 shadow-lg">
                ● LIVE NOW
              </div>
            </div>
          ) : (
            // B) AGAR EFIR YO'Q BO'LSA
            <div className="flex-1 glass-panel rounded-2xl flex flex-col items-center justify-center p-8 border border-white/10">
              {myUser?.role === "teacher" ? (
                // O'QITUVCHI UCHUN FORM
                <div className="w-full max-w-md text-center">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    🎥 Start Live Session
                  </h2>

                  {/* Kurs Tanlash */}
                  <select
                    className="w-full glass-input p-3 rounded-lg mb-3 text-gray-300 bg-transparent border border-white/20 option:bg-black"
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="" className="bg-gray-900">
                      Umumiy Efir (Kursga bog'lanmagan)
                    </option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id} className="bg-gray-900">
                        {c.title}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Mavzu (Masalan: React Hooks)"
                    className="w-full glass-input p-3 rounded-lg mb-3"
                    onChange={(e) => setNewStreamTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Google Meet Link (meet.google.com/...)"
                    className="w-full glass-input p-3 rounded-lg mb-6"
                    onChange={(e) => setNewStreamUrl(e.target.value)}
                  />
                  <button
                    onClick={startStream}
                    className="bg-blue-600 w-full py-3 rounded-lg text-white font-bold hover:bg-blue-500 transition shadow-lg"
                  >
                    Create Session
                  </button>
                </div>
              ) : (
                // TALABA UCHUN KUTISH EKRANI
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4 opacity-50">⏳</div>
                  <h2 className="text-xl text-white font-bold">
                    Dars hali boshlanmadi
                  </h2>
                  <p className="mt-2 text-sm">
                    O'qituvchi Google Meet linkini joylashini kuting.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- O'NG TOMON: CHAT --- */}
        <div className="w-full lg:w-96 glass-panel border-l border-white/10 flex flex-col m-4 lg:ml-0 lg:my-4 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white">Live Chat</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-gray-300">Online</span>
            </div>
          </div>

          <div
            ref={chatBoxRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
          >
            {stream ? (
              messages.length > 0 ? (
                messages.map((msg, index) => {
                  const isMe =
                    myUser && msg.sender.username === myUser.username;
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`font-bold text-[10px] ${
                            isMe ? "text-blue-300" : "text-purple-300"
                          }`}
                        >
                          {msg.sender.first_name || msg.sender.username}
                        </span>
                        <span className="text-[9px] text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm max-w-[90%] break-words shadow-sm backdrop-blur-sm ${
                          isMe
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white/10 text-gray-100 rounded-tl-none border border-white/5"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 text-sm mt-10">
                  Hali xabarlar yo'q. Birinchi bo'lib yozing!
                </p>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <span className="text-4xl mb-2">😴</span>
                <p className="text-sm">Chat faol emas</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-white/5 border-t border-white/10">
            <form onSubmit={handleSend} className="relative flex gap-2">
              <input
                type="text"
                value={input}
                disabled={!stream}
                onChange={(e) => setInput(e.target.value)}
                placeholder={stream ? "Savol bering..." : "Efir kutilmoqda..."}
                className="w-full glass-input rounded-xl pl-4 pr-12 py-3 text-sm placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!stream}
                className="p-3 bg-blue-600 rounded-xl hover:bg-blue-500 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
