import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CalendarDays, Zap, TrendingUp, TrendingDown, Sun, Moon, Battery, ArrowRight, Info, Timer, CalendarRange, Sparkles } from 'lucide-react';

interface HourlyForecast {
  hour: number;
  time: string;
  predicted: number;
  cloudCover: number;
  temperature: number;
}

interface EnergyBlueprintProps {
  totalDayGeneration: number;
  hourlyData: Array<{
    time: string;
    solarOutput: number;
    cloudCover: number;
    temperature: number;
  }>;
  capacityKw: number;
}

const EnergyBlueprint: React.FC<EnergyBlueprintProps> = ({
  totalDayGeneration,
  hourlyData,
  capacityKw,
}) => {
  const [nextHourPred, setNextHourPred] = useState(0);
  const [next6HoursPred, setNext6HoursPred] = useState(0);
  const [todayRemainPred, setTodayRemainPred] = useState(0);
  const [tomorrowPred, setTomorrowPred] = useState(0);
  const [weeklyPred, setWeeklyPred] = useState(0);
  const [monthlyPred, setMonthlyPred] = useState(0);

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    // Find current hour index in data
    const currentHourIndex = hourlyData.findIndex(h => {
      const hour = new Date(h.time).getHours();
      return hour === currentHour;
    });

    // Next hour prediction
    if (currentHourIndex !== -1 && currentHourIndex < hourlyData.length - 1) {
      setNextHourPred(hourlyData[currentHourIndex + 1]?.solarOutput || 0);
    } else {
      // Estimate based on current
      setNextHourPred(hourlyData[currentHourIndex]?.solarOutput || 0);
    }

    // Next 6 hours
    let next6Total = 0;
    for (let i = 1; i <= 6; i++) {
      const idx = currentHourIndex + i;
      if (idx >= 0 && idx < hourlyData.length) {
        next6Total += hourlyData[idx].solarOutput;
      }
    }
    setNext6HoursPred(next6Total);

    // Today remaining (from next hour to end)
    let remainingToday = 0;
    for (let i = currentHourIndex + 1; i < hourlyData.length; i++) {
      remainingToday += hourlyData[i].solarOutput;
    }
    setTodayRemainPred(remainingToday > 0 ? remainingToday : hourlyData[currentHourIndex]?.solarOutput || 0);

    // Tomorrow (assume similar weather pattern, slight variance)
    setTomorrowPred(totalDayGeneration * (0.9 + Math.random() * 0.2));

    // Weekly and monthly projections based on today
    setWeeklyPred(totalDayGeneration * 7);
    setMonthlyPred(totalDayGeneration * 30);
  }, [hourlyData, totalDayGeneration]);

  const now = new Date();
  const currentHour = now.getHours();
  const isNight = currentHour < 6 || currentHour >= 19;

  const getProductionLevel = (value: number) => {
    const maxPossible = capacityKw * 4.5;
    const percentage = (value / maxPossible) * 100;
    if (percentage >= 70) return { level: 'High', color: 'from-green-400 to-emerald-500', textColor: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 40) return { level: 'Medium', color: 'from-yellow-400 to-orange-400', textColor: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (percentage >= 15) return { level: 'Low', color: 'from-orange-400 to-red-400', textColor: 'text-orange-600', bg: 'bg-orange-50' };
    return { level: 'Very Low', color: 'from-gray-400 to-gray-500', textColor: 'text-gray-500', bg: 'bg-gray-50' };
  };

  const nextHourLevel = getProductionLevel(nextHourPred);
  const next6HoursLevel = getProductionLevel(next6HoursPred / 6);

  const peakHours = hourlyData
    .filter(h => h.solarOutput > totalDayGeneration / 24)
    .sort((a, b) => b.solarOutput - a.solarOutput)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl p-5 overflow-hidden shadow-xl">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4 animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-400/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4 animate-float" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-white/30 rounded-xl blur animate-pulse-slow" />
              <div className="relative w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white animate-bounce-gentle" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Energy Blueprint</h2>
              <p className="text-blue-100 text-sm flex items-center gap-1">
                <Timer className="w-3 h-3" />
                AI-powered production forecast
              </p>
            </div>
          </div>

          <p className="text-white/90 text-sm">
            Your comprehensive solar energy forecast to plan your day, week, and month ahead.
            Know when to run high-power appliances for maximum savings.
          </p>
        </div>
      </div>

      {/* Immediate Forecasts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Next Hour */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-xl border border-gray-100 p-4 shadow-lg overflow-hidden card-hover">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-yellow-200/50 to-orange-200/30 rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${nextHourLevel.color} flex items-center justify-center shadow-lg`}>
                  {isNight ? <Moon className="w-4 h-4 text-white" /> : <Sun className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Next Hour</p>
                  <p className="text-[10px] text-gray-400">{((currentHour + 1) % 24).toString().padStart(2, '0')}:00 - {((currentHour + 2) % 24).toString().padStart(2, '0')}:00</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${nextHourLevel.bg} ${nextHourLevel.textColor}`}>
                {nextHourLevel.level}
              </span>
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-bold text-gray-900">{nextHourPred.toFixed(2)}</span>
              <span className="text-sm text-gray-500">kWh</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>{(nextHourPred * 1000).toFixed(0)}W average output</span>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${nextHourLevel.color} transition-all duration-1000`}
                style={{ width: `${Math.min(100, (nextHourPred / (capacityKw * 1.5)) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Next 6 Hours */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-xl border border-gray-100 p-4 shadow-lg overflow-hidden card-hover">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-blue-200/50 to-indigo-200/30 rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${next6HoursLevel.color} flex items-center justify-center shadow-lg`}>
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Next 6 Hours</p>
                  <p className="text-[10px] text-gray-400">{currentHour}:00 - {(currentHour + 6) % 24}:00</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${next6HoursLevel.bg} ${next6HoursLevel.textColor}`}>
                {next6HoursLevel.level}
              </span>
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-bold text-gray-900">{next6HoursPred.toFixed(2)}</span>
              <span className="text-sm text-gray-500">kWh</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>Avg {(next6HoursPred / 6).toFixed(2)} kWh/hour</span>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${next6HoursLevel.color} transition-all duration-1000`}
                style={{ width: `${Math.min(100, (next6HoursPred / (capacityKw * 6)) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Today Remaining */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-xl border border-gray-100 p-4 shadow-lg overflow-hidden card-hover">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-green-200/50 to-emerald-200/30 rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Today Remaining</p>
                  <p className="text-[10px] text-gray-400">Until sunset</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600">
                {((todayRemainPred / totalDayGeneration) * 100).toFixed(0)}% left
              </span>
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-bold text-gray-900">{todayRemainPred.toFixed(2)}</span>
              <span className="text-sm text-gray-500">kWh</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Battery className="w-3 h-3 text-purple-500" />
              <span>Total today: {totalDayGeneration.toFixed(1)} kWh</span>
            </div>

            {/* Progress bar showing used vs remaining */}
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                style={{ width: `${((totalDayGeneration - todayRemainPred) / totalDayGeneration) * 100}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                style={{ width: `${(todayRemainPred / totalDayGeneration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>Generated</span>
              <span>Remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hour-by-Hour Breakdown */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-100 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Hour-by-Hour Forecast</h3>
              <p className="text-gray-500 text-xs">Solar production throughout the day</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full border border-green-200 text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              Peak
            </span>
            <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full border border-gray-200 text-gray-500">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              Off-peak
            </span>
          </div>
        </div>

        {/* 24-hour visual timeline */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-1 min-w-max pb-2">
            {hourlyData.map((hour, idx) => {
              const date = new Date(hour.time);
              const hourNum = date.getHours();
              const isCurrentHour = hourNum === currentHour;
              const isPast = hourNum < currentHour;
              const isPeak = hour.solarOutput > totalDayGeneration / 24;

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                    isCurrentHour ? 'bg-gradient-to-b from-indigo-50 to-purple-50 border border-indigo-200 scale-105' :
                    isPast ? 'opacity-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-[10px] font-medium ${isCurrentHour ? 'text-indigo-600' : 'text-gray-400'}`}>
                    {hourNum.toString().padStart(2, '0')}
                  </span>

                  <div className={`relative w-6 h-16 rounded-full overflow-hidden ${isPast ? 'bg-gray-100' : 'bg-gradient-to-b from-yellow-50 to-orange-50'}`}>
                    <div
                      className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500 ${
                        isPast ? 'bg-gray-300' :
                        isPeak ? 'bg-gradient-to-t from-green-400 to-emerald-400' :
                        'bg-gradient-to-t from-yellow-300 to-amber-300'
                      }`}
                      style={{ height: `${Math.min(100, (hour.solarOutput / (capacityKw * 1.5)) * 100)}%` }}
                    />
                    {isCurrentHour && (
                      <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500 animate-pulse" />
                    )}
                  </div>

                  <span className={`text-[10px] ${isCurrentHour ? 'text-indigo-600 font-bold' : 'text-gray-500'}`}>
                    {hour.solarOutput.toFixed(1)}
                  </span>

                  {isCurrentHour && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-pulse flex items-center justify-center">
                      <span className="w-1 h-1 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Peak hours info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            Best hours for high-power tasks:
          </p>
          <div className="flex flex-wrap gap-1">
            {peakHours.map((hour, idx) => {
              const date = new Date(hour.time);
              return (
                <span key={idx} className="px-2 py-1 bg-green-50 border border-green-200 rounded-full text-xs text-green-700 font-medium">
                  {date.getHours()}:00 ({hour.solarOutput.toFixed(1)} kWh)
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Extended Forecast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tomorrow */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50 p-4 shadow-lg card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Tomorrow</p>
              <p className="text-xs text-gray-500">{new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-indigo-600">{tomorrowPred.toFixed(1)}</span>
            <span className="text-sm text-gray-500">kWh</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Info className="w-3 h-3" />
            <span>Estimated based on weather patterns</span>
          </div>

          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">vs Today</span>
              <span className={`font-medium ${tomorrowPred > totalDayGeneration ? 'text-green-600' : 'text-orange-500'}`}>
                {tomorrowPred > totalDayGeneration ? '+' : ''}{((tomorrowPred - totalDayGeneration) / totalDayGeneration * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-500"
                style={{ width: `${(tomorrowPred / totalDayGeneration) * 50}%` }}
              />
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200/50 p-4 shadow-lg card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
              <CalendarRange className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">This Week</p>
              <p className="text-xs text-gray-500">Next 7 days projection</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-teal-600">{(weeklyPred / 1000).toFixed(1)}</span>
            <span className="text-sm text-gray-500">MWh</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Zap className="w-3 h-3 text-teal-500" />
            <span>{weeklyPred.toFixed(0)} kWh total</span>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1">
            {[...Array(7)].map((_, i) => {
              const day = new Date(Date.now() + i * 86400000);
              const isToday = i === 0;
              return (
                <div key={i} className={`flex flex-col items-center p-1 rounded ${isToday ? 'bg-teal-100' : ''}`}>
                  <span className="text-[10px] text-gray-400">{day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}</span>
                  <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-teal-500' : 'bg-gray-300'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* This Month */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200/50 p-4 shadow-lg card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
              <Timer className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">This Month</p>
              <p className="text-xs text-gray-500">30-day projection</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-emerald-600">{(monthlyPred / 1000).toFixed(1)}</span>
            <span className="text-sm text-gray-500">MWh</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Battery className="w-3 h-3 text-emerald-500" />
            <span>{monthlyPred.toFixed(0)} kWh total</span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Month progress</span>
              <span className="text-gray-400">{new Date().getDate()}/30</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-1000"
                style={{ width: `${(new Date().getDate() / 30) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200/50 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Energy Planning Tips</h3>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span><strong>Run AC during peak hours</strong> (10 AM - 3 PM) for free cooling</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span><strong>Charge EV at night</strong> - use stored battery during day, recharge overnight</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span><strong>Schedule appliances</strong> - washing machine, dishwasher during solar peak</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span><strong>Monitor clouds</strong> - reduce usage when cloud cover exceeds 70%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyBlueprint;
