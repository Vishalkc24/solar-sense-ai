import { WeatherData } from '../utils/solarCalculations';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: 'temperature_2m,cloud_cover,precipitation,visibility,wind_speed_10m,relative_humidity_2m,shortwave_radiation',
    current: 'temperature_2m,cloud_cover,visibility,wind_speed_10m,relative_humidity_2m',
    daily: 'sunrise,sunset,daylight_duration',
    forecast_days: '1',
    timezone: 'auto',
  });

  const response = await fetch(`${OPEN_METEO_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    hourly: {
      time: data.hourly.time,
      temperature_2m: data.hourly.temperature_2m,
      cloud_cover: data.hourly.cloud_cover,
      precipitation: data.hourly.precipitation,
      visibility: data.hourly.visibility,
      wind_speed_10m: data.hourly.wind_speed_10m,
      relative_humidity_2m: data.hourly.relative_humidity_2m,
      shortwave_radiation: data.hourly.shortwave_radiation,
    },
    current: {
      temperature_2m: data.current.temperature_2m,
      cloud_cover: data.current.cloud_cover,
      visibility: data.current.visibility,
      wind_speed_10m: data.current.wind_speed_10m,
      relative_humidity_2m: data.current.relative_humidity_2m,
    },
    daily: {
      time: data.daily.time,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
      daylight_duration: data.daily.daylight_duration,
    },
  };
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
