import React, { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import { SustainabilityScore as SustainabilityScoreType } from '../utils/solarCalculations';

interface SustainabilityScoreProps {
  scoreData: SustainabilityScoreType;
}

const SustainabilityScore: React.FC<SustainabilityScoreProps> = ({ scoreData }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = scoreData.score / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= scoreData.score) {
        setDisplayScore(scoreData.score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [scoreData.score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
          <Leaf className="w-4 h-4 text-emerald-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Sustainability Score</h3>
      </div>

      <div className="flex items-center justify-center mb-4">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: 'stroke-dashoffset 0.5s ease',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(scoreData.score)}`}>{displayScore}</span>
            <span className="text-gray-400 text-xs">/ 100</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <span className={`text-sm font-semibold ${getScoreColor(scoreData.score)}`}>
          {scoreData.rating} Solar Potential
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Solar Potential</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${scoreData.factors.solarPotential}%` }} />
            </div>
            <span className="text-gray-700 w-8">{scoreData.factors.solarPotential}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Cloud Impact</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${scoreData.factors.cloudImpact}%` }} />
            </div>
            <span className="text-gray-700 w-8">{scoreData.factors.cloudImpact}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Efficiency</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${scoreData.factors.efficiency}%` }} />
            </div>
            <span className="text-gray-700 w-8">{scoreData.factors.efficiency}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Conditions</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${scoreData.factors.conditions}%` }} />
            </div>
            <span className="text-gray-700 w-8">{scoreData.factors.conditions}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityScore;
