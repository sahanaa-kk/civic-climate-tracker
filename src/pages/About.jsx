import { useState, useEffect } from 'react';
import { ShieldAlert, Map, Building, BarChart3, BrainCircuit, Columns, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';

export default function About() {
  const [activeSection, setActiveSection] = useState('about');

  // Simple intersection observer to highlight active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => observer.observe(section));

    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'about', label: 'About Project' },
    { id: 'vision', label: 'Vision & Mission' },
    { id: 'features', label: 'Key Features' },
    { id: 'initiative', label: 'Smart City Initiative' },
    { id: 'data', label: 'Data Sources' },
    { id: 'impact', label: 'Impact & Benefits' }
  ];

  return (
    <div className="w-full flex flex-col font-sans bg-gray-50 pb-0">
      
      {/* 1. HERO BANNER (TOP SECTION) */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden border-b-4 border-yellow-500">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1473625247510-8ceb1760a4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
        ></div>
        <div className="absolute inset-0 bg-[#0f5c2e]/80"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block bg-white text-green-900 font-extrabold px-4 py-1.5 rounded-sm text-sm uppercase tracking-widest mb-6 shadow-sm">
            Ministry of Urban Development
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight shadow-sm">
            Building Transparent and Sustainable Smart Cities
          </h1>
          <p className="text-xl md:text-2xl text-yellow-100 font-medium max-w-3xl mx-auto shadow-sm">
            Tracking real implementation of sustainability initiatives across India
          </p>
        </div>
      </section>

      {/* TWO COLUMN LAYOUT */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 w-full flex flex-col lg:flex-row gap-8">
        
        {/* 2. LEFT SIDE NAVIGATION PANEL */}
        <div className="w-full lg:w-1/4 shrink-0">
          <div className="sticky top-28 bg-white border border-gray-200 shadow-md rounded-sm overflow-hidden">
            <div className="bg-[#107c41] text-white p-4">
              <h3 className="font-extrabold text-lg uppercase tracking-wider">In This Section</h3>
            </div>
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center text-left px-5 py-4 border-b border-gray-100 font-bold text-sm uppercase transition-colors duration-200
                    ${activeSection === item.id 
                      ? 'bg-green-50 text-green-800 border-l-4 border-l-green-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-green-700 border-l-4 border-l-transparent'
                    }`}
                >
                  <ChevronRight className={`w-4 h-4 mr-2 ${activeSection === item.id ? 'text-green-600' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 3. MAIN CONTENT AREA (RIGHT SIDE) */}
        <div className="w-full lg:w-3/4 bg-white border border-gray-200 shadow-sm p-8 md:p-12 mb-16 rounded-sm">
          
          {/* A) About Project */}
          <section id="about" className="content-section mb-16 scroll-mt-32">
            <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-6 border-b-2 border-green-600 pb-2 inline-block">
              About Project
            </h2>
            <div className="prose max-w-none text-gray-700 space-y-6">
              <div className="bg-red-50 p-6 border-l-4 border-red-500 rounded-r-md">
                <h3 className="text-xl font-bold text-red-800 mb-3">The Problem</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Cities frequently announce ambitious sustainability goals.</li>
                  <li>There is a critical lack of transparency and tracking for these initiatives.</li>
                  <li>Data regarding environmental impact and project execution remains highly fragmented.</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 border-l-4 border-green-600 rounded-r-md">
                <h3 className="text-xl font-bold text-green-900 mb-3">The Solution</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>A centralized, real-time tracking platform for urban environments.</li>
                  <li>Seamless integration of APIs, live maps, and direct citizen reports.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* B) Vision & Mission */}
          <section id="vision" className="content-section mb-16 scroll-mt-32">
            <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-6 border-b-2 border-green-600 pb-2 inline-block">
              Vision & Mission
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 border border-gray-200 p-8 rounded-sm shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -z-0 opacity-50"></div>
                <h3 className="text-xl font-extrabold text-blue-900 mb-4 uppercase tracking-widest relative z-10">Vision</h3>
                <p className="text-lg text-gray-800 font-medium italic relative z-10">
                  "To create transparent, accountable, and data-driven smart cities."
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-8 rounded-sm shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-bl-full -z-0 opacity-50"></div>
                <h3 className="text-xl font-extrabold text-green-900 mb-4 uppercase tracking-widest relative z-10">Mission</h3>
                <ul className="list-disc pl-5 text-gray-700 font-medium space-y-2 relative z-10">
                  <li>Provide real-time sustainability tracking.</li>
                  <li>Enable active citizen participation.</li>
                  <li>Prevent systemic greenwashing.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* C) Key Features */}
          <section id="features" className="content-section mb-16 scroll-mt-32">
            <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-6 border-b-2 border-green-600 pb-2 inline-block">
              Key Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mr-4 shrink-0"><BarChart3 /></div>
                <span className="font-bold text-gray-800 shrink-0">Urban Sustainability Dashboard</span>
              </div>
              <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-full mr-4 shrink-0"><Map /></div>
                <span className="font-bold text-gray-800 shrink-0">Geospatial Map Monitoring</span>
              </div>
              <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full mr-4 shrink-0"><Building /></div>
                <span className="font-bold text-gray-800 shrink-0">Project Tracking System</span>
              </div>
              <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center rounded-full mr-4 shrink-0"><ShieldAlert /></div>
                <span className="font-bold text-gray-800 shrink-0">Citizen Issue Reporting</span>
              </div>
              <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 flex items-center justify-center rounded-full mr-4 shrink-0"><BrainCircuit /></div>
                <span className="font-bold text-gray-800 shrink-0">AI-Based Reality Check</span>
              </div>
              <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full mr-4 shrink-0"><Columns /></div>
                <span className="font-bold text-gray-800 shrink-0">Comparative Analytics</span>
              </div>
            </div>
          </section>

          {/* D) Smart City Initiative */}
          <section id="initiative" className="content-section mb-16 scroll-mt-32">
            <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-6 border-b-2 border-green-600 pb-2 inline-block">
              Smart City Initiative
            </h2>
            <div className="bg-gray-50 p-6 border border-gray-200 rounded-sm">
              <p className="text-gray-700 leading-relaxed mb-6">
                This tracking platform specifically targets selected major urban centers under the National Smart Cities Mission to pilot and demonstrate comprehensive environmental tracking.
              </p>
              
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">Focus Cities:</h4>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-green-100 text-green-800 px-4 py-2 font-bold rounded-sm border border-green-200 shadow-sm">Pune</span>
                  <span className="bg-green-100 text-green-800 px-4 py-2 font-bold rounded-sm border border-green-200 shadow-sm">Surat</span>
                  <span className="bg-green-100 text-green-800 px-4 py-2 font-bold rounded-sm border border-green-200 shadow-sm">Indore</span>
                  <span className="bg-green-100 text-green-800 px-4 py-2 font-bold rounded-sm border border-green-200 shadow-sm">Ahmedabad</span>
                </div>
              </div>
              
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li><strong className="text-gray-900">Real-time monitoring:</strong> Direct ingestion of node data and sensor tracking.</li>
                <li><strong className="text-gray-900">Data-driven decision making:</strong> Analytics tools for planners and municipal boards.</li>
                <li><strong className="text-gray-900">Accountability system:</strong> Public-facing ledgers matching funding to outcomes.</li>
              </ul>
            </div>
          </section>

          {/* E) Data Sources */}
          <section id="data" className="content-section mb-16 scroll-mt-32">
            <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-6 border-b-2 border-green-600 pb-2 inline-block">
              Data Sources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-sm bg-gray-50">
                <div className="w-16 h-16 bg-blue-100 mx-auto rounded-full flex items-center justify-center text-blue-600 mb-4 font-extrabold text-xl">1</div>
                <h4 className="font-bold text-gray-900 mb-2">Government APIs</h4>
                <p className="text-sm text-gray-600">Official live feeds of air quality metrics and waste processing data.</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-sm bg-gray-50">
                <div className="w-16 h-16 bg-blue-100 mx-auto rounded-full flex items-center justify-center text-blue-600 mb-4 font-extrabold text-xl">2</div>
                <h4 className="font-bold text-gray-900 mb-2">Citizen Reports</h4>
                <p className="text-sm text-gray-600">Crowdsourced geospatial data detailing ground reality and violations.</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-sm bg-gray-50">
                <div className="w-16 h-16 bg-blue-100 mx-auto rounded-full flex items-center justify-center text-blue-600 mb-4 font-extrabold text-xl">3</div>
                <h4 className="font-bold text-gray-900 mb-2">Project Datasets</h4>
                <p className="text-sm text-gray-600">Budget allocation, spend, and completion status of civic projects.</p>
              </div>
            </div>
          </section>

          {/* F) Impact & Benefits */}
          <section id="impact" className="content-section scroll-mt-32">
            <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-6 border-b-2 border-green-600 pb-2 inline-block">
              Impact & Benefits
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-4 mt-0.5 shrink-0">✓</div>
                <div>
                  <h4 className="font-bold text-gray-900">Improves Administrative Transparency</h4>
                  <p className="text-gray-600 text-sm">Makes governmental data easily accessible and understandable by the public.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-4 mt-0.5 shrink-0">✓</div>
                <div>
                  <h4 className="font-bold text-gray-900">Increases Citizen Engagement</h4>
                  <p className="text-gray-600 text-sm">Provides actionable ways for citizens to participate in managing their local environment.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-4 mt-0.5 shrink-0">✓</div>
                <div>
                  <h4 className="font-bold text-gray-900">Guides Decision-Making</h4>
                  <p className="text-gray-600 text-sm">Equips planners with the ground-truth data required for efficient resource allocation.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-4 mt-0.5 shrink-0">✓</div>
                <div>
                  <h4 className="font-bold text-gray-900">Detects Policy Gaps</h4>
                  <p className="text-gray-600 text-sm">Automatically flags inconsistencies and gaps between theoretical claims and ground reality.</p>
                </div>
              </li>
            </ul>
          </section>

        </div>
      </div>

      {/* 5. FOOTER */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 border-t-4 border-yellow-500 mt-auto w-full">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-gray-700 pb-8">
            
            {/* Contact Info */}
            <div>
              <h4 className="text-white text-lg font-bold mb-4 uppercase tracking-wider border-b border-gray-700 pb-2 inline-block">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
                  <span>Ministry of Urban Development<br/>Nirman Bhawan, New Delhi - 110011</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
                  <span>80000 70000</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
                  <span>www.sustainabletrack@gmail.com</span>
                </li>
              </ul>
            </div>
            
            {/* Disclaimer */}
            <div className="md:col-span-2">
               <h4 className="text-white text-lg font-bold mb-4 uppercase tracking-wider border-b border-gray-700 pb-2 inline-block">Disclaimer</h4>
               <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                 The information provided on this platform is collected through a combination of public APIs and citizen submissions. While all efforts are made to ensure accuracy and real-time syncing, this portal operates independently from official legal directives unless explicitly stated.
               </p>
               <div className="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded-sm">
                 <h5 className="font-bold text-yellow-500 uppercase tracking-widest text-xs mb-1">Project Note</h5>
                 <p className="text-yellow-100/80 text-sm font-medium">This is a hackathon prototype for Smart City Sustainability Tracking.</p>
               </div>
            </div>

          </div>
          
          <div className="text-center text-xs text-gray-500 font-medium tracking-wide">
            &copy; {new Date().getFullYear()} Smart City Sustainability Tracker. Developed for demonstration.
          </div>
        </div>
      </footer>

    </div>
  );
}
