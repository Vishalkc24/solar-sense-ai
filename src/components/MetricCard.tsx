import React, { useEffect, useState } from 'react';
import { LucideIcon, Info, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
  decimals?: number;
  description?: string;
  fullUnit?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  gradient,
  delay = 0,
  decimals = 1,
  description,
  fullUnit,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 40;
    const stepDuration = duration / steps;
    const increment = value / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(current);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [value, isVisible]);

  return (
    <div
      className={`relative group bg-white/80 backdrop-blur-xl rounded-xl border border-gray-100 p-4 hover:shadow-2xl hover:shadow-green-100/40 transition-all duration-500 hover:border-green-200 overflow-hidden card-hover ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Animated gradient on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
        style={{ background: gradient }}
      />

      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: gradient, filter: 'blur(8px)' }} />
            <div className="relative w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300" style={{ background: gradient }}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          {description && (
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors cursor-help" />
              {showTooltip && (
                <div className="absolute right-0 top-6 w-52 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl z-50 animate-fade-in">
                  {description}
                  <div className="absolute -top-1.5 right-3 w-3 h-3 bg-gray-900 transform rotate-45" />
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mb-1">{title}</p>

        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-bold text-gray-900">
            {displayValue.toFixed(decimals)}
          </p>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>

        {fullUnit && (
          <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{fullUnit}</p>
        )}

        {/* Progress indicator */}
        <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: isVisible ? `${(displayValue / value) * 100}%` : '0%',
              background: gradient
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
