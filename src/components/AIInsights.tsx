import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface AIInsightsProps {
  insights: string[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  const getIcon = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('high') || lowerText.includes('excellent') || lowerText.includes('optimal')) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
    if (lowerText.includes('reduce') || lowerText.includes('may') || lowerText.includes('expected')) {
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
    if (lowerText.includes('increase') || lowerText.includes('more') || lowerText.includes('optimize')) {
      return <TrendingUp className="w-4 h-4 text-blue-500" />;
    }
    return <Info className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-yellow-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Solar Insights</h3>
      </div>

      <div className="space-y-2">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(insight)}
            </div>
            <p className="text-gray-700 text-sm">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
