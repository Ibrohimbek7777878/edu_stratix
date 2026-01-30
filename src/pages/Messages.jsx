import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { id: 1, type: 'group' }
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [myId, setMyId] = useState(null);
  const chatEndRef = useRef(null);

  // 1. Kontaktlarni yuklash
  useEffect(() => {
    api.get("/users/profile/").then((res) => setMyId(res.data.id));

    const loadContacts = async () => {
      try {
        const res = await api.get("/communication/contacts/");
        setContacts(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    loadContacts();
  }, []);

  // 2. Chatni yuklash (Polling)
  useEffect(() => {
    if (!activeChat) return;

    const fetchMsgs = async () => {
      try {
        // /chat/group/5/ yoki /chat/private/3/
        const res = await api.get(
          `/communication/chat/${activeChat.type}/${activeChat.id}/`,
        );
        setMessages(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchMsgs();
    const interval = setInterval(fetchMsgs, 2000);
    return () => clearInterval(interval);
  }, [activeChat]);

  // Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Xabar yuborish
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChat) return;

    try {
      await api.post(
        `/communication/chat/${activeChat.type}/${activeChat.id}/`,
        { content: input },
      );
      setInput("");
      // Darhol yangilash
      const res = await api.get(
        `/communication/chat/${activeChat.type}/${activeChat.id}/`,
      );
      setMessages(res.data);
    } catch (e) {
      alert(e.response?.data?.error || "Xatolik");
    }
  };

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full p-4 h-[calc(100vh-80px)]">
        <div className="glass-panel h-full rounded-2xl flex overflow-hidden shadow-2xl border border-white/10">
          {/* --- CHAP: KONTAKTLAR RO'YXATI --- */}
          <div className="w-1/3 border-r border-white/10 bg-white/5 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Chats</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Kurs Guruhlarni Ajratish (Agar bo'lsa) */}
              {contacts.filter((c) => c.type === "group").length > 0 && (
                <div className="px-4 py-2 text-xs text-blue-300 font-bold uppercase mt-2">
                  Course Groups
                </div>
              )}
              {contacts
                .filter((c) => c.type === "group")
                .map((c) => (
                  <div
                    key={"g" + c.id}
                    onClick={() => setActiveChat(c)}
                    className={`p-3 mx-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-white/10 ${activeChat?.id === c.id && activeChat?.type === "group" ? "bg-blue-600/30 border border-blue-500/50" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800">
                      {c.avatar ? (
                        <img
                          src={`http://127.0.0.1:8000${c.avatar}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="p-2">📚</div>
                      )}
                    </div>
                    <div className="text-white font-medium text-sm truncate">
                      {c.name}
                    </div>
                  </div>
                ))}

              {/* Shaxsiy Kontaktlar */}
              <div className="px-4 py-2 text-xs text-green-300 font-bold uppercase mt-4">
                Direct Messages
              </div>
              {contacts
                .filter((c) => c.type === "private")
                .map((c) => (
                  <div
                    key={"p" + c.id}
                    onClick={() => setActiveChat(c)}
                    className={`p-3 mx-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-white/10 ${activeChat?.id === c.id && activeChat?.type === "private" ? "bg-green-600/20 border border-green-500/50" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                      {c.avatar ? (
                        <img
                          src={`http://127.0.0.1:8000${c.avatar}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-white">
                          {c.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">
                        {c.name}
                      </div>
                      <div className="text-gray-400 text-xs">@{c.username}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* --- O'NG: CHAT OYNASI --- */}
          <div className="flex-1 flex flex-col bg-black/20">
            {activeChat ? (
              <>
                <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                  <h3 className="text-white font-bold">{activeChat.name}</h3>
                  <span className="text-xs text-gray-400 px-2 py-1 rounded bg-white/10 capitalize">
                    {activeChat.type} Chat
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {messages.map((msg, idx) => {
                    const isMe = msg.sender.id === myId;
                    return (
                      <div
                        key={idx}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        {!isMe && activeChat.type === "group" && (
                          <div className="w-8 h-8 rounded-full bg-gray-700 mr-2 overflow-hidden flex-shrink-0 border border-white/20">
                            {/* Guruhda kim yozganini rasm bilan ko'rsatish */}
                            {msg.sender.avatar ? (
                              <img
                                src={msg.sender.avatar}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center text-xs pt-1">
                                {msg.sender.username[0]}
                              </div>
                            )}
                          </div>
                        )}
                        <div>
                          {!isMe && activeChat.type === "group" && (
                            <p className="text-[10px] text-gray-400 mb-1 ml-1">
                              {msg.sender.first_name}
                            </p>
                          )}
                          <div
                            className={`px-4 py-2 rounded-2xl text-sm max-w-xs break-words ${
                              isMe
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-white/10 text-gray-200 rounded-tl-none border border-white/10"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <p
                            className={`text-[9px] mt-1 opacity-50 ${isMe ? "text-right" : "text-left"}`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t border-white/10 bg-white/5">
                  <form onSubmit={handleSend} className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 glass-input rounded-xl px-4 py-3"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 px-6 py-2 rounded-xl text-white hover:bg-blue-500 transition"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <span className="text-6xl mb-4">💬</span>
                <p>Suhbatlashish uchun chapdan tanlang</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
