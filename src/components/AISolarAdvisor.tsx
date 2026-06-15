import React from 'react';
import { Sun, TrendingUp, Percent, PiggyBank, Battery, Building2 } from 'lucide-react';

interface AISolarAdvisorProps {
  recommendations: string[];
}

const AISolarAdvisor: React.FC<AISolarAdvisorProps> = ({ recommendations }) => {
  const getIcon = (rec: string) => {
    const text = rec.toLowerCase();
    if (text.includes('undersized') || text.includes('oversized') || text.includes('capacity')) {
      return <Sun className="w-4 h-4 text-yellow-600" />;
    }
    if (text.includes('efficiency') || text.includes('panel')) {
      return <Percent className="w-4 h-4 text-emerald-600" />;
    }
    if (text.includes('investment') || text.includes('payback') || text.includes('profit')) {
      return <PiggyBank className="w-4 h-4 text-green-600" />;
    }
    if (text.includes('battery')) {
      return <Battery className="w-4 h-4 text-blue-600" />;
    }
    return <TrendingUp className="w-4 h-4 text-cyan-600" />;
  };

  const getBgClass = (rec: string) => {
    const text = rec.toLowerCase();
    if (text.includes('excellent')) {
      return 'bg-green-50';
    }
    if (text.includes('consider') || text.includes('adding')) {
      return 'bg-blue-50';
    }
    return 'bg-gray-50';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
          <Sun className="w-4 h-4 text-yellow-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Solar Capacity Advisor</h3>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors ${getBgClass(rec)}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(rec)}
            </div>
            <p className="text-gray-700 text-sm">{rec}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
        <div className="flex items-center gap-1 mb-1">
          <Building2 className="w-3 h-3 text-amber-600" />
          <span className="text-xs text-amber-700 font-medium">Pro Tip</span>
        </div>
        <p className="text-xs text-amber-800">
          India offers 40% accelerated depreciation for businesses & 100% tax deduction under Section 80-IA for solar power projects.
        </p>
      </div>
    </div>
  );
};

export default AISolarAdvisor;
