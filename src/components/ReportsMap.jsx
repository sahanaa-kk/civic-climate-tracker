import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ShieldAlert, Trash2, Wind, Factory } from 'lucide-react';

// Fix leafet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons based on category
const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const ICONS = {
  waste: createCustomIcon('red'),
  pollution: createCustomIcon('blue'),
  carbon: createCustomIcon('grey'),
  default: createCustomIcon('green'),
};

export default function ReportsMap({ reports }) {
  const [filter, setFilter] = useState('all');

  const filteredReports = useMemo(() => {
    if (filter === 'all') return reports;
    return reports.filter(r => r.category === filter);
  }, [reports, filter]);

  const center = reports.length > 0 && reports[0].location
    ? [reports[0].location.lat, reports[0].location.lng]
    : [20.5937, 78.9629]; // Default India

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="absolute top-4 right-4 z-[400] bg-white p-2 rounded-lg shadow-md border border-gray-200">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
        >
          <option value="all">All Issues</option>
          <option value="waste">Waste / Garbage</option>
          <option value="pollution">Air Pollution</option>
          <option value="carbon">Carbon Emission</option>
        </select>
      </div>
      
      <MapContainer center={center} zoom={5} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredReports.map(report => {
          if (!report.location || !report.location.lat || !report.location.lng) return null;
          
          return (
            <Marker 
              key={report.id} 
              position={[report.location.lat, report.location.lng]}
              icon={ICONS[report.category] || ICONS.default}
            >
              <Popup className="rounded-xl overflow-hidden shadow-xl p-0">
                <div className="w-56">
                  {report.photo && (
                    <div className="w-full h-24 bg-gray-100 mb-2 border-b">
                      {typeof report.photo === 'string' && report.photo.includes('/') ? (
                        <img src={report.photo} alt="Issue" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium">
                          Photo: {typeof report.photo === 'string' ? report.photo : 'upload.jpg'}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-3 pt-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-gray-900 capitalize text-sm flex items-center">
                        {report.category === 'waste' && <Trash2 className="w-3 h-3 mr-1 text-red-500"/>}
                        {report.category === 'pollution' && <Wind className="w-3 h-3 mr-1 text-blue-500"/>}
                        {report.category === 'carbon' && <Factory className="w-3 h-3 mr-1 text-gray-500"/>}
                        {report.category}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        report.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                        report.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-3 mb-2">{report.description}</p>
                    {report.aiInsight && (
                       <p className="text-[10px] text-indigo-600 font-medium bg-indigo-50 p-1 rounded">
                         <span className="font-bold">AI:</span> {report.aiInsight.suggestion}
                       </p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  );
}
