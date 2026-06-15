import React, { useState } from 'react';
import { Sun, Cloud, Thermometer, Droplets, Wind, Eye, TreePine, Fuel, Battery, Zap, Activity } from 'lucide-react';
import InputForm from './components/InputForm';
import MetricCard from './components/MetricCard';
import SolarForecastChart from './components/SolarForecastChart';
import CloudCoverChart from './components/CloudCoverChart';
import CO2SavingsChart from './components/CO2SavingsChart';
import LocationMap from './components/LocationMap';
import AIInsights from './components/AIInsights';
import SustainabilityScore from './components/SustainabilityScore';
import HeadlineMetrics from './components/HeadlineMetrics';
import FinancialDashboard from './components/FinancialDashboard';
import AIEnergyAdvisor from './components/AIEnergyAdvisor';
import AISolarAdvisor from './components/AISolarAdvisor';
import WhatsAppSubscription from './components/WhatsAppSubscription';
import FormulaDisplay from './components/FormulaDisplay';
import PredictionVerification from './components/PredictionVerification';
import EnergyBlueprint from './components/EnergyBlueprint';
import TabNavigation, { TabId } from './components/TabNavigation';
import { fetchWeatherData } from './services/weatherService';
import {
  generateSolarForecast,
  calculateCO2Savings,
  calculateEnvironmentalEquivalents,
  calculateSustainabilityScore,
  generateAIInsights,
  WeatherData,
  SolarForecast,
  CO2Savings,
  EnvironmentalEquivalents,
  SustainabilityScore as SustainabilityScoreType,
} from './utils/solarCalculations';
import {
  calculateFinancialSavings,
  calculateCarbonCredits,
  calculateSolarInvestment,
  generateEnergyUsageRecommendations,
  generateSolarAdvisorRecommendations,
  FinancialSavings,
  CarbonCredits,
  SolarInvestment,
} from './utils/financialCalculations';

interface SystemConfig {
  latitude: number;
  longitude: number;
  capacityKw: number;
  efficiency: number;
  performanceRatio: number;
  monthlyBill: number;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<SolarForecast | null>(null);
  const [co2Savings, setCO2Savings] = useState<CO2Savings | null>(null);
  const [envEquivalents, setEnvEquivalents] = useState<EnvironmentalEquivalents | null>(null);
  const [sustainabilityScore, setSustainabilityScore] = useState<SustainabilityScoreType | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('forecast');

  const [financialSavings, setFinancialSavings] = useState<FinancialSavings | null>(null);
  const [carbonCredits, setCarbonCredits] = useState<CarbonCredits | null>(null);
  const [solarInvestment, setSolarInvestment] = useState<SolarInvestment | null>(null);
  const [energyRecommendations, setEnergyRecommendations] = useState<string[]>([]);
  const [solarAdvisorRecommendations, setSolarAdvisorRecommendations] = useState<string[]>([]);

  const handleSubmit = async (data: SystemConfig) => {
    setIsLoading(true);
    setError(null);
    setConfig(data);

    try {
      const weather = await fetchWeatherData(data.latitude, data.longitude);
      setWeatherData(weather);

      const solarForecast = generateSolarForecast(
        weather,
        data.capacityKw,
        data.efficiency,
        data.performanceRatio
      );
      setForecast(solarForecast);

      const annualGeneration = solarForecast.totalDayGeneration * 365;
      const co2 = calculateCO2Savings(solarForecast.totalDayGeneration);
      setCO2Savings(co2);

      const equivalents = calculateEnvironmentalEquivalents(co2.annual, annualGeneration);
      setEnvEquivalents(equivalents);

      const avgCloudCover = weather.hourly.cloud_cover.slice(0, 24).reduce((a, b) => a + b, 0) / 24;
      const avgVisibility = weather.hourly.visibility.slice(0, 24).reduce((a, b) => a + b, 0) / 24;
      const score = calculateSustainabilityScore(
        solarForecast.totalDayGeneration,
        avgCloudCover,
        data.efficiency,
        data.performanceRatio,
        data.capacityKw,
        avgVisibility
      );
      setSustainabilityScore(score);

      const aiInsights = generateAIInsights(solarForecast, weather, score.score);
      setInsights(aiInsights);

      const finSavings = calculateFinancialSavings(annualGeneration);
      setFinancialSavings(finSavings);

      const credits = calculateCarbonCredits(co2.annual);
      setCarbonCredits(credits);

      const investment = calculateSolarInvestment(data.capacityKw);
      setSolarInvestment(investment);

      const peakHours = solarForecast.hourly
        .filter(h => h.solarOutput > solarForecast.totalDayGeneration / 24)
        .map(h => {
          const date = new Date(h.time);
          return `${date.getHours()}:00`;
        });

      const energyRecs = generateEnergyUsageRecommendations(
        solarForecast.totalDayGeneration,
        peakHours,
        data.monthlyBill
      );
      setEnergyRecommendations(energyRecs);

      const solarRecs = generateSolarAdvisorRecommendations(
        data.capacityKw,
        data.efficiency,
        data.monthlyBill
      );
      setSolarAdvisorRecommendations(solarRecs);

      setActiveTab('forecast');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const hasData = forecast !== null;

  const renderTabContent = () => {
    if (!forecast || !weatherData || !co2Savings || !sustainabilityScore || !config || !financialSavings || !carbonCredits || !solarInvestment) {
      return null;
    }

    const avgCloudCover = weatherData.hourly.cloud_cover.slice(0, 24).reduce((a, b) => a + b, 0) / 24;
    const avgTemperature = weatherData.hourly.temperature_2m.slice(0, 24).reduce((a, b) => a + b, 0) / 24;
    const peakHours = forecast.hourly
      .filter(h => h.solarOutput > forecast.totalDayGeneration / 24)
      .map(h => {
        const date = new Date(h.time);
        return `${date.getHours()}:00`;
      });

    switch (activeTab) {
      case 'forecast':
        return (
          <div className="space-y-4">
            <HeadlineMetrics
              annualSavings={financialSavings.annualSavings}
              annualCO2Saved={co2Savings.annual}
              paybackYears={financialSavings.paybackYears}
              roi={financialSavings.roi}
              dailyGeneration={forecast.totalDayGeneration}
            />

            <FormulaDisplay
              capacityKw={config.capacityKw}
              efficiency={config.efficiency}
              performanceRatio={config.performanceRatio}
              dailyGeneration={forecast.totalDayGeneration}
              cloudCover={avgCloudCover}
            />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <MetricCard
                title="Today's Generation"
                value={forecast.totalDayGeneration}
                unit="kWh"
                icon={Sun}
                gradient="linear-gradient(135deg, #fbbf24, #f59e0b)"
                description="Total electricity your solar panels will produce today based on weather conditions"
                fullUnit="kilowatt-hours"
              />
              <MetricCard
                title="CO₂ Saved Today"
                value={co2Savings.daily}
                unit="kg"
                icon={Cloud}
                gradient="linear-gradient(135deg, #34d399, #10b981)"
                description="Carbon dioxide emissions prevented by using solar instead of grid electricity"
                fullUnit="kilograms of CO₂"
              />
              <MetricCard
                title="Trees Equivalent"
                value={envEquivalents?.treesEquivalent || 0}
                unit="trees"
                icon={TreePine}
                gradient="linear-gradient(135deg, #22c55e, #16a34a)"
                decimals={0}
                description="Number of trees that would absorb this much CO₂ in 1 year"
                fullUnit="full-grown trees"
              />
              <MetricCard
                title="Petrol Offset"
                value={envEquivalents?.petrolSaved || 0}
                unit="L"
                icon={Fuel}
                gradient="linear-gradient(135deg, #3b82f6, #2563eb)"
                decimals={1}
                description="Liters of petrol that would produce equivalent emissions"
                fullUnit="liters of petrol"
              />
              <MetricCard
                title="EV Charges"
                value={envEquivalents?.evCharges || 0}
                unit="charges"
                icon={Battery}
                gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)"
                decimals={1}
                description="Full charges for an average EV (60 kWh battery capacity)"
                fullUnit="full battery charges"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SolarForecastChart hourlyData={forecast.hourly} />
              <CloudCoverChart hourlyData={forecast.hourly} />
            </div>

            <CO2SavingsChart savings={co2Savings} />

            <PredictionVerification
              predictedGeneration={forecast.totalDayGeneration}
              peakHours={peakHours}
              sunrise={forecast.daily.sunrise}
              sunset={forecast.daily.sunset}
              avgTemperature={avgTemperature}
            />
          </div>
        );

      case 'blueprint':
        return (
          <EnergyBlueprint
            totalDayGeneration={forecast.totalDayGeneration}
            hourlyData={forecast.hourly}
            capacityKw={config.capacityKw}
          />
        );

      case 'financial':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FinancialDashboard
              financialSavings={financialSavings}
              carbonCredits={carbonCredits}
              solarInvestment={solarInvestment}
              annualGeneration={forecast.totalDayGeneration * 365}
              capacityKw={config.capacityKw}
            />
            <div className="space-y-4">
              <AIEnergyAdvisor recommendations={energyRecommendations} />
              <SustainabilityScore scoreData={sustainabilityScore} />
            </div>
          </div>
        );

      case 'environmental':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Environmental Impact</h3>
              <p className="text-gray-600 text-xs mb-4">
                Your solar installation creates positive environmental impact by reducing carbon emissions. All values below are <strong>annual projections</strong> based on today's generation × 365 days.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
                  <TreePine className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{envEquivalents?.treesEquivalent.toFixed(0) || 0}</p>
                  <p className="text-xs text-gray-500">Trees Equivalent</p>
                  <p className="text-[10px] text-gray-400 mt-1">per year</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <Fuel className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{envEquivalents?.petrolSaved.toFixed(0) || 0}</p>
                  <p className="text-xs text-gray-500">Liters Petrol</p>
                  <p className="text-[10px] text-gray-400 mt-1">offset annually</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-100">
                  <Battery className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{envEquivalents?.evCharges.toFixed(0) || 0}</p>
                  <p className="text-xs text-gray-500">EV Charges</p>
                  <p className="text-[10px] text-gray-400 mt-1">(60 kWh battery) per year</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-100">
                  <Cloud className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{co2Savings.annual.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">kg CO₂ Avoided</p>
                  <p className="text-[10px] text-gray-400 mt-1">vs grid electricity</p>
                </div>
              </div>
            </div>
            <SustainabilityScore scoreData={sustainabilityScore} />
          </div>
        );

      case 'ai':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AISolarAdvisor recommendations={solarAdvisorRecommendations} />
            <div className="space-y-4">
              <AIInsights insights={insights} />
              <AIEnergyAdvisor recommendations={energyRecommendations} />
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LocationMap latitude={config.latitude} longitude={config.longitude} />
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Weather</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Thermometer className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-gray-500">Temperature</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{weatherData.current.temperature_2m.toFixed(1)}°C</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Cloud className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-gray-500">Cloud Cover</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{weatherData.current.cloud_cover}%</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Droplets className="w-3 h-3 text-cyan-400" />
                    <span className="text-xs text-gray-500">Humidity</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{weatherData.current.relative_humidity_2m}%</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Wind className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">Wind Speed</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{weatherData.current.wind_speed_10m.toFixed(1)} km/h</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Eye className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-gray-500">Visibility</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{weatherData.current.visibility.toFixed(1)} km</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-gray-500">Peak Time</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {new Date(forecast.daily.peakGenerationHour).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Daily Solar Schedule</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-yellow-50 rounded-lg p-2">
                    <Sun className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Sunrise</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(forecast.daily.sunrise).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2">
                    <Sun className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Peak</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(forecast.daily.peakGenerationHour).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2">
                    <Sun className="w-4 h-4 text-red-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Sunset</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(forecast.daily.sunset).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="max-w-lg mx-auto">
            <WhatsAppSubscription
              latitude={config.latitude}
              longitude={config.longitude}
              capacityKw={config.capacityKw}
              efficiency={config.efficiency}
              performanceRatio={config.performanceRatio}
              monthlyBill={config.monthlyBill}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-yellow-200/30 to-orange-200/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-200/20 to-cyan-200/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-20 left-1/3 w-60 h-60 bg-gradient-to-br from-emerald-100/40 to-green-100/30 rounded-full blur-2xl animate-pulse-slow" />
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-30 grid-pattern" />

      <header className="bg-white/70 backdrop-blur-xl border-b border-green-100/50 sticky top-0 z-50 shadow-lg shadow-green-100/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-xl blur opacity-40 animate-pulse-slow" />
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <Sun className="w-6 h-6 text-white animate-spin-slow" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  SolarSense AI
                </h1>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                  Climate-Finance Intelligence
                </p>
              </div>
            </div>

            {weatherData && hasData && (
              <div className="flex items-center gap-3 text-xs bg-gradient-to-r from-green-50/90 to-emerald-50/90 backdrop-blur-sm rounded-full px-4 py-2 border border-green-200/50 shadow-sm animate-slide-down">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <Thermometer className="w-3 h-3 text-red-400" />
                  <span className="text-gray-700 font-medium">{weatherData.current.temperature_2m.toFixed(0)}°C</span>
                </div>
                <div className="w-px h-4 bg-gradient-to-b from-green-200 to-green-300" />
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <Cloud className="w-3 h-3 text-blue-400" />
                  <span className="text-gray-700 font-medium">{weatherData.current.cloud_cover}%</span>
                </div>
                <div className="w-px h-4 bg-gradient-to-b from-green-200 to-green-300" />
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <Wind className="w-3 h-3 text-cyan-400" />
                  <span className="text-gray-700 font-medium">{weatherData.current.wind_speed_10m.toFixed(0)} km/h</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} hasData={hasData} />

      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {!hasData && !isLoading && (
              <div className="relative bg-gradient-to-br from-white/90 to-green-50/80 backdrop-blur-xl rounded-2xl border border-green-200/50 p-12 flex items-center justify-center min-h-[500px] shadow-xl shadow-green-100/30 overflow-hidden animate-fade-in">
                {/* Animated background orbs */}
                <div className="absolute top-10 right-20 w-24 h-24 bg-gradient-to-br from-yellow-200/50 to-orange-200/50 rounded-full blur-2xl animate-float" />
                <div className="absolute bottom-20 left-16 w-20 h-20 bg-gradient-to-br from-green-200/50 to-emerald-200/50 rounded-full blur-2xl animate-float-slow" />

                <div className="relative text-center">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 rounded-full blur-xl opacity-40 animate-pulse-slow" />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-300/40 animate-float solar-orb">
                      <Sun className="w-12 h-12 text-white animate-spin-slow" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
                    Ready to Forecast
                  </h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                    Enter your solar installation details or click on the map to generate AI-powered forecasts with real-time weather data
                  </p>
                  <div className="flex items-center justify-center gap-6 text-xs">
                    <span className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200 text-gray-600">
                      <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                      Live Weather API
                    </span>
                    <span className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-200 text-gray-600">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Real-time Data
                    </span>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="relative bg-gradient-to-br from-white/90 to-green-50/80 backdrop-blur-xl rounded-2xl border border-green-200/50 p-12 flex items-center justify-center min-h-[500px] shadow-xl shadow-green-100/30 overflow-hidden">
                {/* Loading animation elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-200/30 to-emerald-200/20 rounded-full blur-3xl animate-pulse" />

                <div className="relative text-center">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 animate-pulse opacity-30" />
                    <div className="absolute inset-2 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center shadow-inner">
                      <div className="relative w-14 h-14">
                        <div className="absolute inset-0 border-4 border-green-100 rounded-full" />
                        <div className="absolute inset-0 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
                        <Sun className="absolute inset-0 m-auto w-6 h-6 text-emerald-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Generating Forecast</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
                    Fetching live weather data and running AI predictions...
                  </p>
                  <div className="flex flex-col items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200 text-emerald-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Connecting to Open-Meteo API
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-full border border-yellow-200 text-yellow-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                      Processing solar irradiance data
                    </span>
                  </div>
                </div>
              </div>
            )}

            {hasData && renderTabContent()}
          </div>
        </div>
      </main>

      <footer className="relative bg-gradient-to-r from-white/70 via-green-50/50 to-white/70 backdrop-blur-xl border-t border-green-100/50 mt-8 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-50" />
        <div className="max-w-7xl mx-auto px-4 py-5 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg blur opacity-30" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <Sun className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">SolarSense AI</span>
                <span className="text-xs text-gray-400 ml-2">Hackathon MVP 2024</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 backdrop-blur rounded-full border border-gray-200/50 text-gray-500">
                <Activity className="w-3 h-3 text-emerald-500" />
                Weather: Open-Meteo API
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 backdrop-blur rounded-full border border-gray-200/50 text-gray-500">
                <Eye className="w-3 h-3 text-blue-500" />
                Location: Nominatim OSM
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 backdrop-blur rounded-full border border-gray-200/50 text-gray-500">
                <Zap className="w-3 h-3 text-yellow-500" />
                IEEE Solar Calculations
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
