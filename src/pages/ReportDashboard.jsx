import { useState, useEffect } from 'react';
import { ShieldAlert, BarChart3, MapPin, List } from 'lucide-react';
// We'll import these when we build them:
import CitizenReportForm from '../components/CitizenReportForm';
import IssueAnalytics from '../components/IssueAnalytics';
import ReportsMap from '../components/ReportsMap';
import RecentReports from '../components/RecentReports';
import LocationSelect from '../components/LocationSelect';
import { useLocationContext } from '../context/LocationContext';

const initialMockReports = [];

export default function ReportDashboard() {
  const [reports, setReports] = useState([]);
  const { selectedState, selectedDistrict, selectedArea } = useLocationContext();

  useEffect(() => {
    // Load from localStorage or initialize
    const saved = localStorage.getItem('civic_reports');
    if (saved) {
      setReports(JSON.parse(saved));
    } else {
      localStorage.setItem('civic_reports', JSON.stringify(initialMockReports));
      setReports(initialMockReports);
    }
  }, []);

  const addReport = (newReport) => {
    // Inject current hierarchical context to the report
    const enrichedReport = {
      ...newReport,
      hierarchy: {
        state: selectedState,
        district: selectedDistrict,
        area: selectedArea
      }
    };
    const updated = [enrichedReport, ...reports];
    setReports(updated);
    localStorage.setItem('civic_reports', JSON.stringify(updated));
  };

  const updateReportStatus = (id, newStatus) => {
    const updated = reports.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setReports(updated);
    localStorage.setItem('civic_reports', JSON.stringify(updated));
  };

  const deleteReport = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this report?')) {
      const updated = reports.filter(r => r.id !== id);
      setReports(updated);
      localStorage.setItem('civic_reports', JSON.stringify(updated));
    }
  };

  const filteredReports = reports.filter(r => {
    // If no state is selected, show all (or defaults)
    if (!selectedState) return true;
    
    // For older mock reports without hierarchy, just show them for now
    if (!r.hierarchy) return true;

    // Strict hierarchical mapping
    if (r.hierarchy.state !== selectedState) return false;
    if (selectedDistrict && r.hierarchy.district !== selectedDistrict) return false;
    if (selectedArea && r.hierarchy.area !== selectedArea) return false;
    
    return true;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center">
            <ShieldAlert className="w-8 h-8 mr-3 text-startup-green" />
            Report Issue Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Submit environmental concerns, track resolutions, and view aggregated insights.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <label className="text-sm font-bold text-gray-700 whitespace-nowrap">Filter Reports by Region:</label>
        <LocationSelect className="!flex-row" />
      </div>

      {/* Top Section: Form & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-blue-500" />
            File a New Report
          </h2>
          <CitizenReportForm onSubmitSuccess={addReport} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
            Issue Analytics
          </h2>
          <IssueAnalytics reports={filteredReports} />
        </div>
      </div>

      {/* Middle Section: Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-red-500" />
          <h2 className="text-lg font-bold text-gray-800">Geographic Heatmap</h2>
        </div>
        <div className="h-[400px] w-full bg-gray-200">
           <ReportsMap reports={filteredReports} />
        </div>
      </div>

      {/* Bottom Section: Recent Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <List className="w-5 h-5 mr-2 text-startup-green" />
          Recent Reports Feed
        </h2>
        <RecentReports reports={filteredReports} onUpdateStatus={updateReportStatus} onDeleteReport={deleteReport} />
      </div>
      
    </div>
  );
}
