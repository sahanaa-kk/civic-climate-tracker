import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Building, CheckCircle, Clock, AlertCircle, MapPin, X, Edit } from 'lucide-react';
import ProjectMap from '../components/ProjectMap';
import { useAuth } from '../context/AuthContext';

const STATE_CENTERS = {
  "Andaman and Nicobar Islands": [11.7401, 92.6586],
  "Andhra Pradesh": [15.9129, 79.7400],
  "Arunachal Pradesh": [28.2180, 94.7278],
  "Assam": [26.2006, 92.9376],
  "Bihar": [25.0961, 85.3131],
  "Chandigarh": [30.7333, 76.7794],
  "Chhattisgarh": [21.2787, 81.8661],
  "Dadra and Nagar Haveli and Daman and Diu": [20.4283, 72.8397],
  "Delhi": [28.7041, 77.1025],
  "Goa": [15.2993, 74.1240],
  "Gujarat": [22.2587, 71.1924],
  "Haryana": [29.0588, 76.0856],
  "Himachal Pradesh": [31.1048, 77.1666],
  "Jammu and Kashmir": [33.7782, 76.5762],
  "Jharkhand": [23.6102, 85.2799],
  "Karnataka": [15.3173, 75.7139],
  "Kerala": [10.8505, 76.2711],
  "Ladakh": [34.1526, 77.5771],
  "Lakshadweep": [10.5667, 72.6417],
  "Madhya Pradesh": [22.9734, 78.6569],
  "Maharashtra": [19.7515, 75.7139],
  "Manipur": [24.6637, 93.9063],
  "Meghalaya": [25.4670, 91.3662],
  "Mizoram": [23.1645, 92.9376],
  "Nagaland": [26.1584, 94.5624],
  "Odisha": [20.9517, 85.0985],
  "Puducherry": [11.9416, 79.8083],
  "Punjab": [31.1471, 75.3412],
  "Rajasthan": [27.0238, 74.2179],
  "Sikkim": [27.5330, 88.5122],
  "Tamil Nadu": [11.1271, 78.6569],
  "Telangana": [18.1124, 79.0193],
  "Tripura": [23.9408, 91.9882],
  "Uttar Pradesh": [26.8467, 80.9462],
  "Uttarakhand": [30.0668, 79.0193],
  "West Bengal": [22.9868, 87.8550]
};

const INDIAN_STATES = Object.keys(STATE_CENTERS);

const CATEGORIES = ["Road", "Park", "Waste", "Water", "Energy", "Infrastructure", "Transport", "Healthcare"];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getStatus(progress) {
  if (Number(progress) === 0) return "Pending";
  if (Number(progress) < 100) return "Ongoing";
  return "Completed";
}

function generateInitialData(count = 1000) {
  const data = [];
  
  for (let i = 1; i <= count; i++) {
    const states = Object.keys(STATE_CENTERS);
    const state = states[Math.floor(Math.random() * states.length)];
    const stateCenter = STATE_CENTERS[state];
    
    // Slight deviation around the state central coordinate for map spread
    const lat = stateCenter[0] + (Math.random() - 0.5) * 3;
    const lon = stateCenter[1] + (Math.random() - 0.5) * 3;
    
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    const budget_allocated = randomBetween(5000000, 500000000);
    let progress;
    const r = Math.random();
    if (r < 0.20) progress = 0; // 20% chance of Pending
    else if (r < 0.35) progress = 100; // 15% chance of Completed
    else progress = randomBetween(1, 99); // 65% chance of Ongoing

    const budget_spent = Math.floor((budget_allocated * progress) / 100) + randomBetween(-100000, 100000); // realistic slight deviation
    
    const start = new Date(2023, randomBetween(0, 11), randomBetween(1, 28));
    const end = new Date(start);
    end.setMonth(start.getMonth() + randomBetween(6, 36));

    const milestones = ["Planning Phase", "Foundation Setup", "Structural Development", "Final Finishing", "Testing & Handover"];
    const currentPhase = progress === 0 ? milestones[0] : (progress === 100 ? milestones[4] : milestones[Math.floor(progress/25)]);

    const project = {
      project_id: "P-" + randomBetween(10000, 99999) + i,
      project_name: `${state} Regional ${category} Initiative`,
      state: state,
      category: category,
      budget_allocated: budget_allocated,
      budget_spent: Math.max(0, budget_spent),
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lon.toFixed(6)),
      progress_percentage: progress,
      current_status: getStatus(progress),
      expected_completion_phase: currentPhase
    };

    data.push(project);
  }
  return data;
}

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const initial = generateInitialData(200); // 200 projects for rich data
    setProjects(initial);
    localStorage.setItem('civic_projects', JSON.stringify(initial));
  }, []);

  const saveProjects = (newProjects) => {
    setProjects(newProjects);
    localStorage.setItem('civic_projects', JSON.stringify(newProjects));
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) || p.project_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchState = stateFilter === "All" || p.state === stateFilter;
      const matchStatus = statusFilter === "All" || p.current_status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchSearch && matchState && matchStatus;
    }).sort((a,b) => new Date(b.start_date) - new Date(a.start_date));
  }, [projects, searchTerm, stateFilter, statusFilter]);

  const stats = useMemo(() => {
    let ongoing = 0;
    let completed = 0;
    let pending = 0;
    projects.forEach(p => {
      if (p.current_status === 'Ongoing') ongoing++;
      else if (p.current_status === 'Completed') completed++;
      else pending++;
    });
    return { total: projects.length, ongoing, completed, pending };
  }, [projects]);

  const [formData, setFormData] = useState({
    project_name: "",
    state: INDIAN_STATES[0],
    category: CATEGORIES[0],
    budget_allocated: "",
    budget_spent: "0",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    progress_percentage: "0"
  });

  const openAddModal = () => {
    setFormData({ project_name: "", state: INDIAN_STATES[0], category: CATEGORIES[0], budget_allocated: "", budget_spent: "0", start_date: new Date().toISOString().split("T")[0], end_date: "", progress_percentage: "0" });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditClick = (project) => {
    setFormData({
      project_name: project.project_name,
      state: project.state,
      category: project.category,
      budget_allocated: project.budget_allocated.toString(),
      budget_spent: project.budget_spent.toString(),
      start_date: project.start_date,
      end_date: project.end_date,
      progress_percentage: project.progress_percentage.toString()
    });
    setEditingProjectId(project.project_id);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      const stateCenter = STATE_CENTERS[formData.state];
      // Pick random location spread around the explicit state center
      const lat = stateCenter[0] + (Math.random() - 0.5) * 2.5;
      const lon = stateCenter[1] + (Math.random() - 0.5) * 2.5;

      const newProject = {
        project_id: "P-" + Date.now().toString().slice(-6),
        project_name: formData.project_name,
        state: formData.state,
        category: formData.category,
        budget_allocated: Number(formData.budget_allocated),
        budget_spent: Number(formData.budget_spent),
        start_date: formData.start_date,
        end_date: formData.end_date,
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lon.toFixed(6)),
        progress_percentage: Number(formData.progress_percentage),
        current_status: getStatus(formData.progress_percentage),
        expected_completion_phase: "Planning Phase"
      };
      
      saveProjects([newProject, ...projects]);
    } else {
      const updatedProjects = projects.map(p => {
        if (p.project_id === editingProjectId) {
          const milestones = ["Planning Phase", "Foundation Setup", "Structural Development", "Final Finishing", "Testing & Handover"];
          const prog = Number(formData.progress_percentage);
          const currentPhase = prog === 0 ? milestones[0] : (prog === 100 ? milestones[4] : milestones[Math.floor(prog/25)]);

          return {
            ...p,
            project_name: formData.project_name,
            state: formData.state,
            category: formData.category,
            budget_allocated: Number(formData.budget_allocated),
            budget_spent: Number(formData.budget_spent),
            start_date: formData.start_date,
            end_date: formData.end_date,
            progress_percentage: prog,
            current_status: getStatus(prog),
            expected_completion_phase: currentPhase
          };
        }
        return p;
      });
      saveProjects(updatedProjects);
    }

    setIsModalOpen(false);
    setEditingProjectId(null);
    setFormData({ project_name: "", state: INDIAN_STATES[0], category: CATEGORIES[0], budget_allocated: "", budget_spent: "0", start_date: new Date().toISOString().split("T")[0], end_date: "", progress_percentage: "0" });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 h-full min-h-screen">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 border-b-4 border-green-600 pb-1 inline-block">Smart City Projects</h1>
          <p className="text-gray-500 mt-2 font-medium">Tracking infrastructure and sustainability initiatives across all Indian states.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={openAddModal}
            className="bg-[#107c41] hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Project
          </button>
        )}
      </div>

      {/* KPI DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-t-4 border-t-gray-800 flex items-center">
          <div className="w-14 h-14 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center mr-4 shrink-0"><Building className="w-7 h-7" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Projects</p>
            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-t-4 border-t-yellow-500 flex items-center">
          <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mr-4 shrink-0"><Clock className="w-7 h-7" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ongoing</p>
            <p className="text-3xl font-black text-gray-900">{stats.ongoing}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-t-4 border-t-green-500 flex items-center">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mr-4 shrink-0"><CheckCircle className="w-7 h-7" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Completed</p>
            <p className="text-3xl font-black text-gray-900">{stats.completed}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-t-4 border-t-red-500 flex items-center">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mr-4 shrink-0"><AlertCircle className="w-7 h-7" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pending (Planned)</p>
            <p className="text-3xl font-black text-gray-900">{stats.pending}</p>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH ROW */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by project name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="w-[200px]">
          <select 
             value={stateFilter} 
             onChange={e => setStateFilter(e.target.value)}
             className="w-full text-sm rounded bg-gray-50 border border-gray-200 focus:ring-green-500 py-2.5 px-3"
          >
             <option value="All">All States</option>
             {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="w-[200px]">
          <select 
             value={statusFilter} 
             onChange={e => setStatusFilter(e.target.value)}
             className="w-full text-sm rounded bg-gray-50 border border-gray-200 focus:ring-green-500 py-2.5 px-3"
          >
             <option value="All">All Status</option>
             <option value="Pending">Pending</option>
             <option value="Ongoing">Ongoing</option>
             <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* MAP ROW */}
      <div data-aos="zoom-in" data-aos-duration="800" className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8" style={{ height: '500px'}}>
         <ProjectMap projects={filteredProjects} cityName={null} />
      </div>

      {/* PROJECTS TABLE */}
      <div data-aos="fade-up" data-aos-delay="200" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-extrabold">
                <th className="p-4">Project ID & Name</th>
                <th className="p-4">State</th>
                <th className="p-4">Timeline</th>
                <th className="p-4">Budget Setup</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 w-32">Progress</th>
                {user?.role === 'admin' && <th className="p-4 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.length === 0 ? (
                <tr><td colSpan={user?.role === 'admin' ? "7" : "6"} className="p-8 text-center text-gray-500 font-medium">No projects found matching criteria</td></tr>
              ) : null}
              {filteredProjects.map(proj => (
                <tr key={proj.project_id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900 line-clamp-1">{proj.project_name}</p>
                    <p className="text-xs font-mono text-gray-500 mt-1">{proj.project_id} • {proj.category}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-sm font-semibold text-gray-700">
                      <MapPin className="w-4 h-4 mr-1 text-green-600 shrink-0" />
                      {proj.state}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div><span className="text-xs text-gray-400 mr-1">Start:</span>{proj.start_date}</div>
                    <div><span className="text-xs text-gray-400 mr-1">End:</span>{proj.end_date}</div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(proj.budget_allocated)}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatCurrency(proj.budget_spent)} spent</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                      proj.current_status === 'Ongoing' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      proj.current_status === 'Completed' ? 'bg-green-100 text-green-800 border border-green-200' :
                      'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {proj.current_status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                       <div 
                         className={`h-2 rounded-full ${proj.progress_percentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                         style={{ width: `${proj.progress_percentage}%` }}
                       ></div>
                    </div>
                    <p className="text-right text-xs font-bold text-gray-500 mt-1">{proj.progress_percentage}%</p>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleEditClick(proj)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-md hover:bg-blue-50"
                        title="Edit Project"
                      >
                        <Edit className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[500] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className={`text-white p-5 flex justify-between items-center ${modalMode === 'edit' ? 'bg-blue-600' : 'bg-[#107c41]'}`}>
              <h2 className="text-xl font-extrabold uppercase tracking-widest">{modalMode === 'edit' ? 'Edit Project' : 'Register New Project'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingProjectId(null); }} className={`p-1 rounded-md transition-colors ${modalMode === 'edit' ? 'hover:bg-blue-800' : 'hover:bg-green-800'}`}><X className="w-6 h-6"/></button>
            </div>
            
            <form onSubmit={handleModalSubmit} className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Project Name</label>
                  <input required type="text" value={formData.project_name} onChange={e => setFormData({...formData, project_name: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500" placeholder="e.g. Pune Smart Traffic System" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">State</label>
                  <select value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500">
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Budget Allocated (₹)</label>
                  <input required type="number" min="0" value={formData.budget_allocated} onChange={e => setFormData({...formData, budget_allocated: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Budget Spent (₹)</label>
                  <input required type="number" min="0" value={formData.budget_spent} onChange={e => setFormData({...formData, budget_spent: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Start Date</label>
                  <input required type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">End Date</label>
                  <input required type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500" />
                </div>

                <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Project Progress ({formData.progress_percentage}%) <span className="float-right text-gray-500 font-normal">Status: {getStatus(formData.progress_percentage)}</span></label>
                  <input type="range" min="0" max="100" value={formData.progress_percentage} onChange={e => setFormData({...formData, progress_percentage: e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
                </div>

              </div>
              
              <div className="mt-8 flex justify-end gap-3 pb-2">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingProjectId(null); }} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
                <button type="submit" className={`px-6 py-2.5 text-white font-bold rounded-md shadow-sm transition-colors ${modalMode === 'edit' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                  {modalMode === 'edit' ? 'Update Project' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
