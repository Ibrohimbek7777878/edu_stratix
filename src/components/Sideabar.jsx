import React from 'react';
import { Home, Compass, Bookmark, Settings, LogOut, Video, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // Link va useLocation qo'shildi

const Sidebar = () => {
  const location = useLocation(); // Hozir qaysi sahifada ekanligini bilish uchun

  const menuItems = [
    { icon: <Home size={22} />, label: "Bosh sahifa", path: "/" },
    { icon: <Compass size={22} />, label: "Kashf qilish", path: "/explore" },
    { icon: <Video size={22} />, label: "Mening darslarim", path: "/my-courses" },
    { icon: <Bookmark size={22} />, label: "Saqlanganlar", path: "/saved" },
    { icon: <Settings size={22} />, label: "Sozlamalar", path: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white border-r border-blue-100 flex flex-col justify-between overflow-y-auto hidden md:flex z-40">
      <div className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link 
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-blue-100">
        <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-colors">
          <LogOut size={22} />
          <span className="font-medium">Chiqish</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;