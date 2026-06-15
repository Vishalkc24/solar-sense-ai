import React from 'react';
import { IndianRupee, TrendingUp, Calendar, PiggyBank, Percent, CreditCard, Battery, Zap } from 'lucide-react';
import { FinancialSavings, CarbonCredits, SolarInvestment, formatCurrency } from '../utils/financialCalculations';

interface FinancialDashboardProps {
  financialSavings: FinancialSavings;
  carbonCredits: CarbonCredits;
  solarInvestment: SolarInvestment;
  annualGeneration: number;
  capacityKw: number;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  financialSavings,
  carbonCredits,
  solarInvestment,
  annualGeneration,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
            <IndianRupee className="w-4 h-4 text-yellow-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Financial Returns</h3>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">Daily</span>
            </div>
            <p className="text-base font-bold text-gray-900">{formatCurrency(financialSavings.dailySavings)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">Monthly</span>
            </div>
            <p className="text-base font-bold text-gray-900">{formatCurrency(financialSavings.monthlySavings)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <IndianRupee className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">Annual</span>
            </div>
            <p className="text-base font-bold text-gray-900">{formatCurrency(financialSavings.annualSavings)}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">25-Year Lifetime savings</span>
            <span className="text-lg font-bold text-emerald-600">{formatCurrency(financialSavings.lifetimeSavings)}</span>
          </div>
          <p className="text-xs text-emerald-600">Pure profit after payback!</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Payback Period</span>
            <span className="text-sm font-bold text-gray-900">{financialSavings.paybackYears.toFixed(1)} years</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min(100, (financialSavings.paybackYears / 10) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">ROI (25 years)</span>
            <span className="text-sm font-bold text-emerald-600">{financialSavings.roi.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
            <Zap className="w-4 h-4 text-teal-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Investment Details</h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Total Project Cost</span>
            <span className="text-sm font-bold text-gray-900">{formatCurrency(solarInvestment.totalCost)}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100 bg-green-50 px-2 -mx-2 rounded">
            <span className="text-sm text-green-600 flex items-center gap-1">
              <Percent className="w-3 h-3" />
              Govt. Subsidy (20%)
            </span>
            <span className="text-sm font-bold text-green-600">-{formatCurrency(solarInvestment.governmentSubsidy)}</span>
          </div>

          <div className="flex items-center justify-between py-2 bg-emerald-50 px-2 -mx-2 rounded">
            <span className="text-sm text-gray-700 font-medium">Net Investment</span>
            <span className="text-base font-bold text-emerald-600">{formatCurrency(solarInvestment.netCost)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <Battery className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Carbon Credits</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <Battery className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">Annual Credits</span>
            </div>
            <p className="text-base font-bold text-gray-900">{carbonCredits.annualCredits.toFixed(2)} tons</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <CreditCard className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">Est. Value</span>
            </div>
            <p className="text-base font-bold text-gray-900">{formatCurrency(carbonCredits.creditValue)}</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Based on market rate of ₹{carbonCredits.marketPrice}/ton CO₂
        </p>
      </div>
    </div>
  );
};

export default FinancialDashboard;
