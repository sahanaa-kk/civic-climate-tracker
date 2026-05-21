import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
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

export default function AnalyticsCharts() {
  // MOCK DATA: Air Quality Trend (Line Chart)
  const aqiData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Bengaluru AQI',
        data: [145, 150, 160, 152, 148, 140, 152],
        borderColor: 'rgb(59, 130, 246)', // blue
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Delhi AQI',
        data: [280, 295, 305, 310, 315, 300, 312],
        borderColor: 'rgb(239, 68, 68)', // red
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      }
    ],
  };

  const aqiOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '7-Day Air Quality Trend (Lower is Better)' },
    },
  };

  // MOCK DATA: Waste Progress (Bar Chart)
  const wasteData = {
    labels: ['Bengaluru', 'Delhi'],
    datasets: [
      {
        label: 'Waste Collected (Tons)',
        data: [850, 1200],
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // green
      },
      {
        label: 'Waste Processed (Tons)',
        data: [680, 800],
        backgroundColor: 'rgba(168, 85, 247, 0.6)', // purple
      }
    ],
  };

  const wasteOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Daily Waste Management Progress' },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white shadow rounded-lg p-6 border border-gray-100" style={{ height: '400px' }}>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Air Quality Trend</h3>
        <div className="h-full pb-6">
          <Line options={aqiOptions} data={aqiData} />
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 border border-gray-100" style={{ height: '400px' }}>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Waste Progress</h3>
        <div className="h-full pb-6">
          <Bar options={wasteOptions} data={wasteData} />
        </div>
      </div>
    </div>
  );
}
