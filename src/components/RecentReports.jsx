import { MapPin, Clock, ShieldAlert, Sparkles, CheckCircle, Clock3, Camera, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function RecentReports({ reports, onUpdateStatus, onDeleteReport }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock3 className="w-3 h-3 mr-1" />;
      case 'In Progress': return <ShieldAlert className="w-3 h-3 mr-1" />;
      case 'Resolved': return <CheckCircle className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'waste': return '🗑️';
      case 'pollution': return '💨';
      case 'carbon': return '🏭';
      case 'greenery': return '🌳';
      case 'infrastructure': return '🏗️';
      default: return '⚠️';
    }
  };

  const cycleStatus = (id, currentStatus) => {
    const statuses = ['Pending', 'In Progress', 'Resolved'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    onUpdateStatus(id, statuses[nextIdx]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.length === 0 ? (
        <div className="col-span-full py-10 text-center text-gray-400">
          No reports submitted yet. Be the first to report an issue!
        </div>
      ) : (
        reports.map(report => (
          <div key={report.id} className="bg-white border text-left border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCategoryEmoji(report.category)}</span>
                <span className="font-semibold text-gray-900 capitalize tracking-tight">
                  {report.category} Issue
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => cycleStatus(report.id, report.status)}
                  className={`flex items-center text-xs font-bold px-2 py-1 rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(report.status)}`}
                  title="Admin: Click to cycle status"
                >
                  {getStatusIcon(report.status)}
                  {report.status}
                </button>
                {onDeleteReport && (
                  <button 
                    onClick={() => onDeleteReport(report.id)}
                    className="flex text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 text-sm mb-4 flex-1 break-words">
              {report.description}
            </p>

            {report.photo && (
              <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 h-32 w-full bg-gray-50 flex items-center justify-center relative">
                {typeof report.photo === 'string' && report.photo.includes('/') ? (
                   <img src={report.photo} alt="Report proof" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs flex items-center gap-1 font-medium"><Camera className="w-4 h-4" /> Photo Attached: {typeof report.photo === 'string' ? report.photo : 'upload.jpg'}</span>
                )}
              </div>
            )}

            {report.aiInsight && (
              <div className="mb-4 bg-indigo-50/70 border border-indigo-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-indigo-900 flex items-center">
                    <Sparkles className="w-3 h-3 text-indigo-500 mr-1" /> AI Insight
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-indigo-100 text-indigo-700">
                    {report.aiInsight.severity} Severity
                  </span>
                </div>
                <p className="text-xs text-indigo-800/80 leading-relaxed font-medium">
                  {report.aiInsight.suggestion}
                </p>
              </div>
            )}
            
            <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-500">
              <div className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                {report.location?.name ? report.location.name : "Mapped Location"}
              </div>
              <div className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
