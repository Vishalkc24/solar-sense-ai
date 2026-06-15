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
  Filler,
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
  Legend,
  Filler
);

interface SolarForecastChartProps {
  hourlyData: HourlyForecast[];
}

const SolarForecastChart: React.FC<SolarForecastChartProps> = ({ hourlyData }) => {
  const labels = hourlyData.map(h => formatTime(h.time));

  const data = {
    labels,
    datasets: [
      {
        label: 'Solar Output (kWh)',
        data: hourlyData.map(h => h.solarOutput),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: 'rgb(16, 185, 129)',
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
          label: (context: any) => `${context.parsed.y.toFixed(2)} kWh`,
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
          callback: (value: any) => `${value} kWh`,
          font: { size: 10 },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Hourly Solar Forecast</h3>
      <div className="h-48">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SolarForecastChart;
