import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import { Wind, Trash2, TreePine, TrendingUp, Sparkles, Trophy, IndianRupee, AlertTriangle, Info, Loader2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import CitizenReportForm from '../components/CitizenReportForm';
import ProjectMap from '../components/ProjectMap';
import LocationSelect from '../components/LocationSelect';
import { useLocationContext } from '../context/LocationContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CitizenDashboard() {
  const location = useLocation();
  
  const { selectedState, selectedDistrict, selectedArea, setSelectedState } = useLocationContext();

  useEffect(() => {
    if (!selectedState) {
      const last = localStorage.getItem('last_selected_state');
      if (last) {
        setSelectedState(last);
      } else {
        setSelectedState('Maharashtra');
      }
    } else {
      localStorage.setItem('last_selected_state', selectedState);
    }
  }, [selectedState, setSelectedState]);
  

  const [clickedMapPos, setClickedMapPos] = useState(null);

  // Real-time State Data
  const [liveStateData, setLiveStateData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  // Ref for chart destruction (by triggering re-mount)
  const chartKey = `${selectedState}_${selectedDistrict}_${selectedArea}_${lastFetchTime}`;

  useEffect(() => {
    let intervalId;

    async function fetchData() {
      if (!selectedState) return;
      setIsLoading(true);
      try {
        let endpoint = `/api/state-data/?state=${encodeURIComponent(selectedState)}`;
        if (selectedArea) endpoint = `/api/area-data/?state=${encodeURIComponent(selectedState)}&district=${encodeURIComponent(selectedDistrict)}&area=${encodeURIComponent(selectedArea)}`;
        else if (selectedDistrict) endpoint = `/api/district-data/?state=${encodeURIComponent(selectedState)}&district=${encodeURIComponent(selectedDistrict)}`;

        let leaderEndpoint = '/api/leaderboard';
        if (selectedDistrict) leaderEndpoint = `/api/leaderboard?state=${encodeURIComponent(selectedState)}&district=${encodeURIComponent(selectedDistrict)}`;
        else if (selectedState) leaderEndpoint = `/api/leaderboard?state=${encodeURIComponent(selectedState)}`;

        const [stateRes, leaderRes] = await Promise.all([
          fetch(endpoint),
          fetch(leaderEndpoint)
        ]);

        if (stateRes.ok && leaderRes.ok) {
          const stateData = await stateRes.json();
          const leaderData = await leaderRes.json();

          setLiveStateData(stateData);
          setLeaderboardData(leaderData);
          setLastFetchTime(Date.now());
        }
      } catch (err) {
        console.error("Failed to fetch live state data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    // Auto update every 60 seconds
    intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [selectedState, selectedDistrict, selectedArea]);

  // Derived Values
  const greenScore = liveStateData?.green_score || 0;
  const isFallback = liveStateData?.isFallback || false;
  const pm25 = liveStateData?.pm25 || 0;
  const pm10 = liveStateData?.pm10 || 0;

  // --- AI-Based Budget Data Generation ---
  const airPerf = Math.max(0, 100 - (pm25 / 150) * 100);
  let seedVal = 0;
  const seedString = selectedArea || selectedDistrict || selectedState || "";
  for(let i=0; i<seedString.length; i++) seedVal += seedString.charCodeAt(i);
  const wastePerf = 40 + (seedVal % 50);
  const carbonPerf = 30 + (seedVal % 60);

  const aiBudgetData = useMemo(() => {
    let seed = 0;
    const locationString = selectedArea || selectedDistrict || selectedState || "";
    for(let i=0; i<locationString.length; i++) seed += locationString.charCodeAt(i);
    
    // Function to calculate scores based on AI model logic
    const calculateMetrics = (allocated, spent, complaints, pollution) => {
      // 1. Utilization %
      let utilization = Math.round((spent / allocated) * 100);
      if (utilization > 100) utilization = 100;
      
      // 2. Normalize inputs
      let complaintScore = 50; // Medium
      if (complaints < 50) complaintScore = 80; // Low
      else if (complaints > 150) complaintScore = 20; // High
      
      let pollutionScore = 50; // Moderate
      if (pollution < 50) pollutionScore = 80; // Good
      else if (pollution > 150) pollutionScore = 20; // Poor
      
      // 3. AI Score
      const aiScore = Math.round((0.5 * utilization) + (0.3 * complaintScore) + (0.2 * pollutionScore));
      
      // 4. Classification & 5. AI Recommendations
      let status, message, recommendation;
      let statusColor, bg, textColor, gaugeColor;
      
      if (aiScore < 40) {
        status = "Critical";
        message = "Severe underperformance. Immediate intervention required.";
        statusColor = "text-red-600";
        bg = "bg-red-50 border-red-200";
        textColor = "text-red-700";
        gaugeColor = "bg-red-500";
        recommendation = utilization < 40 ? "Increase fund allocation usage" : (complaints > 150 ? "Improve service response" : "Implement pollution control measures");
      } else if (aiScore <= 70) {
        status = "Moderate";
        message = "Needs improvement. Monitor closely.";
        statusColor = "text-yellow-600";
        bg = "bg-yellow-50 border-yellow-200";
        textColor = "text-yellow-800";
        gaugeColor = "bg-yellow-500";
        recommendation = utilization < 60 ? "Optimize fund allocation usage" : (complaints > 100 ? "Improve public service response" : "Review pollution frameworks");
      } else {
        status = "Good";
        message = "Efficient utilization and good performance.";
        statusColor = "text-green-600";
        bg = "bg-green-50 border-green-200";
        textColor = "text-green-800";
        gaugeColor = "bg-green-500";
        recommendation = "Maintain current operational excellence.";
      }
      
      return { 
        allocated, spent, complaints, pollution, utilization, MathAiScore: aiScore, 
        status, message, recommendation, statusColor, bg, textColor, gaugeColor
      };
    };

    return [
      { id: 'waste', name: "Waste Management", icon: Trash2, iconColor: 'text-yellow-500', iconBg: 'bg-yellow-100', ...calculateMetrics(20 + (seed % 5), 11 + (seed % 10), 40 + (seed % 150), 30 + (seed % 100)) },
      { id: 'air', name: "Air Pollution Control", icon: Wind, iconColor: 'text-blue-500', iconBg: 'bg-blue-100', ...calculateMetrics(15 + (seed % 8), 8 + (seed % 7), 60 + (seed % 80), pm25) },
      { id: 'carbon', name: "Carbon Footprint", icon: TreePine, iconColor: 'text-green-500', iconBg: 'bg-green-100', ...calculateMetrics(25 + (seed % 6), 22 + (seed % 8), 20 + (seed % 40), 100 - carbonPerf) }
    ].map(b => {
       // clamp spent safely
       if (b.spent > b.allocated) b.spent = b.allocated;
       b.utilization = Math.round((b.spent / b.allocated) * 100);
       return b;
    });
  }, [selectedState, selectedDistrict, selectedArea, pm25, carbonPerf]);

  const avgAiScore = Math.round(aiBudgetData.reduce((acc, curr) => acc + curr.MathAiScore, 0) / 3);
  
  // AI Insights
  let insightStatus, insightColor, insightBg;
  if (greenScore > 75) {
    insightStatus = "Excellent sustainability performance";
    insightColor = "text-green-700";
    insightBg = "bg-green-100 border-green-200";
  } else if (greenScore >= 50) {
    insightStatus = "Moderate progress, needs improvement";
    insightColor = "text-yellow-700";
    insightBg = "bg-yellow-100 border-yellow-200";
  } else {
    insightStatus = "Poor sustainability, urgent action required";
    insightColor = "text-red-700";
    insightBg = "bg-red-100 border-red-200";
  }

  const recommendations = [];
  const locName = selectedArea || selectedDistrict || selectedState;
  if (pm25 > 60) recommendations.push(`Urgent: Implement strong emission controls in ${locName}'s major mapped areas to reduce PM2.5 levels (${pm25} µg/m³).`);
  else recommendations.push("Maintain current low-emission zones and expand public electric transport networks.");
  if (pm10 > 100) recommendations.push(`High PM10 levels detected (${pm10} µg/m³). Increase dust control measures on construction sites.`);
  if (wastePerf < 70) recommendations.push("Improve municipal waste segregation policies across key districts.");

  // Trend Data simulated from current PM2.5 for the trend chart
  const weekLabels = ['6 Days Ago', '5 Days Ago', '4 Days Ago', '3 Days Ago', '2 Days Ago', 'Yesterday', 'Today(Live)'];
  const trendData = weekLabels.map((_, i) => {
     if (i === 6) return pm25;
     // simple deterministic simulation
     const mod = ((seedVal + i) % 30) - 15;
     return Math.max(0, pm25 + mod);
  });

  const lineData = {
    labels: weekLabels,
    datasets: [{
      label: 'PM2.5 Trend (µg/m³)',
      data: trendData,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
      tension: 0.3,
    }]
  };

  const barData = {
    labels: ['Air Quality Particulates'],
    datasets: [
      {
        label: 'PM2.5 (µg/m³)',
        data: [pm25],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'PM10 (µg/m³)',
        data: [pm10],
        backgroundColor: 'rgba(234, 179, 8, 0.8)',
      }
    ]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false };
  
  const budgetChartData = {
    labels: aiBudgetData.map(b => b.name),
    datasets: [
      {
        label: 'Allocated (Cr)',
        data: aiBudgetData.map(b => b.allocated),
        backgroundColor: 'rgba(209, 213, 219, 0.8)',
      },
      {
        label: 'Spent (Cr)',
        data: aiBudgetData.map(b => b.spent),
        backgroundColor: aiBudgetData.map(b => b.utilization > 80 ? 'rgba(34, 197, 94, 0.8)' : (b.utilization >= 40 ? 'rgba(234, 179, 8, 0.8)' : 'rgba(239, 68, 68, 0.8)')),
      }
    ]
  };
  const budgetChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } };

  return (
    <div className="max-w-7xl mx-auto space-y-6 mt-4 pb-10">
      
      {/* HEADER: GREEN SCORE BLOCK */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gradient-to-br from-green-50 to-white relative">
        
        {isLoading && (
          <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-sm flex items-center justify-center">
             <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
             <span className="ml-2 text-xs font-bold text-gray-500">Live Syncing</span>
          </div>
        )}

        <div className="mb-4 md:mb-0 text-center md:text-left flex-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 border-b-2 border-green-200 pb-2 inline-block">
            {selectedArea || selectedDistrict || selectedState} Dashboard 🌱
          </h2>
          <p className="text-gray-600 mt-2 max-w-lg">Track state-wide real-time environmental metrics aggregated from major mapped cities.</p>
          
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
            <div className={`bg-white px-3 py-2 rounded-lg border shadow-sm ${isFallback ? 'border-yellow-400 bg-yellow-50' : ''}`}>
              <span className="text-gray-500 block text-[10px] uppercase">API Status</span>
              {isFallback ? (
                <span className="text-yellow-700 flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> Using fallback data</span>
              ) : (
                <span className="text-green-700 flex items-center"><Sparkles className="w-3 h-3 mr-1"/> Live (OpenAQ)</span>
              )}
            </div>
            <div className="bg-white px-3 py-2 rounded-lg border shadow-sm">
              <span className="text-gray-500 block text-[10px] uppercase">Avg AI Budget Score</span>
              <span className="text-blue-700 text-lg">{avgAiScore}/100</span>
            </div>
          </div>

          <div className="mt-6 w-full max-w-2xl">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Change Tracking Node</label>
            <LocationSelect />
          </div>
        </div>
        
        {/* SCORE DISPLAY */}
        <div className="flex flex-col items-center mt-4 md:mt-0">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200" />
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={(2 * Math.PI * 56)} strokeDashoffset={2 * Math.PI * 56 * (1 - greenScore/100)} 
                className={`${greenScore > 80 ? 'text-green-500' : (greenScore >= 50 ? 'text-yellow-500' : 'text-red-500')} transition-all duration-1000 ease-out`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-extrabold ${greenScore > 80 ? 'text-green-600' : (greenScore >= 50 ? 'text-yellow-600' : 'text-red-600')}`}>
                {isLoading && !liveStateData ? '--' : greenScore}
              </span>
            </div>
          </div>
          <p className="mt-3 text-sm font-black tracking-widest text-gray-500 uppercase">Green Score</p>
          <p className={`mt-1 font-bold text-base ${greenScore > 80 ? 'text-green-600' : (greenScore >= 50 ? 'text-yellow-600' : 'text-red-600')}`}>
             {greenScore > 80 ? 'Excellent 🌱' : (greenScore >= 50 ? 'Moderate ⚠️' : 'Poor 🚨')}
          </p>
        </div>
      </div>

      {/* AI INSIGHTS & LEADERBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* State Leaderboard */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">
                {selectedDistrict ? 'Area Ranking' : (selectedState ? 'District Ranking' : 'State Ranking')}
              </h3>
            </div>
            {isLoading && <Loader2 className="w-4 h-4 text-green-500 animate-spin" />}
          </div>
          <div className="space-y-4 mt-2 max-h-[250px] overflow-y-auto pr-2">
            {!leaderboardData?.length && !isLoading && <p className="text-gray-400 text-sm">No leaderboard data</p>}
            {Array.isArray(leaderboardData) && leaderboardData.map((node, idx) => {
              const stStatus = node.green_score > 75 ? 'Good' : (node.green_score >= 50 ? 'Moderate' : 'Poor');
              const stColor = node.green_score > 75 ? 'text-green-600' : (node.green_score >= 50 ? 'text-yellow-600' : 'text-red-600');
              const isSelected = node.name === selectedState || node.name === selectedDistrict || node.name === selectedArea;
              return (
                <div key={node.name} className={`flex flex-col p-3 rounded-lg border ${isSelected ? 'bg-green-50 border-green-300 shadow-sm' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-gray-400 font-bold w-6">{idx + 1}.</span>
                      <span className={`font-semibold ${isSelected ? 'text-green-800' : 'text-gray-700'}`}>{node.name}</span>
                    </div>
                    <span className={`font-bold ${stColor}`}>{node.green_score}</span>
                  </div>
                  <div className="ml-6 mt-1 flex justify-between text-xs text-gray-500">
                     <span className="capitalize">{node.type} Status: {stStatus}</span>
                     <span>PM 2.5: {node.pm25}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className={`lg:col-span-2 shadow-sm border rounded-xl p-6 ${insightBg}`}>
          <div className="flex items-center mb-4">
            <Sparkles className={`w-6 h-6 mr-2 ${insightColor}`} />
            <h3 className={`text-xl font-bold ${insightColor}`}>AI Sustainability Insights</h3>
          </div>
          <p className={`font-semibold mb-4 text-lg ${insightColor}`}>{insightStatus}</p>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start bg-white bg-opacity-50 p-3 rounded-lg">
                <div className="w-2 h-2 mt-2 mr-3 rounded-full bg-current opacity-70 flex-shrink-0"></div>
                <p className={`text-sm ${insightColor}`}>{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Air Quality Card */}
        <div className={`bg-white shadow-sm transition-shadow duration-200 border-t-4 border border-t-blue-400 rounded-xl p-6 flex flex-col items-center justify-center text-center ${isFallback ? 'bg-orange-50' : ''}`}>
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
            <Wind className="w-6 h-6" />
          </div>
          <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">State Air Quality</h5>
          <div className="text-xs text-gray-500 w-full flex flex-col items-center mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-900 font-black text-lg mb-1">{isLoading && !pm25 ? "..." : `PM2.5: ${pm25} µg/m³`}</p>
            <p className="text-gray-700 font-bold mb-1">{isLoading && !pm10 ? "..." : `PM10: ${pm10} µg/m³`}</p>
            {isFallback && <p className="text-yellow-600 italic mt-1 font-semibold text-[10px]">Using fallback mapped data</p>}
          </div>
        </div>

        {/* Waste Card */}
        <div className="bg-white shadow-sm border border-t-4 border-t-yellow-400 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-3">
            <Trash2 className="w-6 h-6" />
          </div>
          <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Waste Managed</h5>
          <div className="text-xs text-gray-500 w-full flex flex-col items-center mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-900 font-black text-lg mb-1">Coverage: {wastePerf}%</p>
            <p>Target: 100%</p>
          </div>
        </div>

        {/* Carbon Card */}
        <div className="bg-white shadow-sm border border-t-4 border-t-green-400 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-3">
            <TreePine className="w-6 h-6" />
          </div>
          <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Carbon Footprint</h5>
          <div className="text-xs text-gray-500 w-full flex flex-col items-center mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-900 font-black text-lg mb-1">Green Cover: {carbonPerf}%</p>
            <p>Target: &gt; 33%</p>
          </div>
        </div>
      </div>

      {/* DYNAMIC CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
      
        {isLoading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            <span className="font-bold text-green-800 ml-2">Reloading Charts...</span>
          </div>
        )}

        {/* PM COMPARISON BAR CHART */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
          <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Wind className="w-5 h-5 mr-2 text-blue-500"/> PM2.5 vs PM10 Comparison</h5>
          <div style={{ height: '300px' }} className="w-full">
            {/* The chartKey forces Chart.js to destroy and rebuild when data is fetched */}
            <Bar key={`bar_${chartKey}`} options={chartOptions} data={barData} />
          </div>
        </div>
        
        {/* PM2.5 TREND LINE CHART */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
          <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-green-500"/> Live PM2.5 Trend (simulated week)</h5>
          <div style={{ height: '300px' }} className="w-full">
            <Line key={`line_${chartKey}`} options={chartOptions} data={lineData} />
          </div>
        </div>
      </div>

      {/* AI-POWERED BUDGET TRACKING SECTION */}
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-4 flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-blue-500" />
          AI Budget Allocation & Impact Analysis
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {aiBudgetData.map((budget) => {
             const Icon = budget.icon;
             return (
               <div key={budget.id} className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 hover:-translate-y-1 transition-transform flex flex-col">
                 <div className="flex justify-between items-center mb-5">
                   <div className="flex items-center">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${budget.iconColor} ${budget.iconBg}`}>
                       <Icon className="w-5 h-5" />
                     </div>
                     <h4 className="font-extrabold text-gray-800 text-sm tracking-tight">{budget.name}</h4>
                   </div>
                 </div>
                 
                 <div className="flex justify-between items-end mb-2">
                   <div>
                     <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Spent</p>
                     <p className="text-2xl font-black text-gray-900 leading-none">₹{budget.spent}<span className="text-sm text-gray-500 font-bold ml-1">Cr</span></p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Allocated</p>
                     <p className="text-lg font-bold text-gray-600 leading-none">₹{budget.allocated} Cr</p>
                   </div>
                 </div>

                 {/* Budget Utilization Bar */}
                 <div className="flex items-center justify-between mt-2 mb-1">
                   <span className="text-xs font-bold text-gray-500 uppercase">Utilization</span>
                   <span className="text-xs font-bold text-blue-600">{budget.utilization}%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-6">
                   <div className="bg-blue-500 h-full rounded-full" style={{ width: `${budget.utilization}%` }}></div>
                 </div>
                 
                 {/* AI Insights Block */}
                 <div className={`p-4 rounded-xl border mb-4 mt-auto ${budget.bg}`}>
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-xs font-black uppercase text-gray-600 tracking-wider">AI Score</span>
                     <span className={`text-2xl font-black ${budget.statusColor} leading-none`}>{budget.MathAiScore} <span className="text-xs text-gray-400">/100</span></span>
                   </div>
                   
                   {/* AI Gauge */}
                   <div className="w-full bg-white/50 border border-black/5 rounded-full h-1.5 overflow-hidden mb-3">
                     <div className={`h-full rounded-full ${budget.gaugeColor}`} style={{ width: `${budget.MathAiScore}%` }}></div>
                   </div>
                   
                   <div className="flex mb-2">
                     <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${budget.status === 'Critical' ? 'bg-white text-red-700 border-red-200' : (budget.status === 'Moderate' ? 'bg-white text-yellow-700 border-yellow-200' : 'bg-white text-green-700 border-green-200')} `}>
                       {budget.status}
                     </span>
                   </div>
                   
                   <p className={`text-xs font-bold ${budget.textColor} mb-3 leading-snug`}>{budget.message}</p>
                   
                   <div className="bg-white/70 p-2.5 rounded shadow-sm border border-black/5">
                     <span className="block text-[10px] font-black uppercase text-gray-500 mb-0.5">💡 AI Recommendation</span>
                     <p className="text-xs font-semibold text-gray-800">{budget.recommendation}</p>
                   </div>
                 </div>
                 
                 {/* Footer Stats: Complaints & Pollution */}
                 <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                   <div>
                     <p className="text-[10px] uppercase font-bold text-gray-400">Complaints</p>
                     <p className="text-sm font-bold text-gray-700">{budget.complaints}</p>
                   </div>
                   <div>
                     <p className="text-[10px] uppercase font-bold text-gray-400">Pollution Idx</p>
                     <p className="text-sm font-bold text-gray-700">{budget.pollution}</p>
                   </div>
                 </div>

               </div>
             );
          })}
        </div>
        
        <div className="bg-white shadow-soft border border-gray-100 rounded-2xl p-6 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
              <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
            </div>
          )}
          <h5 className="text-lg font-bold text-gray-900 mb-6 flex items-center"><TrendingUp className="w-5 h-5 mr-3 text-green-500"/> Allocation vs Expenditure Comparison</h5>
          <div style={{ height: '300px' }} className="w-full">
            <Bar key={`budget_${chartKey}`} options={budgetChartOptions} data={budgetChartData} />
          </div>
        </div>
      </div>

    </div>
  );
}
