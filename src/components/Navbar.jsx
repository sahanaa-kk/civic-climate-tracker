import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserCircle, Map as MapIcon, ShieldAlert, Recycle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full flex flex-col z-50 shadow-sm relative sticky top-0">
      {/* 1. TOP HEADER SECTION (Gov Style) */}
      <div className="bg-gray-50 border-b border-gray-200 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Sustainable Emblem */}
            <div className="relative flex items-center justify-center w-12 h-12 shadow-sm rounded-full bg-white p-[2px]">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Green badge background */}
                <circle cx="50" cy="50" r="48" fill="#6CB42C" />
                
                {/* Inner dashed/solid rings */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="26" fill="none" stroke="white" strokeWidth="1.5" />

                {/* Text Top */}
                <path id="top-curve" d="M 18 50 A 32 32 0 0 1 82 50" fill="none" />
                <text fill="white" fontSize="9.5" fontWeight="bold" letterSpacing="1.2" fontFamily="sans-serif">
                  <textPath href="#top-curve" startOffset="50%" textAnchor="middle">SUSTAINABLE</textPath>
                </text>

                {/* Text Bottom */}
                <path id="bottom-curve" d="M 82 50 A 32 32 0 0 1 18 50" fill="none" />
                <text fill="white" fontSize="9.5" fontWeight="bold" letterSpacing="1.2" fontFamily="sans-serif">
                  <textPath href="#bottom-curve" startOffset="50%" textAnchor="middle">SUSTAINABLE</textPath>
                </text>

                {/* Dots separating the text */}
                <circle cx="14" cy="50" r="2" fill="white" />
                <circle cx="86" cy="50" r="2" fill="white" />
              </svg>
              <Recycle className="w-5 h-5 text-white z-10" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col border-l-2 border-gray-300 pl-4">
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight uppercase leading-tight">
                Smart City Sustainability Tracker
              </h1>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
                Ministry of Urban Development
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">


            <div className="flex space-x-2 text-xs font-bold">
               <span className="cursor-pointer hover:underline text-gray-800">A-</span>
               <span className="cursor-pointer hover:underline text-gray-800">A</span>
               <span className="cursor-pointer hover:underline text-gray-800">A+</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION BAR (Green) */}
      <nav className="bg-[#107c41] text-white shadow-md w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between overflow-x-auto">
          {/* Mobile Title (visible only on mobile) */}
          <div className="md:hidden flex items-center font-bold text-sm marquee-container whitespace-nowrap">
            <span className="mr-2">🌱</span> Smart City Sustainability - MoUD
          </div>

          <div className="hidden md:flex items-center h-full">
            {user ? (
              <>
                 <Link to="/" className={`px-4 h-full flex items-center text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-b-4 ${isActive('/') ? 'bg-green-800 border-yellow-400' : 'border-transparent hover:bg-green-700 hover:border-green-400'}`}>Home</Link>
                 <Link to="/about" className={`px-4 h-full flex items-center text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-b-4 ${isActive('/about') ? 'bg-green-800 border-yellow-400' : 'border-transparent hover:bg-green-700 hover:border-green-400'}`}>About</Link>
                 
                 <Link to="/dashboard" className={`px-4 h-full flex items-center text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-b-4 ${isActive('/dashboard') ? 'bg-green-800 border-yellow-400' : 'border-transparent hover:bg-green-700 hover:border-green-400'}`}>Dashboard</Link>
                 <Link to="/projects" className={`px-4 h-full flex items-center text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-b-4 ${isActive('/projects') ? 'bg-green-800 border-yellow-400' : 'border-transparent hover:bg-green-700 hover:border-green-400'}`}>Projects</Link>
                 
                 <Link to="/reports" state={{ showReportForm: true }} className={`px-4 h-full flex items-center text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-b-4 ${isActive('/reports') ? 'bg-green-800 border-yellow-400' : 'border-transparent hover:bg-green-700 hover:border-green-400'}`}>Reports</Link>
                 
                 <button onClick={handleLogout} className="ml-4 px-3 py-1 flex items-center text-sm font-bold text-red-100 hover:text-white hover:bg-red-600 rounded-md transition-colors">
                   <LogOut className="w-4 h-4 mr-2" /> Logout
                 </button>
              </>
            ) : (
                 <Link to="/login" className={`px-4 h-full flex items-center text-sm font-bold uppercase tracking-wider transition-colors duration-200 border-b-4 ${isActive('/login') ? 'bg-green-800 border-yellow-400' : 'border-transparent hover:bg-green-700 hover:border-green-400'}`}>Login</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
