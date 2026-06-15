export interface FinancialSavings {
  dailySavings: number;
  monthlySavings: number;
  annualSavings: number;
  lifetimeSavings: number;
  paybackYears: number;
  paybackMonths: number;
  roi: number;
}

export interface CarbonCredits {
  annualCredits: number;
  creditValue: number;
  marketPrice: number;
}

export interface SolarInvestment {
  totalCost: number;
  governmentSubsidy: number;
  netCost: number;
  installationCost: number;
}

export interface EnergyAdvisor {
  optimalCapacity: number;
  recommendedPanels: number;
  roofArea: number;
  paybackYears: number;
  annualSavings: number;
}

const ELECTRICITY_RATE_INDIA = 7; // ₹ per kWh (average)
const CARBON_CREDIT_PRICE = 2500; // ₹ per ton CO2 (approximate market rate)
const SOLAR_COST_PER_KW = 50000; // ₹ per kW installed
const GOVERNMENT_SUBSIDY_PERCENT = 20; // 20% government subsidy
const SOLAR_PANEL_WATTAGE = 400; // Watts per panel
const ROOF_AREA_PER_KW = 10; // square meters per kW
const SOLAR_SYSTEM_LIFETIME = 25; // years

export function calculateFinancialSavings(annualGeneration: number): FinancialSavings {
  const dailyGeneration = annualGeneration / 365;
  const monthlyGeneration = annualGeneration / 12;

  const dailySavings = dailyGeneration * ELECTRICITY_RATE_INDIA;
  const monthlySavings = monthlyGeneration * ELECTRICITY_RATE_INDIA;
  const annualSavings = annualGeneration * ELECTRICITY_RATE_INDIA;
  const lifetimeSavings = annualSavings * SOLAR_SYSTEM_LIFETIME;

  const capacityKw = annualGeneration / (365 * 4); // Approximate from annual generation
  const totalCost = capacityKw * SOLAR_COST_PER_KW;
  const subsidy = totalCost * (GOVERNMENT_SUBSIDY_PERCENT / 100);
  const netCost = totalCost - subsidy;

  const paybackYears = netCost / annualSavings;
  const paybackMonths = paybackYears * 12;

  const roi = ((lifetimeSavings - netCost) / netCost) * 100;

  return {
    dailySavings,
    monthlySavings,
    annualSavings,
    lifetimeSavings,
    paybackYears,
    paybackMonths,
    roi,
  };
}

export function calculateCarbonCredits(annualCO2Saved: number): CarbonCredits {
  const annualCredits = annualCO2Saved / 1000; // Convert kg to tons
  const creditValue = annualCredits * CARBON_CREDIT_PRICE;

  return {
    annualCredits,
    creditValue,
    marketPrice: CARBON_CREDIT_PRICE,
  };
}

export function calculateSolarInvestment(capacityKw: number): SolarInvestment {
  const totalCost = capacityKw * SOLAR_COST_PER_KW;
  const governmentSubsidy = totalCost * (GOVERNMENT_SUBSIDY_PERCENT / 100);
  const netCost = totalCost - governmentSubsidy;
  const installationCost = totalCost * 0.1; // 10% for installation

  return {
    totalCost,
    governmentSubsidy,
    netCost,
    installationCost,
  };
}

export function calculateEnergyAdvisor(
  monthlyBill: number,
  rooftopArea: number
): EnergyAdvisor {
  const monthlyConsumption = monthlyBill / ELECTRICITY_RATE_INDIA;
  const annualConsumption = monthlyConsumption * 12;

  const capacityForConsumption = annualConsumption / (365 * 4); // 4 peak sun hours avg
  const capacityForArea = rooftopArea / ROOF_AREA_PER_KW;

  const optimalCapacity = Math.min(capacityForConsumption, capacityForArea);
  const recommendedPanels = Math.ceil((optimalCapacity * 1000) / SOLAR_PANEL_WATTAGE);
  const roofArea = optimalCapacity * ROOF_AREA_PER_KW;

  const annualGeneration = optimalCapacity * 365 * 4;
  const annualSavings = annualGeneration * ELECTRICITY_RATE_INDIA;

  const totalCost = optimalCapacity * SOLAR_COST_PER_KW;
  const subsidy = totalCost * (GOVERNMENT_SUBSIDY_PERCENT / 100);
  const netCost = totalCost - subsidy;
  const paybackYears = netCost / annualSavings;

  return {
    optimalCapacity,
    recommendedPanels,
    roofArea,
    paybackYears,
    annualSavings,
  };
}

export function generateEnergyUsageRecommendations(
  solarGeneration: number,
  peakHours: string[],
  monthlyBill: number
): string[] {
  const recommendations: string[] = [];
  const monthlyConsumption = monthlyBill / ELECTRICITY_RATE_INDIA;
  const monthlySolar = solarGeneration * 30;
  const coverage = (monthlySolar / monthlyConsumption) * 100;

  if (peakHours.length > 0) {
    const start = Math.min(...peakHours.map(h => parseInt(h.split(':')[0])));
    const end = Math.max(...peakHours.map(h => parseInt(h.split(':')[0])));
    recommendations.push(
      `Schedule high-consumption appliances (AC, washing machine, EV charging) between ${start}:00-${end}:00 to maximize solar self-consumption`
    );
  }

  if (coverage >= 100) {
    recommendations.push(
      'Your solar system can cover 100%+ of your consumption. Consider net metering to sell excess power back to the grid.'
    );
  } else if (coverage >= 70) {
    recommendations.push(
      `${coverage.toFixed(0)}% energy independence achievable. Add battery storage to use solar power during evening peak rates.`
    );
  } else {
    recommendations.push(
      `Solar covers ${coverage.toFixed(0)}% of needs. Consider expanding capacity or adding panels for higher self-sufficiency.`
    );
  }

  recommendations.push(
    'Run water heaters during sunny hours instead of evening to save 40-50% on heating costs.'
  );

  recommendations.push(
    'Install smart home automation to automatically shift loads to peak solar generation hours.'
  );

  if (monthlyBill > 3000) {
    recommendations.push(
      'High consumption detected. Consider upgrading to a smart thermostat and LED lighting to reduce base load by 20-30%.'
    );
  }

  recommendations.push(
    'Use time-of-use billing: Export excess solar during peak afternoon rates (₹9-12/kWh) and import at night when rates drop (₹4-5/kWh).'
  );

  return recommendations;
}

export function generateSolarAdvisorRecommendations(
  capacityKw: number,
  efficiency: number,
  monthlyBill: number
): string[] {
  const recommendations: string[] = [];
  const monthlyConsumption = monthlyBill / ELECTRICITY_RATE_INDIA;
  const annualConsumption = monthlyConsumption * 12;
  const currentAnnualGeneration = capacityKw * 365 * 4 * (efficiency / 100);
  const optimalCapacity = annualConsumption / (365 * 4);

  if (capacityKw < optimalCapacity * 0.7) {
    const additionalCapacity = (optimalCapacity - capacityKw).toFixed(1);
    const additionalCost = Math.round((optimalCapacity - capacityKw) * SOLAR_COST_PER_KW);
    recommendations.push(
      `Your system is undersized. Consider adding ${additionalCapacity} kW more (₹${(additionalCost / 100000).toFixed(1)}L investment) to match your consumption.`
    );
  } else if (capacityKw > optimalCapacity * 1.5) {
    recommendations.push(
      'Your system is oversized for current consumption. Consider adding battery storage or an EV to utilize excess production.'
    );
  } else {
    recommendations.push(
      'Your solar capacity is well-matched to your energy needs. Focus on optimizing usage timing.'
    );
  }

  if (efficiency < 18) {
    recommendations.push(
      'Panel efficiency is below current market standards (20-22%). Consider premium panels for 15-20% more output in the same space.'
    );
  }

  if (efficiency >= 20) {
    recommendations.push(
      'Excellent panel choice! High-efficiency panels maximize output and require less roof space.'
    );
  }

  const recommendedPanels = Math.ceil((optimalCapacity * 1000) / SOLAR_PANEL_WATTAGE);
  recommendations.push(
    `For your consumption, a ${optimalCapacity.toFixed(1)} kW system (${recommendedPanels} panels) would be ideal.`
  );

  const payback = calculateSolarInvestment(capacityKw);
  recommendations.push(
    `Current investment: ₹${(payback.netCost / 100000).toFixed(1)}L after ${GOVERNMENT_SUBSIDY_PERCENT}% government subsidy (₹${(payback.governmentSubsidy / 1000).toFixed(0)}K saved).`
  );

  if (payback.paybackYears < 5) {
    recommendations.push(
      `Excellent investment! Payback in ${payback.paybackYears.toFixed(1)} years with ${((SOLAR_SYSTEM_LIFETIME - payback.paybackYears) * payback.annualSavings / 100000).toFixed(1)}L in pure profit over ${SOLAR_SYSTEM_LIFETIME} years.`
    );
  }

  recommendations.push(
    'Adding a battery (₹1-2L) enables night-time solar usage and backup during outages - highly recommended for India.'
  );

  return recommendations;
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount.toFixed(0)}`;
}
