import React, { useState } from 'react';
import { CheckCircle2, TrendingUp, Clock, Thermometer, Sun, Cloud, Target, Info } from 'lucide-react';

interface PredictionVerificationProps {
  predictedGeneration: number;
  peakHours: string[];
  sunrise: string;
  sunset: string;
  avgTemperature: number;
}

const PredictionVerification: React.FC<PredictionVerificationProps> = ({
  predictedGeneration,
  peakHours,
  sunrise,
  sunset,
  avgTemperature,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Simulated actual data (in production, this would come from real measurements)
  const actualGeneration = predictedGeneration * (0.92 + Math.random() * 0.16); // ±8% variance
  const accuracy = Math.min(100, 100 - Math.abs((actualGeneration - predictedGeneration) / predictedGeneration) * 100);

  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  // Simulated hourly actuals
  const hourlyActuals = peakHours.map((hour, idx) => {
    const predictedValue = predictedGeneration / peakHours.length;
    return {
      time: hour,
      predicted: predictedValue.toFixed(2),
      actual: (predictedValue * (0.85 + Math.random() * 0.3)).toFixed(2),
    };
  });

  const sunriseTime = new Date(sunrise).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = new Date(sunset).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-white to-green-50 rounded-xl border border-green-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Prediction Verification</h3>
              <p className="text-gray-500 text-xs">Morning forecast vs end-of-day actuals</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Accuracy</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              accuracy >= 90 ? 'bg-green-100 text-green-700' : accuracy >= 80 ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {accuracy.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-500">Morning Prediction</span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-gray-900">{predictedGeneration.toFixed(1)}</p>
              <span className="text-sm text-gray-500">kWh</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Sent via WhatsApp at 6:00 AM</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-600">Actual Generation</span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-green-700">{actualGeneration.toFixed(1)}</p>
              <span className="text-sm text-green-500">kWh</span>
            </div>
            <p className="text-xs text-green-400 mt-1">Measured at {currentTime.toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
          <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-gray-700 text-xs font-medium mb-1">Important Note</p>
            <p className="text-gray-600 text-xs">
              Our algorithm predicted <strong>{predictedGeneration.toFixed(1)} kWh</strong> this morning based on weather forecasts.
              Actual generation was <strong>{actualGeneration.toFixed(1)} kWh</strong> - achieving <strong>{accuracy.toFixed(0)}%</strong> accuracy!
              Typical error margin: ±15% due to real-time weather changes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-500">Avg Temperature</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{avgTemperature.toFixed(1)}°C</p>
            <p className="text-xs text-gray-400">Affects panel efficiency</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Sun className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-500">Solar Window</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{sunriseTime} - {sunsetTime}</p>
            <p className="text-xs text-gray-400">Peak production hours</p>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 py-2 hover:bg-emerald-50 rounded transition-colors"
        >
          {showDetails ? 'Hide Details' : 'View Hour-by-Hour Breakdown'}
        </button>

        {showDetails && (
          <div className="mt-4 space-y-2">
            <div className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Peak Hours Performance (Hours with highest solar output)
            </div>
            {hourlyActuals.map((hour, idx) => {
              const predicted = parseFloat(hour.predicted);
              const actual = parseFloat(hour.actual);
              const efficiency = (actual / predicted) * 100;
              return (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-600 w-16 font-mono">{hour.time}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full ${efficiency >= 100 ? 'bg-green-400' : efficiency >= 80 ? 'bg-yellow-400' : 'bg-orange-400'}`}
                      style={{ width: `${Math.min(100, efficiency)}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
                      {actual.toFixed(1)} / {predicted.toFixed(1)} kWh
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-500">
              <strong>Key:</strong> Green = met or exceeded prediction, Yellow = within 20%, Orange = below 80%
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sun className="w-5 h-5" />
          <span className="font-semibold">Great Performance Today!</span>
        </div>
        <p className="text-green-100 text-sm mb-3">
          Your solar system performed within <span className="text-white font-bold">{(100 - accuracy).toFixed(1)}%</span> of our AI prediction.
          {accuracy >= 90 ? ' Excellent solar conditions!' : ' Weather variations affected output.'}
        </p>
        <div className="bg-white/10 rounded-lg p-3 text-sm">
          <p className="text-green-100">
            <strong className="text-white">What this means:</strong> 1 kWh = running a 1000W appliance for 1 hour.
            Your {actualGeneration.toFixed(1)} kWh today could power:
          </p>
          <ul className="mt-2 space-y-1 text-green-100 text-xs">
            <li>• LED bulb (10W) for {(actualGeneration * 100).toFixed(0)} hours</li>
            <li>• Ceiling fan (75W) for {(actualGeneration * 1000 / 75).toFixed(0)} hours</li>
            <li>• AC (1500W) for {(actualGeneration * 1000 / 1500).toFixed(1)} hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PredictionVerification;
