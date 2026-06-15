import React, { useState } from 'react';
import { MessageCircle, Bell, Crown, Check, Clock, Smartphone, Send } from 'lucide-react';

// WhatsApp SVG Icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.89c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.88 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface WhatsAppSubscriptionProps {
  latitude: number;
  longitude: number;
  capacityKw: number;
  efficiency: number;
  performanceRatio: number;
  monthlyBill: number;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Daily 6 AM forecast',
      'Basic solar output prediction',
      'Weather alerts',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 99,
    popular: true,
    features: [
      'Daily 6 AM forecast',
      'Hour-by-hour predictions',
      'Best time recommendations',
      'Weather change alerts',
      'Peak solar hours notification',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 299,
    features: [
      'Everything in Basic',
      'Real-time alerts (3x daily)',
      'Weekend forecasts',
      'Revenue projections',
      'Priority support',
      'Custom alert times',
    ],
  },
];

const mockWhatsAppMessages = [
  {
    time: '6:00 AM',
    type: 'incoming',
    message: `☀️ *SolarSense AI - Daily Forecast*

Good morning! Here's your solar forecast for today.

🔋 *Expected Generation:*
52.3 kWh from your 10kW system

💰 *Today's Savings:*
₹366 in electricity costs

⏰ *Best Time for Tasks:*
10:00 - 3:00 PM
Run AC, washing machine, EV charging during this window for maximum savings!

☁️ *Peak Solar Hours:*
9 AM - 4 PM

💡 *Smart Tips:*
• Charge devices before afternoon clouds (expected 4 PM)
• Perfect day for solar cooking!

🌡️ *Weather:*
28°C, partly cloudy, 65% humidity

---
Reply STOP to unsubscribe
SolarSense AI Premium ☀️`,
  },
  {
    time: '10:15 AM',
    type: 'incoming',
    message: `⚡ *Peak Production Alert*

Your solar is at maximum output right now!

📊 Current: 8.2 kW
🔋 Generated so far: 23.4 kWh
💰 Saved today: ₹164

Run high-power appliances NOW for free electricity! 💚

Time remaining: ~4 hours of good sunlight.`,
  },
  {
    time: '6:00 PM',
    type: 'incoming',
    message: `🌙 *End of Day Summary*

Here's how your solar performed:

🔋 *Total Generation:* 51.8 kWh
📊 *Morning Prediction:* 52.3 kWh
✅ *Accuracy:* 99%

💰 *Total Savings:* ₹363
🌱 *CO₂ Offset:* 41.4 kg
🌳 *Equivalent:* Planting 3 trees

Great day for solar! See you tomorrow at 6 AM. ☀️`,
  },
];

const WhatsAppSubscription: React.FC<WhatsAppSubscriptionProps> = ({
  latitude,
  longitude,
  capacityKw,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate subscription for hackathon demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubscribed(true);
    setIsLoading(false);
  };

  if (isSubscribed) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Successfully Subscribed!</h3>
          <p className="text-gray-600 text-sm mb-4">
            You'll receive your first solar forecast tomorrow at 6:00 AM on WhatsApp.
          </p>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Bell className="w-4 h-4 text-emerald-500" />
              <span className="text-gray-700">Daily alerts at 6:00 AM</span>
            </div>
          </div>
        </div>

        {/* Mock WhatsApp Chat */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <WhatsAppIcon />
            </div>
            <div className="text-white">
              <h4 className="font-semibold text-sm">SolarSense AI</h4>
              <p className="text-green-100 text-xs">online</p>
            </div>
            <div className="ml-auto text-white/80 text-xs">Today</div>
          </div>

          <div className="whatsapp-chat p-4 space-y-3 min-h-[300px] max-h-[400px] overflow-y-auto">
            {mockWhatsAppMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-3 shadow-sm ${
                  msg.type === 'outgoing'
                    ? 'bg-[#dcf8c6] rounded-br-none'
                    : 'bg-white rounded-bl-none'
                }`}>
                  <p className="text-sm text-gray-800 whitespace-pre-line">{msg.message}</p>
                  <div className="text-right mt-1">
                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                    {msg.type === 'outgoing' && (
                      <span className="ml-1 text-blue-500">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 px-3 py-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-white rounded-full px-4 py-2 text-sm border border-gray-200"
              disabled
            />
            <button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <WhatsAppIcon />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">WhatsApp Alerts</h3>
            <p className="text-gray-500 text-xs">Get daily solar forecasts at 6 AM</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4 border border-green-100">
          <div className="text-xs font-semibold text-green-600 mb-2">📱 Preview of Daily Message</div>
          <div className="bg-white rounded-lg p-3 text-sm border border-green-100">
            <div className="text-[10px] text-gray-400 text-right">6:00 AM</div>
            <p className="text-gray-800 text-xs mt-1 line-clamp-6">
              ☀️ <strong>SolarSense AI - Daily Forecast</strong><br /><br />
              🔋 Today's Generation: <span className="text-green-600 font-bold">52.3 kWh</span><br />
              💰 Savings: <span className="text-green-600">₹366</span><br />
              ⏰ Best Time for Tasks: <span className="text-yellow-600">10 AM - 3 PM</span><br />
              💡 Tips included for maximum efficiency!
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            Phone Number (WhatsApp)
          </label>
          <div className="flex gap-2">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <span className="text-gray-500 text-sm">+91</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="9876543210"
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-4 h-4 text-yellow-500" />
          <h3 className="text-sm font-semibold text-gray-900">Choose Your Plan</h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                selectedPlan === plan.id
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2 right-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-medium shadow">
                  Popular
                </span>
              )}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{plan.name}</span>
                  {plan.price > 0 ? (
                    <span className="text-gray-500 text-sm">₹{plan.price}/mo</span>
                  ) : (
                    <span className="text-green-600 text-sm font-medium">Forever Free</span>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id ? 'border-green-500 bg-green-500' : 'border-gray-300'
                }`}>
                  {selectedPlan === plan.id && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <ul className="space-y-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-green-500" />
          Alert Schedule
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-100">
            <span className="text-gray-600">Morning Forecast</span>
            <span className="font-bold text-green-700">6:00 AM</span>
          </div>
          {selectedPlan !== 'free' && (
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg border border-yellow-100">
              <span className="text-gray-600">Peak Alert</span>
              <span className="font-bold text-yellow-700">10:00 AM</span>
            </div>
          )}
          {selectedPlan === 'premium' && (
            <>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-gray-600">Evening Summary</span>
                <span className="font-bold text-blue-700">6:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-100">
                <span className="text-gray-600">Weekend Forecast</span>
                <span className="font-bold text-purple-700">Fri 5 PM</span>
              </div>
            </>
          )}
        </div>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={isLoading || !phoneNumber}
        className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        <WhatsAppIcon />
        {isLoading ? 'Subscribing...' : 'Subscribe to WhatsApp Alerts'}
      </button>

      {selectedPlan !== 'free' && (
        <p className="text-center text-xs text-gray-500">
          7-day free trial • Cancel anytime • No credit card required for demo
        </p>
      )}
    </div>
  );
};

// Fix the extra opening brace issue
export default WhatsAppSubscription;