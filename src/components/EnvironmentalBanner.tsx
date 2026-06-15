import React from 'react';
import { TreePine, Leaf } from 'lucide-react';

interface EnvironmentalBannerProps {
  annualCO2Saved: number;
  treesEquivalent: number;
}

const EnvironmentalBanner: React.FC<EnvironmentalBannerProps> = ({
  annualCO2Saved,
  treesEquivalent,
}) => {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <TreePine className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Your Solar Impact This Year
          </h3>
          <p className="text-sm text-gray-600">
            Prevent <span className="font-semibold text-emerald-600">{annualCO2Saved.toFixed(1)} kg</span> of CO₂,
            equivalent to planting <span className="font-semibold text-emerald-600">{treesEquivalent.toFixed(0)} trees</span>.
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-white border border-emerald-200 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="w-10 h-10 rounded-lg bg-white border border-emerald-200 flex items-center justify-center">
            <TreePine className="w-4 h-4 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalBanner;
