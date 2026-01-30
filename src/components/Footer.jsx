import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/50">E</div>
                <span className="text-xl font-bold">EduVision</span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm">
                O'zbekistondagi eng zamonaviy ta'lim platformasi. 
                Biz bilan kelajak kasblarini o'rganing.
            </p>
        </div>

        {/* Platform Links */}
        <div>
            <h4 className="font-bold mb-4 text-lg">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/courses" className="hover:text-blue-400 transition">Browse Courses</Link></li>
                <li><Link to="/teachers" className="hover:text-blue-400 transition">Find Teachers</Link></li>
                <li><Link to="/info/pricing" className="hover:text-blue-400 transition">Pricing</Link></li>
                <li><Link to="/upload" className="hover:text-blue-400 transition">Become a Teacher</Link></li>
            </ul>
        </div>

        {/* Support Links */}
        <div>
            <h4 className="font-bold mb-4 text-lg">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/info/help" className="hover:text-blue-400 transition">Help Center</Link></li>
                <li><Link to="/info/terms" className="hover:text-blue-400 transition">Terms of Service</Link></li>
                <li><Link to="/info/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
            </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
        <p>© 2025 EduVision. All rights reserved.</p>
        <p>Created by Ibrohim</p>
      </div>
    </footer>
  );
};

export default Footer;
