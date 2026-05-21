import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ReportDashboard from './pages/ReportDashboard';
import MapView from './pages/MapView';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
        <main className="flex-1 w-full bg-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8"><CitizenDashboard /></div></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8"><ReportDashboard /></div></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8"><MapView /></div></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8"><AdminPanel /></div></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  </AuthProvider>
  );
}

export default App;
