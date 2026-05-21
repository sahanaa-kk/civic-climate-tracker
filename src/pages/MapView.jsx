import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Filter, Wind, Trash2, Factory, ShieldAlert, Sparkles, MapPin, Loader2, Trophy } from 'lucide-react';
import LocationSelect from '../components/LocationSelect';
import { useLocationContext } from '../context/LocationContext';

const initialMockReports = [];

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

// Fix issue with default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons for Issue Reports
const createIcon = (color) => {
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
  waste: createIcon('red'),
  pollution: createIcon('blue'),
  carbon: createIcon('black'),
  default: createIcon('grey')
};

export default function MapView() {
  const location = useLocation();
  
  const { selectedState, selectedDistrict, selectedArea, setSelectedState } = useLocationContext();

  useEffect(() => {
    if (!selectedState) {
      const last = localStorage.getItem('last_selected_state');
      if (last) {
        setSelectedState(last);
      } else {
        setSelectedState('Maharashtra'); // Give a default to fit map better
      }
    } else {
      localStorage.setItem('last_selected_state', selectedState);
    }
  }, [selectedState, setSelectedState]);
  
  const [apiData, setApiData] = useState([]);
  const [dbReports, setDbReports] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [issueTypeFilter, setIssueTypeFilter] = useState('all');

  // Load Reports
  useEffect(() => {
    const saved = localStorage.getItem('civic_reports');
    if (saved) {
      setDbReports(JSON.parse(saved));
    } else {
      setDbReports(initialMockReports || []);
    }
  }, []);

  // Fetch Live API Data
  useEffect(() => {
    let intervalId;
    async function fetchLiveMapData() {
      setIsLoading(true);
      try {
        let endpoint = `/api/map-data/?state=${encodeURIComponent(selectedState)}`;
        if (selectedDistrict) endpoint += `&district=${encodeURIComponent(selectedDistrict)}`;
        if (selectedArea) endpoint += `&area=${encodeURIComponent(selectedArea)}`;
        
        const response = await fetch(endpoint);
        if (response.ok) {
          const json = await response.json();
          setApiData(json.cities || []);
          setLastUpdated(Date.now());
        }
      } catch(e) {
        console.error("Failed to fetch Map data:", e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLiveMapData();
    intervalId = setInterval(fetchLiveMapData, 60000); // 60s refresh
    return () => clearInterval(intervalId);
  }, [selectedState, selectedDistrict, selectedArea]);

  const mapCenter = useMemo(() => {
     if (apiData && apiData.length > 0) {
        const lats = apiData.map(c => c.lat);
        const lons = apiData.map(c => c.lon);
        return [
           lats.reduce((a,b)=>a+b,0)/lats.length, 
           lons.reduce((a,b)=>a+b,0)/lons.length
        ];
     }
     return [20.5937, 78.9629]; // Default India
  }, [apiData]);

  const mapZoom = selectedArea ? 13 : (selectedDistrict ? 9 : (selectedState ? 6 : 5));

  // Filter Reports
  const filteredReports = useMemo(() => {
    if (issueTypeFilter === 'all') return dbReports;
    return dbReports.filter(r => r.category === issueTypeFilter);
  }, [dbReports, issueTypeFilter]);

  // Derived Leaderboard
  const miniLeaderboard = useMemo(() => {
    const sorted = [...apiData].sort((a, b) => b.green_score - a.green_score);
    return sorted.slice(0, 5);
  }, [apiData]);

  const getAirQualityColor = (pm25) => {
    if (pm25 <= 50) return { color: '#22c55e', fill: '#4ade80', bg: 'bg-green-100', text: 'text-green-700' }; // Good
    if (pm25 <= 100) return { color: '#eab308', fill: '#facc15', bg: 'bg-yellow-100', text: 'text-yellow-700' }; // Moderate
    return { color: '#ef4444', fill: '#f87171', bg: 'bg-red-100', text: 'text-red-700' }; // Poor/Very Poor
  };

  return (
    // Fixed wrapper to break out of main container and make it full screen underneath navbar
    <div className="fixed inset-0 top-16 z-0 bg-gray-100">
      
      {/* FLOATING FILTER PANEL (LEFT) */}
      <div className="absolute top-6 left-6 z-[400] w-72 bg-white/95 backdrop-blur shadow-xl rounded-xl border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-800 flex items-center"><MapPin className="mr-2 h-5 w-5 text-startup-green"/> Map Controls</h2>
          {isLoading && <Loader2 className="w-4 h-4 text-green-500 animate-spin" />}
        </div>
        
        <div className="p-4 space-y-4">
          <div className="w-full">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Focus Region</label>
            <LocationSelect />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center block"><Filter className="w-3 h-3 mr-1"/> Reported Issues</label>
            <select 
              className="w-full text-sm rounded bg-gray-50 border border-gray-200 focus:ring-green-500 py-2.5 px-3"
              value={issueTypeFilter}
              onChange={(e) => setIssueTypeFilter(e.target.value)}
            >
              <option value="all">All Issue Types</option>
              <option value="waste">Waste / Garbage</option>
              <option value="pollution">Air Pollution</option>
              <option value="carbon">Carbon Emission</option>
            </select>
          </div>
          
          <div className="pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center"><Sparkles className="w-4 h-4 mr-1 text-blue-500" /> Synced</h4>
            <p className="text-xs text-gray-400 mt-1">Live data polled securely via OpenAQ layer. Auto-refreshes every 60s.</p>
          </div>
        </div>
      </div>

      {/* FLOATING LEADERBOARD PANEL (TOP-RIGHT) */}
      <div className="absolute top-6 right-6 z-[400] w-64 bg-white/95 backdrop-blur shadow-xl rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center">
          <Trophy className="mr-2 h-4 w-4 text-yellow-500"/>
          <h2 className="text-sm font-extrabold text-gray-800">Top Green Cities</h2>
        </div>
        <div className="p-3 divide-y divide-gray-50">
           {!miniLeaderboard?.length && <p className="text-xs text-gray-400 py-2">No data yet</p>}
           {Array.isArray(miniLeaderboard) && miniLeaderboard.map((city, idx) => (
              <div key={idx} className="py-2 flex justify-between items-center">
                 <div className="flex items-center text-sm">
                   <span className="text-xs text-gray-400 font-bold mr-2">{idx + 1}.</span>
                   <span className="font-semibold text-gray-700">{city.name}</span>
                 </div>
                 <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getAirQualityColor(city.pm25).bg} ${getAirQualityColor(city.pm25).text}`}>
                   {city.green_score}
                 </span>
              </div>
           ))}
        </div>
      </div>

      {/* FLOATING INFO PANEL (BOTTOM RIGHT) */}
      <div className="absolute bottom-6 right-6 z-[400] w-72 bg-white/95 backdrop-blur shadow-xl rounded-xl border border-gray-100 p-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center">Legend & Info</h4>
        <div className="grid grid-cols-2 gap-3 text-xs font-medium">
           <div className="flex items-center text-gray-600"><span className="w-3 h-3 rounded-full bg-green-500/80 mr-2 border border-green-600"></span> Good Air (&gt;90)</div>
           <div className="flex items-center text-gray-600"><span className="w-3 h-3 rounded-full bg-yellow-400/80 mr-2 border border-yellow-500"></span> Moderate (&gt;70)</div>
           <div className="flex items-center text-gray-600"><span className="w-3 h-3 rounded-full bg-red-400/80 mr-2 border border-red-500"></span> Poor (&lt;40)</div>
           <div className="flex items-center text-gray-600"><ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Open Issues</div>
        </div>
      </div>

      {/* MAP RENDERER */}
      <MapContainer 
        key="master-map" // fixed key so it mounts once and ChangeView handles updates
        center={mapCenter} 
        zoom={mapZoom} 
        className="w-full h-full z-0 outline-none"
        zoomControl={false} // Customizing UI so default zoom isn't blocking panels
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />

        {/* 1. REAL-TIME DATA CIRCLE MARKERS (OPENAQ CITIES) */}
        {Array.isArray(apiData) && apiData.map((city, idx) => {
          const style = getAirQualityColor(city.pm25);
          return (
            <CircleMarker 
              key={`city_${idx}`} 
              center={[city.lat, city.lon]}
              radius={16}
              pathOptions={{ fillColor: style.fill, color: style.color, weight: 2, fillOpacity: 0.8 }}
            >
              <Popup className="rounded-xl overflow-hidden min-w-[200px] shadow-sm">
                 <div className="">
                    <h3 className="font-bold text-gray-900 text-lg border-b pb-1 mb-2">📍 {city.name}</h3>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                       <div className="bg-gray-50 rounded p-2 text-center">
                         <span className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">PM 2.5</span>
                         <span className="font-extrabold text-blue-600">{city.pm25}</span>
                       </div>
                       <div className="bg-gray-50 rounded p-2 text-center">
                         <span className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">PM 10</span>
                         <span className="font-extrabold text-indigo-600">{city.pm10}</span>
                       </div>
                    </div>
                    <div className={`p-2 rounded-lg text-center ${style.bg}`}>
                       <span className={`block text-[10px] uppercase font-extrabold mb-0.5 ${style.text}`}>Green Score</span>
                       <span className={`text-xl font-black ${style.text}`}>{city.green_score}/100</span>
                    </div>
                 </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* 2. CITIZEN ISSUE MARKERS */}
        {Array.isArray(filteredReports) && filteredReports.map((report) => {
          if(!report.location?.lat) return null;
          return (
            <Marker 
              key={report.id} 
              position={[report.location.lat, report.location.lng]}
              icon={ICONS[report.category] || ICONS.default}
              zIndexOffset={100} // Issues sit on top of PM circles
            >
              <Popup className="custom-popup shadow-sm min-w-[220px]">
                <div className="p-0">
                  {report.photo && (
                    <div className="w-full h-28 bg-gray-100 rounded-lg overflow-hidden mb-2">
                       {typeof report.photo === 'string' && report.photo.includes('/') ? (
                         <img src={report.photo} alt="Issue" className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium">Mock Photo</div>
                       )}
                    </div>
                  )}
                  <h4 className="font-bold text-gray-900 capitalize flex items-center justify-between mb-1">
                     {report.category} Issue
                     <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${report.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                       {report.status}
                     </span>
                  </h4>
                  <p className="text-sm text-gray-700 leading-tight mb-2 max-h-20 overflow-y-auto">{report.description}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
