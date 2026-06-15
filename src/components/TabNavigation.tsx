import React from 'react';
import { Sun, TrendingUp, Leaf, Brain, MapPin, MessageCircle, CalendarClock } from 'lucide-react';

export type TabId = 'forecast' | 'blueprint' | 'financial' | 'environmental' | 'ai' | 'map' | 'whatsapp';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  gradient: string;
}

const tabs: Tab[] = [
  { id: 'forecast', label: 'Forecast', icon: Sun, gradient: 'from-yellow-400 to-orange-400' },
  { id: 'blueprint', label: 'Blueprint', icon: CalendarClock, gradient: 'from-blue-400 to-indigo-400' },
  { id: 'financial', label: 'Financial', icon: TrendingUp, gradient: 'from-green-400 to-emerald-400' },
  { id: 'environmental', label: 'Environmental', icon: Leaf, gradient: 'from-emerald-400 to-teal-400' },
  { id: 'ai', label: 'AI Insights', icon: Brain, gradient: 'from-purple-400 to-indigo-400' },
  { id: 'map', label: 'Location', icon: MapPin, gradient: 'from-blue-400 to-cyan-400' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, gradient: 'from-green-500 to-green-600' },
];

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  hasData: boolean;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, hasData }) => {
  if (!hasData) return null;

  return (
    <div className="relative bg-gradient-to-r from-white/70 via-white/50 to-white/70 backdrop-blur-xl border-b border-green-100/50 sticky top-16 z-40 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-30 grid-pattern" />

      {/* Animated gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-hide">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative group flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap animate-fade-in ${
                  isActive
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 border border-green-200/50 shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 animate-pulse" />
                )}

                {/* Hover glow effect */}
                <div
                  className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 ${
                    isActive ? '' : 'bg-gradient-to-r'
                  }`}
                  style={{ background: isActive ? 'transparent' : `linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.05))` }}
                />

                <div className={`relative transition-transform duration-300 group-hover:scale-110 ${isActive ? 'animate-bounce-gentle' : ''}`}>
                  <Icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? `text-emerald-600` : 'text-gray-400 group-hover:text-gray-600'}`} />
                </div>

                <span className="relative">{tab.label}</span>

                {/* WhatsApp notification dot */}
                {tab.id === 'whatsapp' && !isActive && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-green-400 to-green-500 rounded-full animate-pulse flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  </span>
                )}

                {/* Active tab underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
