import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Wind, Trash2, TreePine, Zap, BarChart3, Map, Building, ShieldAlert, BrainCircuit, Columns, ChevronRight, Mail, Phone, MapPin, Share2, MessageCircle, Video } from 'lucide-react';
import FloatingChatbot from '../components/FloatingChatbot';
export default function Home() {
  return (
    <div className="w-full flex flex-col font-sans text-gray-800 bg-white">
      
      {/* 3. HERO SECTION (MAIN BANNER) */}
      <section className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-black/60 z-0"></div>
        
        {/* Floating Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="floating-leaf" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              fontSize: `${Math.random() * 1.5 + 1}rem`
            }}>🍃</div>
          ))}
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl" data-aos="fade-up" data-aos-duration="1000">
            <div className="inline-block bg-yellow-500 text-green-950 font-extrabold px-3 py-1 rounded text-xs uppercase tracking-widest mb-6">
              Official Tracking Portal
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 h-32 md:h-auto">
              <TypeAnimation
                sequence={[
                  'Track Your City’s Sustainability', 2000, 
                  'in Real Time', 2000
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="block mb-2"
              />
              <span className="text-green-400">Not Just Promises</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 font-medium max-w-2xl">
              Real-time monitoring of Smart Cities across India
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/dashboard" className="animate-bounce hover:animate-none bg-gradient-to-r from-green-700 via-green-500 to-green-700 bg-[length:200%_auto] hover:bg-right text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.8)] transform hover:-translate-y-1 border border-green-500">
                View Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/map" className="bg-white hover:bg-gray-100 text-[#107c41] font-bold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-200">
                Explore Map
                <Map className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "WHAT'S NEW" STRIP */}
      <div className="bg-[#0b5c30] text-white py-2.5 overflow-hidden flex items-center shadow-inner">
        <div className="bg-yellow-500 text-green-950 font-bold px-4 py-1.5 text-xs uppercase tracking-widest z-10 shrink-0 shadow-md ml-4 rounded-sm">
          What's New
        </div>
        <div className="flex-1 overflow-hidden ml-4">
          <marquee className="text-sm font-semibold tracking-wide flex items-center" scrollamount="6">
            <span className="mx-6 text-green-300">•</span> Air quality improved in Pune by 12% this quarter 
            <span className="mx-6 text-green-300">•</span> New waste to energy project launched in Surat 
            <span className="mx-6 text-green-300">•</span> Citizen reports increased transparency in Indore
            <span className="mx-6 text-green-300">•</span> Ahmedabad expands green cover by 500 hectares
          </marquee>
        </div>
      </div>

      {/* 5. KPI SUMMARY SECTION */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10" data-aos="fade-in">
            <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">National Performance Overview</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* KPI 1 */}
            <div data-aos="fade-up" data-aos-delay="100" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center transform hover:-translate-y-1 transition-transform border-t-4 border-t-blue-500">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Wind className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-700 uppercase tracking-wider text-sm mb-2">Air Quality 🌫️</h3>
              <p className="text-3xl font-black text-gray-900 mb-1">68 AQI</p>
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">Good / Moderate</span>
            </div>

            {/* KPI 2 */}
            <div data-aos="fade-up" data-aos-delay="200" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center transform hover:-translate-y-1 transition-transform border-t-4 border-t-yellow-500">
              <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-700 uppercase tracking-wider text-sm mb-2">Waste Management ♻️</h3>
              <p className="text-3xl font-black text-gray-900 mb-1">82%</p>
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">Good</span>
            </div>

            {/* KPI 3 */}
            <div data-aos="fade-up" data-aos-delay="300" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center transform hover:-translate-y-1 transition-transform border-t-4 border-t-green-500">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                <TreePine className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-700 uppercase tracking-wider text-sm mb-2">Green Cover 🌳</h3>
              <p className="text-3xl font-black text-gray-900 mb-1">24%</p>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-bold">Moderate</span>
            </div>

            {/* KPI 4 */}
            <div data-aos="fade-up" data-aos-delay="400" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center transform hover:-translate-y-1 transition-transform border-t-4 border-t-orange-500">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-700 uppercase tracking-wider text-sm mb-2">Renewable Energy ⚡</h3>
              <p className="text-3xl font-black text-gray-900 mb-1">45%</p>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-bold">Moderate</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURE SECTIONS (GRID) */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-in">
            <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">Core Capabilities</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto font-medium">Comprehensive tools designed to foster sustainable urban development ecosystem.</p>
            <div className="w-24 h-1 bg-green-600 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div data-aos="fade-up" data-aos-delay="100" className="border border-gray-100 rounded-xl p-8 hover:border-green-400 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">📊 Sustainability Dashboard</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">Access real-time metrics, KPI scores, and budget tracking allocated towards sustainable growth across mapped smart cities.</p>
              <Link to="/dashboard" className="text-green-600 font-bold flex items-center hover:text-green-800">Explore <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </div>

            <div data-aos="fade-up" data-aos-delay="200" className="border border-gray-100 rounded-xl p-8 hover:border-green-400 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Map className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">🗺️ Map Monitoring</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">Visual geographic representation of pollution hotspots, civic reports, and live air quality nodes managed by the central node.</p>
              <Link to="/map" className="text-blue-600 font-bold flex items-center hover:text-blue-800">Explore <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </div>

            <div data-aos="fade-up" data-aos-delay="300" className="border border-gray-100 rounded-xl p-8 hover:border-green-400 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Building className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">🏗️ Project Tracking</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">Monitor ongoing smart city projects, budget allocation, completion states, and their estimated direct environmental impact.</p>
              <Link to="#" className="text-orange-600 font-bold flex items-center hover:text-orange-800">Explore <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </div>

            <div className="border border-gray-100 rounded-xl p-8 hover:border-green-400 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">📸 Report Issue</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">Direct channel for citizens to report localized pollution, waste pileups, or green zone violations with geotags and photos.</p>
              <Link to="/reports" className="text-red-600 font-bold flex items-center hover:text-red-800">Explore <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </div>

            <div className="border border-gray-100 rounded-xl p-8 hover:border-green-400 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">🤖 AI Insights</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">Automated processing of metrics to generate real-time AI-driven recommendations and predictive analysis for city planners.</p>
              <Link to="#" className="text-purple-600 font-bold flex items-center hover:text-purple-800">Explore <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </div>

            <div className="border border-gray-100 rounded-xl p-8 hover:border-green-400 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Columns className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">📈 City Comparison</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">Live ranking leaderboard fostering healthy competition between Smart Cities to achieve maximum Green Scores.</p>
              <Link to="/dashboard" className="text-indigo-600 font-bold flex items-center hover:text-indigo-800">Explore <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. IMAGE + CONTENT SECTION */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Empowering Citizens" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-green-900 opacity-20"></div>
                 <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg font-bold text-sm text-green-900 shadow-sm border border-white/50">
                    Jan Bhagidari (Public Participation)
                 </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                Empowering Citizens & <span className="text-green-600">Government</span>
              </h2>
              <div className="w-16 h-1 bg-green-600 mb-8 rounded-full"></div>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Empowering Citizens & Government through transparency and accountability. The Smart City Sustainability Tracker aims to bridge the gap between administrative initiatives and ground reality by integrating real-time environmental APIs with citizen-sourced data.
              </p>
              <ul className="space-y-4 text-gray-700 font-medium">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 mt-1 shrink-0"><CheckIcon /></div>
                  Hold local administrations accountable with visible KPI tracking.
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 mt-1 shrink-0"><CheckIcon /></div>
                  Participate actively by reporting issues that impact your neighborhood directly.
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 mt-1 shrink-0"><CheckIcon /></div>
                  Track budget allocations ensuring funds align with sustainable realities.
                </li>
              </ul>
              <Link to="/reports" className="mt-8 inline-block bg-white text-green-700 font-bold border-2 border-green-600 py-3 px-8 rounded-lg hover:bg-green-50 transition-colors shadow-sm">
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-[8px] border-green-600">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* About */}
            <div>
              <h3 className="text-white text-xl font-bold mb-6 flex items-center"><span className="text-2xl mr-2">🌱</span> Sustainability Tracker</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                An initiative for tracking and reporting sustainable commitments of Indian Smart Cities. Designed for transparency and active citizen engagement.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"><Share2 className="w-5 h-5"/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"><MessageCircle className="w-5 h-5"/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"><Video className="w-5 h-5"/></a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white text-lg font-bold mb-6 uppercase tracking-wider text-sm border-b border-gray-700 pb-2">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-1"/> Home</Link></li>
                <li><Link to="/dashboard" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-1"/> Dashboard</Link></li>
                <li><Link to="/map" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-1"/> Live Map</Link></li>
                <li><Link to="/reports" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-1"/> Report an Issue</Link></li>
                <li><Link to="#" className="hover:text-green-400 transition-colors flex items-center"><ChevronRight className="w-4 h-4 mr-1"/> Smart Cities Mission</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white text-lg font-bold mb-6 uppercase tracking-wider text-sm border-b border-gray-700 pb-2">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                  <span>Ministry of Urban Development<br/>Nirman Bhawan, New Delhi - 110011</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                  <span>80000 70000</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                  <span>www.sustainabletrack@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Gov Banner */}
            <div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 border-2 border-gray-500 rounded-full flex items-center justify-center text-gray-400 font-serif font-bold text-xs bg-gray-900 shrink-0">
                    GOI
                  </div>
                  <div className="ml-4">
                    <h5 className="text-white font-bold text-sm">Digital India</h5>
                    <p className="text-xs text-gray-400">Power to Empower</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  This is a demonstration portal. Data displayed may be simulated for evaluation purposes.
                </p>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-gray-800 text-sm text-center text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <p>
              &copy; {new Date().getFullYear()} Ministry of Urban Development (Demo). All Rights Reserved.
            </p>
            <div className="mt-4 md:mt-0 space-x-4">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
               <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

      <FloatingChatbot />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
  );
}
