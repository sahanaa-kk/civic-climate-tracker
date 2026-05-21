import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom Icons for Projects
const createColorIcon = (color) => {
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
  pending: createColorIcon('grey'),
  ongoing: createColorIcon('orange'),
  completed: createColorIcon('green')
};

const STATE_COORDINATES = {
  "Andaman and Nicobar Islands": [11.7401, 92.6586],
  "Andhra Pradesh": [15.9129, 79.7400],
  "Arunachal Pradesh": [28.2180, 94.7278],
  "Assam": [26.2006, 92.9376],
  "Bihar": [25.0961, 85.3131],
  "Chandigarh": [30.7333, 76.7794],
  "Chhattisgarh": [21.2787, 81.8661],
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
  "West Bengal": [22.9868, 87.8550],
  "Delhi": [28.7041, 77.1025],
  "Bengaluru": [12.9716, 77.5946],
  "Mumbai": [19.0760, 72.8777]
};

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng);
    },
  });
  return null;
}

export default function ProjectMap({ projects = [], reports = [], cityName, onMapClick, clickedPos }) {
  const center = cityName && STATE_COORDINATES[cityName] ? STATE_COORDINATES[cityName] : [20.5937, 78.9629];
  const mapZoom = cityName && STATE_COORDINATES[cityName] ? 6 : 4;
  
  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200" style={{ minHeight: '400px' }}>
      <MapContainer key={cityName || 'default'} center={center} zoom={mapZoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onMapClick={onMapClick} />
        {clickedPos && (
          <Marker position={clickedPos}>
            <Popup>User Selected Location</Popup>
          </Marker>
        )}
        
        {/* Render Hierarchical Infrastructure Projects */}
        {Array.isArray(projects) && projects.map((proj) => {
          if (!proj.latitude || !proj.longitude) return null;
          
          let icon = ICONS.pending;
          if (proj.current_status === 'Ongoing') icon = ICONS.ongoing;
          else if (proj.current_status === 'Completed') icon = ICONS.completed;

          return (
            <Marker key={proj.project_id} position={[proj.latitude, proj.longitude]} icon={icon}>
              <Popup className="min-w-[200px]">
                <div className="p-0">
                  <h4 className="font-extrabold text-sm text-gray-900 border-b pb-1 mb-2 leading-tight">{proj.project_name}</h4>
                  
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-[10px] font-bold text-gray-500 uppercase">Phase</span>
                     <span className="text-xs font-semibold text-blue-600">{proj.expected_completion_phase}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] font-bold text-gray-500 uppercase">Status</span>
                     <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${proj.current_status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : (proj.current_status === 'Ongoing' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-gray-100 text-gray-700 border-gray-200')}`}>
                        {proj.current_status}
                     </span>
                  </div>

                  <div className="mt-2 bg-gray-50 rounded p-1.5 flex justify-between">
                     <span className="text-[10px] uppercase font-bold text-gray-500">Allocated</span>
                     <span className="text-xs font-black text-gray-800">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(proj.budget_allocated)}
                     </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Render Citizen Reports */}
        {reports.map((report) => (
          <Marker key={report.id} position={[report.location.lat, report.location.lng]}>
            <Popup>
              <div className="p-1">
                <h4 className="font-bold text-sm capitalize">{report.category} Issue</h4>
                <p className="text-xs text-gray-600 mt-1">{report.description}</p>
                <div className="mt-2 text-xs">
                  {report.ai_verified ? 
                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded">AI Verified</span> : 
                   <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending Verification</span>
                  }
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}
