import React, { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp, Sparkles, Info } from 'lucide-react';

interface FormulaDisplayProps {
  capacityKw: number;
  efficiency: number;
  performanceRatio: number;
  dailyGeneration: number;
  cloudCover: number;
}

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  capacityKw,
  efficiency,
  performanceRatio,
  dailyGeneration,
  cloudCover,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const peakSunHours = 4.5;
  const theoreticalMax = capacityKw * peakSunHours;
  const efficiencyFactor = efficiency / 100;
  const performanceFactor = performanceRatio / 100;
  const cloudFactor = cloudCover > 0 ? 1 - (cloudCover / 150) : 1;
  const calculatedOutput = theoreticalMax * efficiencyFactor * performanceFactor * cloudFactor;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-yellow-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-yellow-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
            <Calculator className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              How We Calculate This
              <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium">Hackathon MVP</span>
            </h3>
            <p className="text-gray-500 text-xs">Transparent formulas - click to see the math behind our AI</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-yellow-200 bg-white/50">
          <div className="grid gap-4 mt-4">
            <div className="bg-white rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-semibold text-gray-700">Daily Generation Formula</span>
              </div>
              <div className="font-mono text-sm bg-gray-900 text-green-400 rounded-lg p-3 mb-3 overflow-x-auto text-center">
                <code className="text-base">E (kWh) = P × H × η × PR × (1 - CC/150)</code>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded p-2 flex justify-between items-center">
                  <div>
                    <span className="text-gray-500">P = Panel Capacity</span>
                    <span className="block text-[10px] text-gray-400">Your system size</span>
                  </div>
                  <span className="font-mono text-gray-900 font-semibold">{capacityKw} kW</span>
                </div>
                <div className="bg-gray-50 rounded p-2 flex justify-between items-center">
                  <div>
                    <span className="text-gray-500">H = Peak Sun Hours</span>
                    <span className="block text-[10px] text-gray-400">Average for India</span>
                  </div>
                  <span className="font-mono text-gray-900 font-semibold">~{peakSunHours} hrs</span>
                </div>
                <div className="bg-gray-50 rounded p-2 flex justify-between items-center">
                  <div>
                    <span className="text-gray-500">η = Panel Efficiency</span>
                    <span className="block text-[10px] text-gray-400">Solar cell efficiency</span>
                  </div>
                  <span className="font-mono text-gray-900 font-semibold">{efficiency}%</span>
                </div>
                <div className="bg-gray-50 rounded p-2 flex justify-between items-center">
                  <div>
                    <span className="text-gray-500">PR = Performance Ratio</span>
                    <span className="block text-[10px] text-gray-400">System losses factor</span>
                  </div>
                  <span className="font-mono text-gray-900 font-semibold">{performanceRatio}%</span>
                </div>
                <div className="bg-gray-50 rounded p-2 flex justify-between items-center col-span-1 md:col-span-2">
                  <div>
                    <span className="text-gray-500">CC = Cloud Cover</span>
                    <span className="block text-[10px] text-gray-400">From Open-Meteo weather API (reduces output)</span>
                  </div>
                  <span className="font-mono text-gray-900 font-semibold">{cloudCover.toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-gray-700">Step-by-Step Calculation</span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Step 1: Theoretical Maximum</span>
                  <span className="text-gray-900">{capacityKw} kW × {peakSunHours} hrs = <span className="text-yellow-600">{theoreticalMax.toFixed(1)} kWh</span></span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Step 2: Apply Panel Efficiency</span>
                  <span className="text-gray-900">{theoreticalMax.toFixed(1)} × {efficiencyFactor.toFixed(2)} = <span className="text-yellow-600">{(theoreticalMax * efficiencyFactor).toFixed(1)} kWh</span></span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Step 3: Apply Performance Ratio</span>
                  <span className="text-gray-900">{(theoreticalMax * efficiencyFactor).toFixed(1)} × {performanceFactor.toFixed(2)} = <span className="text-yellow-600">{(theoreticalMax * efficiencyFactor * performanceFactor).toFixed(1)} kWh</span></span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Step 4: Apply Cloud Factor</span>
                  <span className="text-gray-900">{(theoreticalMax * efficiencyFactor * performanceFactor).toFixed(1)} × {cloudFactor.toFixed(2)} = <span className="text-emerald-600 font-bold">{calculatedOutput.toFixed(1)} kWh</span></span>
                </div>
                <div className="flex items-center justify-between py-3 bg-emerald-50 rounded px-2 -mx-2 mt-2">
                  <span className="text-emerald-700 font-semibold">AI Model Output (Today):</span>
                  <span className="text-emerald-600 font-bold text-lg">{dailyGeneration.toFixed(1)} kWh</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 flex items-start gap-2">
                <Info className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>
                  The AI model uses real-time hourly weather data from Open-Meteo API, calculating solar geometry for each hour
                  to provide precise predictions.
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <h4 className="text-xs font-semibold text-emerald-800 mb-2">Unit Explanations:</h4>
              <ul className="space-y-1 text-xs">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span><strong>kW (kilowatt)</strong> = 1000 watts - measures power capacity of your panels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span><strong>kWh (kilowatt-hour)</strong> = energy produced (1 kW running for 1 hour = 1 kWh)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span><strong>Efficiency %</strong> = How much sunlight your panels convert to electricity (15-22% typical)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span><strong>Performance Ratio %</strong> = System efficiency including inverter losses, wiring, etc.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaDisplay;
