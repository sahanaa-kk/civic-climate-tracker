import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (role) => {
    login(role);
    if (role === 'admin') navigate('/dashboard');
    else navigate('/');
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError('Email and password are required.');
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      return setError('Please enter a valid email address.');
    }

    if (email === 'admin@gov.in' && password === 'admin123') {
      login('admin');
      navigate('/dashboard');
    } else {
      setError('Invalid admin credentials. (Hint: admin@gov.in / admin123)');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#107c41] py-6 px-8 text-center">
          <h2 className="text-2xl font-extrabold text-white uppercase tracking-widest">Login</h2>
          <p className="text-green-100 mt-2 text-sm">Select your role to continue</p>
        </div>
        {!showAdminLogin ? (
          <div className="p-8 space-y-6">
            <button
              onClick={() => handleLogin('user')}
              className="w-full flex items-center justify-center p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 hover:border-green-500 transition-all group"
            >
              <div className="bg-green-100 p-3 rounded-full mr-4 group-hover:bg-green-200 transition-colors">
                <User className="w-6 h-6 text-green-700" />
              </div>
              <div className="text-left flex-1">
                <span className="block font-bold text-gray-900 text-lg">Citizen (User)</span>
                <span className="block text-sm text-gray-500">Report issues and view map</span>
              </div>
            </button>

            <button
              onClick={() => setShowAdminLogin(true)}
              className="w-full flex items-center justify-center p-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-500 transition-all group"
            >
              <div className="bg-blue-100 p-3 rounded-full mr-4 group-hover:bg-blue-200 transition-colors">
                <Shield className="w-6 h-6 text-blue-700" />
              </div>
              <div className="text-left flex-1">
                <span className="block font-bold text-gray-900 text-lg">Administrator</span>
                <span className="block text-sm text-gray-500">Manage projects and view dashboard</span>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleAdminSubmit} className="p-8 space-y-5">
            <button 
              type="button" 
              onClick={() => { setShowAdminLogin(false); setError(''); }}
              className="flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Role Selection
            </button>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-semibold border border-red-200">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="admin@gov.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Secure Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
