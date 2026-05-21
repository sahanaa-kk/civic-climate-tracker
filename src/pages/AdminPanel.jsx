import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import AnalyticsCharts from '../components/AnalyticsCharts';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // MOCK DATA BASED ON PROMPT SCHEMA
  const reports = [
    { report_id: 'R101', user_id: 'U99', category: 'waste', description: 'Overflowing dumpsters near the park', location: '40.72, -73.98', ai_verified: true, status: 'submitted', created_at: '2026-03-24' },
    { report_id: 'R102', user_id: 'U42', category: 'pollution', description: 'Chemical smell from factory', location: '40.73, -74.01', ai_verified: false, status: 'under_review', created_at: '2026-03-23' },
  ];

  const projects = [
    { project_id: 'P01', name: 'Downtown Solar Grid', city_id: 'C1', status: 'ongoing', budget_used: '45%', ai_reality_score: 95 },
    { project_id: 'P02', name: 'Eastside Park Expansion', city_id: 'C1', status: 'completed', budget_used: '100%', ai_reality_score: 45 },
  ];

  const cities = [
    { city_id: 'C1', name: 'Bengaluru', aqi: 152, waste_index: 68, green_cover: '28%', trust_score: 85 },
    { city_id: 'C2', name: 'Delhi', aqi: 312, waste_index: 55, green_cover: '18%', trust_score: 72 }
  ];

  const users = [
    { user_id: 'U99', name: 'Jane Doe', email: 'jane@example.com', role: 'user', trust_score: 92 },
    { user_id: 'U42', name: 'John Smith', email: 'john@example.com', role: 'user', trust_score: 65 },
    { user_id: 'A01', name: 'Admin Guy', email: 'admin@gov.in', role: 'admin', trust_score: 100 },
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center px-4 py-4 bg-white shadow-sm rounded-lg border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
          <p className="text-sm text-gray-500">Manage civic data, review reports, and monitor AI alerts.</p>
        </div>
      </header>

      {/* TABS */}
      <div className="bg-white border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-4" aria-label="Tabs">
          {['dashboard', 'reports', 'projects', 'cities', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                ${activeTab === tab ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">City Analytics Dashboard</h2>
            <AnalyticsCharts />
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Citizen Reports</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Verified</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((r) => (
                  <tr key={r.report_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.report_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-gray-900">{r.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{r.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">{r.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                      {r.ai_verified ? <CheckCircle className="text-green-500 w-5 h-5" /> : <AlertTriangle className="text-yellow-500 w-5 h-5" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-2">Approve</button>
                      <button className="text-red-600 hover:text-red-900">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">City Projects</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((p) => (
                  <tr key={p.project_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.project_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{p.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.budget_used}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-md font-bold ${p.ai_reality_score > 70 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                        {p.ai_reality_score}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'cities' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">City Statistics</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Air Quality</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Green Cover</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trust Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cities.map((c) => (
                  <tr key={c.city_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.aqi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.waste_index}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.green_cover}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{c.trust_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">System Users</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trust Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.user_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{u.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{u.trust_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
