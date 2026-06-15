import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// WhatsApp Business API configuration
const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN') || '';
const WHATSAPP_PHONE_ID = Deno.env.get('WHATSAPP_PHONE_ID') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface Subscription {
  id: string;
  phone_number: string;
  latitude: number;
  longitude: number;
  capacity_kw: number;
  efficiency: number;
  performance_ratio: number;
  monthly_bill: number;
  plan_type: string;
}

interface WeatherData {
  hourly: {
    time: string[];
    temperature_2m: number[];
    cloud_cover: number[];
    visibility: number[];
    windspeed_10m: number[];
  };
  daily: {
    sunrise: string[];
    sunset: string[];
    sunlight_duration: number[];
  };
}

interface SolarForecast {
  totalDayGeneration: number;
  hourly: {
    time: string;
    solarOutput: number;
  }[];
  peakHours: string[];
}

async function fetchWeatherData(lat: number, lng: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,cloud_cover,visibility,windspeed_10m&daily=sunrise,sunset,sunlight_duration&timezone=auto&forecast_days=2`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch weather data');
  return response.json();
}

function generateSolarForecast(weather: WeatherData, capacityKw: number, efficiency: number, performanceRatio: number): SolarForecast {
  const peakSunHours = 4.5;
  const baseGeneration = capacityKw * peakSunHours;
  const efficiencyFactor = efficiency / 100;
  const performanceFactor = performanceRatio / 100;
  const dailyMax = baseGeneration * efficiencyFactor * performanceFactor;

  const hourlyForecasts: { time: string; solarOutput: number }[] = [];
  let totalDayGeneration = 0;
  const peakHours: string[] = [];

  const now = new Date();
  const sunrise = new Date(weather.daily.sunrise[0]).getHours();
  const sunset = new Date(weather.daily.sunset[0]).getHours();

  for (let i = 0; i < 24; i++) {
    const hourDate = new Date(weather.hourly.time[i * 2]);
    const hour = hourDate.getHours();
    const dayProgress = (hour - sunrise) / (sunset - sunrise);
    const solarGeometry = Math.sin(dayProgress * Math.PI);
    const cloudFactor = weather.hourly.cloud_cover[i] ? (1 - (weather.hourly.cloud_cover[i] / 150)) : 1;
    const rawOutput = (dailyMax / 6) * solarGeometry * cloudFactor;
    const output = Math.max(0, rawOutput);

    hourlyForecasts.push({
      time: weather.hourly.time[i],
      solarOutput: parseFloat(output.toFixed(2))
    });

    totalDayGeneration += output;

    if (output > dailyMax / 12) {
      peakHours.push(`${hour}:00`);
    }
  }

  return { totalDayGeneration, hourly: hourlyForecasts, peakHours };
}

function generateWhatsAppMessage(forecast: SolarForecast, capacityKw: number, monthlyBill: number, location: string): string {
  const savingsRate = 7;
  const dailySavings = forecast.totalDayGeneration * savingsRate;
  const peakHoursStr = forecast.peakHours.length > 0 ? forecast.peakHours.slice(0, 5).join(', ').replace(', ', '-') : '10 AM - 2 PM';

  const hourWeather = forecast.hourly.slice(0, 18);
  const bestHours = hourWeather.sort((a, b) => b.solarOutput - a.solarOutput).slice(0, 3);
  const bestHour = parseInt(bestHours[0]?.time?.split('T')?.[1]?.split(':')?.[0] || 12);

  const formattedSavings = `₹${dailySavings.toFixed(0)}`;
  const formattedGeneration = `${forecast.totalDayGeneration.toFixed(1)} kWh`;

  return `☀️ *SolarSense AI - Daily Forecast*

Good morning! Here's your solar forecast for today.

🔋 *Expected Generation:*
${formattedGeneration} from your ${capacityKw}kW system

💰 *Today's Savings:*
${formattedSavings} in electricity costs

⏰ *Best Time for Tasks:*
${bestHour}:00 - ${bestHour + 3}:00
Run AC, washing machine, EV charging during this window for maximum savings!

☁️ *Peak Solar Hours:*
${peakHoursStr}

💡 *Smart Tips:*
• Charge devices/batteries before afternoon clouds
• Run water heater 10 AM - 2 PM for 40% savings
${monthlyBill > 3000 ? '• Consider LED lights to reduce base load by 20%' : '• Great day for solar cooking!'}

---
Reply STOP to unsubscribe
SolarSense AI Premium ☀️`;
}

async function sendWhatsAppMessage(phone: string, message: string): Promise<boolean> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.log('WhatsApp not configured, skipping message');
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      console.error('WhatsApp API error:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const cronSecret = Deno.env.get('CRON_SECRET');

    if (authHeader !== `Bearer ${cronSecret}`) {
      if (cronSecret) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const supabaseResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/whatsapp_subscriptions?is_active=eq.true&select=*`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!supabaseResponse.ok) {
      throw new Error('Failed to fetch subscriptions');
    }

    const subscriptions: Subscription[] = await supabaseResponse.json();

    if (subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active subscriptions' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results: { phone: string; success: boolean; error?: string }[] = [];

    for (const sub of subscriptions) {
      try {
        const weather = await fetchWeatherData(sub.latitude, sub.longitude);
        const forecast = generateSolarForecast(
          weather,
          sub.capacity_kw,
          sub.efficiency,
          sub.performance_ratio
        );

        const message = generateWhatsAppMessage(
          forecast,
          sub.capacity_kw,
          sub.monthly_bill,
          `${sub.latitude.toFixed(2)}, ${sub.longitude.toFixed(2)}`
        );

        const sent = await sendWhatsAppMessage(sub.phone_number, message);

        const now = new Date().toISOString();
        await fetch(
          `${SUPABASE_URL}/rest/v1/whatsapp_subscriptions?phone_number=eq.${encodeURIComponent(sub.phone_number)}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({ last_alert_sent: now }),
          }
        );

        results.push({ phone: sub.phone_number, success: sent });
      } catch (error) {
        results.push({
          phone: sub.phone_number,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(
      JSON.stringify({
        message: `Sent ${successCount}/${results.length} alerts`,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
