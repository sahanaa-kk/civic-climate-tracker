import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query as dbQuery, where } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin } from 'lucide-react';

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

export default function StateSelect({ value, onChange, onSelect }) {
  const [statesList, setStatesList] = useState(INDIAN_STATES);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'states'));
        const fbStates = querySnapshot.docs.map(doc => doc.data().name);
        setStatesList(Array.from(new Set([...INDIAN_STATES, ...fbStates])));
      } catch (error) {
        console.warn("Firebase fetch failed, using fallback:", error);
        setStatesList(INDIAN_STATES);
      }
    };
    fetchStates();
  }, []);

  return (
    <div className="relative w-full text-left">
      <div className="relative flex items-center">
        <MapPin className="absolute left-4 w-5 h-5 text-gray-400 font-bold" />
        <select
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if(onSelect) onSelect(e.target.value);
          }}
          className="block w-full pl-12 pr-10 py-4 text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-startup-lightGreen focus:border-startup-green font-medium shadow-sm transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>Select a state...</option>
          {statesList.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
}

export async function ensureStateExists(stateName) {
  try {
    const q = dbQuery(collection(db, 'states'), where('name', '==', stateName));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await addDoc(collection(db, 'states'), { name: stateName });
      console.log(`Created new state record: ${stateName}`);
    }
  } catch (error) {
    console.warn("Could not create state in Firebase:", error);
  }
}
