import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatTime } from '../services/weatherService';
import { HourlyForecast } from '../utils/solarCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CloudCoverChartProps {
  hourlyData: HourlyForecast[];
}

const CloudCoverChart: React.FC<CloudCoverChartProps> = ({ hourlyData }) => {
  const labels = hourlyData.map(h => formatTime(h.time));

  const data = {
    labels,
    datasets: [
      {
        label: 'Cloud Cover (%)',
        data: hourlyData.map(h => h.cloudCover),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
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
        backgroundColor: '#fff',
        titleColor: '#111',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y}% cloud cover`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          maxRotation: 45,
          minRotation: 45,
          font: { size: 10 },
        },
      },
      y: {
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          callback: (value: any) => `${value}%`,
          font: { size: 10 },
        },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Cloud Cover Forecast</h3>
      <div className="h-48">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default CloudCoverChart;
