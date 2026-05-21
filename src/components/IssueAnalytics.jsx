import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FileWarning, CheckCircle2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function IssueAnalytics({ reports }) {
  // Aggregate data
  const stats = useMemo(() => {
    let waste = 0;
    let pollution = 0;
    let carbon = 0;
    let resolved = 0;

    reports.forEach(r => {
      if (r.status === 'Resolved') resolved++;
      if (r.category === 'waste') waste++;
      else if (r.category === 'pollution') pollution++;
      else if (r.category === 'carbon') carbon++;
    });

    return { waste, pollution, carbon, resolved, total: reports.length };
  }, [reports]);

  const data = {
    labels: ['Waste', 'Air Pollution', 'Carbon'],
    datasets: [
      {
        label: 'Reported Issues',
        data: [stats.waste, stats.pollution, stats.carbon],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)', // red
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(107, 114, 128, 0.8)', // gray
        ],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0 },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase mb-1">Total Reports</p>
            <p className="text-3xl font-black text-orange-700">{stats.total}</p>
          </div>
          <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-600">
            <FileWarning className="w-5 h-5" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-green-600 uppercase mb-1">Resolved</p>
            <p className="text-3xl font-black text-green-700">{stats.resolved}</p>
          </div>
          <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 min-h-[200px] bg-white rounded-lg border border-gray-100 p-2">
        <p className="text-xs font-bold text-gray-500 uppercase text-center mb-2 tracking-wider">Reports by Category</p>
        <div className="h-[180px]">
          <Bar data={data} options={options} />
        </div>
      </div>
      
    </div>
  );
}
