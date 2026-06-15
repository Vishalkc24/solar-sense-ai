import React from 'react';
import { Zap, Clock, Battery, Home, Lightbulb } from 'lucide-react';

interface AIEnergyAdvisorProps {
  recommendations: string[];
}

const AIEnergyAdvisor: React.FC<AIEnergyAdvisorProps> = ({ recommendations }) => {
  const getIcon = (index: number) => {
    const icons = [Clock, Battery, Home, Lightbulb, Zap];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="w-4 h-4" />;
  };

  const getIconColor = (index: number) => {
    const colors = ['bg-blue-100 text-blue-600', 'bg-teal-100 text-teal-600', 'bg-purple-100 text-purple-600', 'bg-yellow-100 text-yellow-600', 'bg-emerald-100 text-emerald-600'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
          <Zap className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Energy Usage Advisor</h3>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center ${getIconColor(index)}`}>
              {getIcon(index)}
            </div>
            <p className="text-gray-700 text-sm">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIEnergyAdvisor;
