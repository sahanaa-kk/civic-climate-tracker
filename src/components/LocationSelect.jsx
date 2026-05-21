import { useState, useEffect } from 'react';
import { useLocationContext } from '../context/LocationContext';
import { MapPin, ChevronRight, Loader2 } from 'lucide-react';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh",
  "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function generateDistrictsUsingAI(state) {
    if(state === "Maharashtra") return ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"];
    if(state === "Gujarat") return ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"];
    if(state === "Karnataka") return ["Bengaluru Urban", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"];
    if(state === "Delhi") return ["New Delhi", "North Delhi", "South Delhi", "East Delhi"];
    return [`${state} Central`, `${state} North`, `${state} South`];
}

function generateAreasUsingAI(district) {
    return [`${district} Zone 1`, `${district} Zone 2`, `${district} Zone 3`, `${district} Zone 4`];
}

export default function LocationSelect({ className = "" }) {
  const { 
    selectedState, setSelectedState,
    selectedDistrict, setSelectedDistrict,
    selectedArea, setSelectedArea 
  } = useLocationContext();

  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);

  // Fetch districts on state change
  useEffect(() => {
    if (!selectedState) {
        setDistricts([]);
        setSelectedDistrict("");
        return;
    }
    
    setLoadingDistricts(true);
    fetch(`/api/get-districts?state=${encodeURIComponent(selectedState)}`)
      .then(async (res) => {
         if (!res.ok) throw new Error("API failed");
         const data = await res.json();
         setDistricts(data.districts || []);
         setLoadingDistricts(false);
      })
      .catch(err => {
         console.error("API failed, using AI fallback", err);
         const aiFallback = generateDistrictsUsingAI(selectedState);
         setDistricts(aiFallback);
         setLoadingDistricts(false);
      });
  }, [selectedState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate areas on district change
  useEffect(() => {
     if (!selectedDistrict) {
         setAreas([]);
         setSelectedArea("");
         return;
     }
     setLoadingAreas(true);
     // Simulate API delay for areas
     setTimeout(() => {
         setAreas(generateAreasUsingAI(selectedDistrict));
         setLoadingAreas(false);
     }, 400);
  }, [selectedDistrict]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`flex flex-col md:flex-row items-center gap-4 w-full ${className}`}>
      {/* State Dropdown */}
      <div className="relative w-full flex-1">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-bold" />
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="block w-full pl-12 pr-10 py-3.5 text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-startup-lightGreen focus:border-startup-green font-medium shadow-sm transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>Select State...</option>
          {INDIAN_STATES.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      <ChevronRight className={`hidden md:block w-5 h-5 text-gray-300 flex-shrink-0 ${!selectedState && 'opacity-30'}`} />

      {/* District Dropdown */}
      <div className="relative w-full flex-1 transition-all duration-300">
        {loadingDistricts && <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />}
        <select
          disabled={!selectedState || loadingDistricts}
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className={`block w-full ${loadingDistricts ? 'pl-9' : 'px-4'} py-3.5 text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 font-medium shadow-sm transition-all appearance-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
        >
          <option value="" disabled>{loadingDistricts ? 'Loading...' : 'Select District...'}</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <ChevronRight className={`hidden md:block w-5 h-5 text-gray-300 flex-shrink-0 ${!selectedDistrict && 'opacity-30'}`} />

      {/* Area Dropdown */}
      <div className="relative w-full flex-1 transition-all duration-300">
        {loadingAreas && <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 animate-spin" />}
        <select
          disabled={!selectedDistrict || loadingAreas}
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className={`block w-full ${loadingAreas ? 'pl-9' : 'px-4'} py-3.5 text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 font-medium shadow-sm transition-all appearance-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
        >
          <option value="" disabled>{loadingAreas ? 'Loading...' : 'Select Area...'}</option>
          <option value="">All Areas</option>
          {areas.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
