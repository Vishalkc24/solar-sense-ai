import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CO2Savings } from '../utils/solarCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CO2SavingsChartProps {
  savings: CO2Savings;
}

const CO2SavingsChart: React.FC<CO2SavingsChartProps> = ({ savings }) => {
  const data = {
    labels: ['Daily', 'Weekly', 'Monthly', 'Annual'],
    datasets: [
      {
        label: 'CO₂ Saved (kg)',
        data: [savings.daily, savings.weekly, savings.monthly, savings.annual],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(22, 163, 74, 0.8)',
          'rgba(21, 128, 61, 0.8)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(34, 197, 94)',
          'rgb(22, 163, 74)',
          'rgb(21, 128, 61)',
        ],
        borderWidth: 1,
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
        backgroundColor: '#fff',
        titleColor: '#111',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(2)} kg CO₂ saved`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: { size: 11 },
        },
      },
      y: {
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          callback: (value: any) => `${value} kg`,
          font: { size: 10 },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">CO₂ Savings Projection</h3>
      <div className="h-48">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default CO2SavingsChart;
