export interface WeatherData {
  hourly: {
    time: string[];
    temperature_2m: number[];
    cloud_cover: number[];
    precipitation: number[];
    visibility: number[];
    wind_speed_10m: number[];
    relative_humidity_2m: number[];
    shortwave_radiation?: number[];
  };
  current: {
    temperature_2m: number;
    cloud_cover: number;
    visibility: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
  };
  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
    daylight_duration: number[];
  };
}

export interface SolarForecast {
  hourly: HourlyForecast[];
  daily: DailyForecast;
  totalDayGeneration: number;
}

export interface HourlyForecast {
  time: string;
  solarOutput: number;
  cloudCover: number;
  temperature: number;
  irradiance: number;
}

export interface DailyForecast {
  sunrise: string;
  sunset: string;
  daylightHours: number;
  peakGenerationHour: string;
  peakGeneration: number;
}

export interface CO2Savings {
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
}

export interface EnvironmentalEquivalents {
  treesEquivalent: number;
  petrolSaved: number;
  evCharges: number;
}

export interface SustainabilityScore {
  score: number;
  rating: string;
  factors: {
    solarPotential: number;
    cloudImpact: number;
    efficiency: number;
    conditions: number;
  };
}

const GRID_EMISSION_FACTOR = 0.82; // kg CO2 per kWh (India average)
const TREE_CO2_ABSORPTION = 21; // kg CO2 per tree per year
const PETROL_CO2_FACTOR = 2.31; // kg CO2 per liter
const EV_CHARGE_CAPACITY = 60; // kWh per full charge (typical EV battery)

export function calculateSolarIrradiance(cloudCover: number): number {
  const clearSkyIrradiance = 1.0;
  const cloudFactor = (100 - cloudCover) / 100;
  return clearSkyIrradiance * cloudFactor;
}

export function calculateHourlyOutput(
  capacityKw: number,
  efficiency: number,
  performanceRatio: number,
  irradiance: number
): number {
  return capacityKw * irradiance * (efficiency / 100) * (performanceRatio / 100);
}

export function generateSolarForecast(
  weatherData: WeatherData,
  capacityKw: number,
  efficiency: number,
  performanceRatio: number
): SolarForecast {
  const hourlyForecasts: HourlyForecast[] = [];
  let totalDayGeneration = 0;

  const hourlyData = weatherData.hourly;
  const hoursToProcess = Math.min(24, hourlyData.time.length);

  for (let i = 0; i < hoursToProcess; i++) {
    const cloudCover = hourlyData.cloud_cover[i];
    const irradiance = calculateSolarIrradiance(cloudCover);
    const solarOutput = calculateHourlyOutput(capacityKw, efficiency, performanceRatio, irradiance);

    hourlyForecasts.push({
      time: hourlyData.time[i],
      solarOutput,
      cloudCover,
      temperature: hourlyData.temperature_2m[i],
      irradiance,
    });

    totalDayGeneration += solarOutput;
  }

  let peakHour = hourlyForecasts[0];
  for (const forecast of hourlyForecasts) {
    if (forecast.solarOutput > peakHour.solarOutput) {
      peakHour = forecast;
    }
  }

  const dailyForecast: DailyForecast = {
    sunrise: weatherData.daily.sunrise[0],
    sunset: weatherData.daily.sunset[0],
    daylightHours: weatherData.daily.daylight_duration[0] / 3600,
    peakGenerationHour: peakHour.time,
    peakGeneration: peakHour.solarOutput,
  };

  return {
    hourly: hourlyForecasts,
    daily: dailyForecast,
    totalDayGeneration,
  };
}

export function calculateCO2Savings(dailyGeneration: number): CO2Savings {
  return {
    daily: dailyGeneration * GRID_EMISSION_FACTOR,
    weekly: dailyGeneration * 7 * GRID_EMISSION_FACTOR,
    monthly: dailyGeneration * 30 * GRID_EMISSION_FACTOR,
    annual: dailyGeneration * 365 * GRID_EMISSION_FACTOR,
  };
}

export function calculateEnvironmentalEquivalents(annualCO2Saved: number, annualGeneration: number): EnvironmentalEquivalents {
  return {
    treesEquivalent: annualCO2Saved / TREE_CO2_ABSORPTION,
    petrolSaved: annualCO2Saved / PETROL_CO2_FACTOR,
    evCharges: annualGeneration / EV_CHARGE_CAPACITY,
  };
}

export function calculateSustainabilityScore(
  totalGeneration: number,
  avgCloudCover: number,
  efficiency: number,
  performanceRatio: number,
  capacityKw: number,
  avgVisibility: number
): SustainabilityScore {
  const maxPossibleGeneration = capacityKw * 24;
  const solarPotential = Math.min(100, (totalGeneration / maxPossibleGeneration) * 150);
  const cloudImpact = Math.max(0, 100 - avgCloudCover);
  const efficiencyScore = (efficiency / 100) * 100;
  const conditionsScore = Math.min(100, (avgVisibility / 10) * 100);

  const score = Math.round(
    (solarPotential * 0.3) +
    (cloudImpact * 0.25) +
    (efficiencyScore * 0.25) +
    (conditionsScore * 0.2)
  );

  let rating = 'Good';
  if (score >= 90) rating = 'Excellent';
  else if (score >= 75) rating = 'Very Good';
  else if (score >= 50) rating = 'Moderate';
  else if (score < 30) rating = 'Poor';

  return {
    score,
    rating,
    factors: {
      solarPotential: Math.round(solarPotential),
      cloudImpact: Math.round(cloudImpact),
      efficiency: Math.round(efficiencyScore),
      conditions: Math.round(conditionsScore),
    },
  };
}

export function generateAIInsights(
  forecast: SolarForecast,
  weatherData: WeatherData,
  score: number
): string[] {
  const insights: string[] = [];

  const peakHours = forecast.hourly
    .filter(h => h.solarOutput > forecast.totalDayGeneration / 24)
    .map(h => new Date(h.time).getHours());

  if (peakHours.length > 0) {
    const startHour = Math.min(...peakHours);
    const endHour = Math.max(...peakHours);
    insights.push(`High solar generation expected between ${startHour}:00 and ${endHour}:00. Optimize energy-intensive tasks during this window.`);
  }

  const highCloudHours = forecast.hourly
    .filter(h => h.cloudCover > 70)
    .map(h => new Date(h.time).getHours());

  if (highCloudHours.length > 0) {
    insights.push(`Cloud cover may reduce generation significantly after ${Math.max(...highCloudHours) - 2}:00. Consider adjusting expectations for afternoon production.`);
  }

  if (score >= 80) {
    insights.push('Excellent conditions for solar harvesting today. Visibility and low humidity indicate efficient panel performance.');
  }

  const avgTemp = weatherData.hourly.temperature_2m.slice(0, 24).reduce((a, b) => a + b, 0) / 24;
  if (avgTemp > 30) {
    insights.push(`High temperatures (${avgTemp.toFixed(1)}°C) may slightly reduce panel efficiency. Ensure adequate ventilation around panels.`);
  }

  const avgVisibility = weatherData.hourly.visibility.slice(0, 24).reduce((a, b) => a + b, 0) / 24;
  if (avgVisibility > 20) {
    insights.push('High visibility indicates clear air conditions, optimal for maximum irradiance capture.');
  }

  const avgHumidity = weatherData.hourly.relative_humidity_2m.slice(0, 24).reduce((a, b) => a + b, 0) / 24;
  if (avgHumidity < 50) {
    insights.push('Low humidity levels are ideal for solar panel efficiency and longevity.');
  }

  if (forecast.daily.daylightHours > 12) {
    insights.push(`${forecast.daily.daylightHours.toFixed(1)} hours of daylight available - excellent for extended solar generation.`);
  }

  const totalPrecipitation = weatherData.hourly.precipitation.slice(0, 24).reduce((a, b) => a + b, 0);
  if (totalPrecipitation > 5) {
    insights.push('Rain expected today which may clean panels but temporarily reduce generation.');
  }

  if (insights.length === 0) {
    insights.push('Moderate solar conditions expected. Monitor real-time generation for optimization opportunities.');
  }

  return insights;
}
