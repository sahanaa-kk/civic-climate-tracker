import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  // When state changes, reset district and area
  const handleStateChange = (newState) => {
    setSelectedState(newState);
    setSelectedDistrict("");
    setSelectedArea("");
  };

  // When district changes, reset area
  const handleDistrictChange = (newDistrict) => {
    setSelectedDistrict(newDistrict);
    setSelectedArea("");
  };

  const handleAreaChange = (newArea) => {
    setSelectedArea(newArea);
  };

  return (
    <LocationContext.Provider value={{
      selectedState, 
      setSelectedState: handleStateChange,
      selectedDistrict,
      setSelectedDistrict: handleDistrictChange,
      selectedArea,
      setSelectedArea: handleAreaChange,
      
      // Direct raw setters if needed internally
      setRawState: setSelectedState,
      setRawDistrict: setSelectedDistrict,
      setRawArea: setSelectedArea
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  return useContext(LocationContext);
}
