import React, { useEffect, useState } from 'react';
import { TrendingUp, Leaf, Clock, Sparkles, Info, Sun, Zap } from 'lucide-react';
import { formatCurrency } from '../utils/financialCalculations';

interface HeadlineMetricsProps {
  annualSavings: number;
  annualCO2Saved: number;
  paybackYears: number;
  roi: number;
  dailyGeneration: number;
}

const HeadlineMetrics: React.FC<HeadlineMetricsProps> = ({
  annualSavings,
  annualCO2Saved,
  paybackYears,
  roi,
  dailyGeneration,
}) => {
  const [displaySavings, setDisplaySavings] = useState(0);
  const [displayCO2, setDisplayCO2] = useState(0);
  const [displayGeneration, setDisplayGeneration] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const incrementSavings = annualSavings / steps;
    const incrementCO2 = annualCO2Saved / steps;
    const incrementGen = dailyGeneration / steps;
    let currentSavings = 0;
    let currentCO2 = 0;
    let currentGen = 0;

    const interval = setInterval(() => {
      currentSavings += incrementSavings;
      currentCO2 += incrementCO2;
      currentGen += incrementGen;

      if (currentSavings >= annualSavings && currentCO2 >= annualCO2Saved && currentGen >= dailyGeneration) {
        setDisplaySavings(annualSavings);
        setDisplayCO2(annualCO2Saved);
        setDisplayGeneration(dailyGeneration);
        clearInterval(interval);
      } else {
        if (currentSavings < annualSavings) setDisplaySavings(currentSavings);
        if (currentCO2 < annualCO2Saved) setDisplayCO2(currentCO2);
        if (currentGen < dailyGeneration) setDisplayGeneration(currentGen);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [annualSavings, annualCO2Saved, dailyGeneration]);

  const co2Tons = displayCO2 / 1000;

  return (
    <div className="relative overflow-hidden rounded-2xl animate-scale-in">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 animate-gradient-x" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/30 to-orange-400/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-400/30 to-cyan-400/20 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3 animate-float-slow" />

      {/* Solar ray pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-white/50 rounded-full animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-white/40 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative">
            <div className="absolute -inset-1 bg-white/30 rounded-xl blur animate-pulse-slow" />
            <div className="relative w-12 h-12 rounded-xl bg-white/25 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white animate-bounce-gentle" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              SolarSense AI Forecast
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur rounded-full text-[10px]">LIVE</span>
            </h2>
            <p className="text-green-100 text-sm flex items-center gap-1">
              <Sun className="w-3 h-3" />
              Powered by Open-Meteo Weather API
            </p>
          </div>
        </div>

        {/* Main prediction card */}
        <div className="bg-white/15 backdrop-blur-xl rounded-xl p-4 mb-5 border border-white/20 shadow-xl">
          <p className="text-white text-sm leading-relaxed">
            <span className="font-semibold">Today's Solar Generation:</span>{' '}
            <span className="text-yellow-300 font-bold text-2xl animate-pulse-slow">{displayGeneration.toFixed(1)} kWh</span>
          </p>
          <p className="text-green-100/80 text-xs mt-2 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Based on current weather: cloud cover, temperature, solar irradiance
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-5">
          <div className="group relative bg-white/15 backdrop-blur rounded-xl p-3 text-center hover:bg-white/25 transition-all duration-300 border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl font-bold text-white">{formatCurrency(displaySavings)}</span>
              </div>
              <div className="text-green-100 text-[10px] leading-tight">Annual<br/>Savings</div>
              <div className="text-green-200/60 text-[10px] mt-1">₹ per year</div>
            </div>
          </div>

          <div className="group relative bg-white/15 backdrop-blur rounded-xl p-3 text-center hover:bg-white/25 transition-all duration-300 border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl font-bold text-white">{co2Tons.toFixed(1)}t</span>
              </div>
              <div className="text-green-100 text-[10px] leading-tight">CO₂<br/>Offset</div>
              <div className="text-green-200/60 text-[10px] mt-1">{annualCO2Saved.toFixed(0)} kg/year</div>
            </div>
          </div>

          <div className="group relative bg-white/15 backdrop-blur rounded-xl p-3 text-center hover:bg-white/25 transition-all duration-300 border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl font-bold text-white">{paybackYears.toFixed(1)}y</span>
              </div>
              <div className="text-green-100 text-[10px] leading-tight">Payback<br/>Period</div>
              <div className="text-green-200/60 text-[10px] mt-1">breakeven</div>
            </div>
          </div>

          <div className="group relative bg-white/15 backdrop-blur rounded-xl p-3 text-center hover:bg-white/25 transition-all duration-300 border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl font-bold text-white">{roi.toFixed(0)}%</span>
              </div>
              <div className="text-green-100 text-[10px] leading-tight">Return on<br/>Investment</div>
              <div className="text-green-200/60 text-[10px] mt-1">annual ROI</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-3 flex items-start gap-2 border border-white/10">
          <Info className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5 animate-bounce-gentle" />
          <p className="text-green-100 text-xs">
            <span className="text-white font-medium">How it works:</span> We fetch real-time weather from Open-Meteo API,
            calculate solar irradiance based on your location & cloud cover, apply panel efficiency,
            and predict hourly generation. Values are projected annually from today's conditions.
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-100 text-xs">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-green-300 animate-pulse" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-300 animate-ping" />
            </div>
            <span>Live weather data</span>
          </div>
          <div className="text-green-200/60 text-xs">
            Updated {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadlineMetrics;
