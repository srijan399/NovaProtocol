// Utility functions for the insurance onboarding flow

export const POLICY_TYPES = [
  'Rug Pull Insurance',
  'Protocol Hack Insurance', 
  'Bridge Failure Insurance',
  'Liquidity Pool Insurance'
] as const;

export type PolicyType = typeof POLICY_TYPES[number];

export const RISK_LEVELS = {
  'Rug Pull Insurance': 'high',
  'Protocol Hack Insurance': 'low',
  'Bridge Failure Insurance': 'medium',
  'Liquidity Pool Insurance': 'medium'
} as const;

export const PREMIUM_RATES = {
  'low': 0.005,    // 0.5% per month for low risk
  'medium': 0.01,  // 1% per month for medium risk
  'high': 0.02     // 2% per month for high risk
} as const;

export function calculatePremium(
  policyType: PolicyType,
  coverageAmount: number,
  durationMonths: number,
  paymentType: 'monthly' | 'lump'
): number {
  // Define risk levels for each policy type
  const policyRiskLevels: { [key: string]: string } = {
    "Rug Pull Insurance": "high",
    "Protocol Hack Insurance": "low", 
    "Bridge Failure Insurance": "medium",
    "Liquidity Pool Insurance": "medium"
  };

  // Get risk level for policy type
  const riskLevel = policyRiskLevels[policyType];
  
  if (!riskLevel) {
    throw new Error("Invalid policy type");
  }

  // Base premium rates as percentage of coverage amount per month
  const basePremiumRates: { [key: string]: number } = {
    "low": 0.005,    // 0.5% per month for low risk
    "medium": 0.01,  // 1% per month for medium risk
    "high": 0.02     // 2% per month for high risk
  };

  // Get base premium rate
  const baseRate = basePremiumRates[riskLevel];
  if (!baseRate) {
    throw new Error("Invalid risk level");
  }

  // Calculate monthly premium
  const monthlyPremium = coverageAmount * baseRate;
  
  // Calculate total premium for the entire duration (no discounts)
  const totalPremium = monthlyPremium * durationMonths;

  if (paymentType === 'monthly') {
    return Math.round(monthlyPremium * 100) / 100;
  }
  
  return Math.round(totalPremium * 100) / 100; // Round to 2 decimal places
}

export function formatCurrency(amount: number, decimals: number = 6): string {
  return amount.toFixed(decimals);
}

export function formatDuration(months: number): string {
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  if (months === 12) return '1 year';
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  }
  
  return `${years} year${years > 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
}

export interface PremiumCalculationBreakdown {
  policyType: string;
  riskLevel: string;
  coverageAmount: number;
  monthlyRate: number;
  annualRate: number;
  baseMonthlyPremium: number;
  durationMonths: number;
  totalPremium: number;
  finalMonthlyPayment?: number;
  paymentType: string;
}

export function getPremiumCalculationBreakdown(
  policyType: PolicyType,
  coverageAmount: number,
  durationMonths: number,
  paymentType: 'monthly' | 'lump'
): PremiumCalculationBreakdown {
  // Define risk levels for each policy type
  const policyRiskLevels: { [key: string]: string } = {
    "Rug Pull Insurance": "high",
    "Protocol Hack Insurance": "low", 
    "Bridge Failure Insurance": "medium",
    "Liquidity Pool Insurance": "medium"
  };

  // Get risk level for policy type
  const riskLevel = policyRiskLevels[policyType];
  
  if (!riskLevel) {
    throw new Error("Invalid policy type");
  }

  // Base premium rates as percentage of coverage amount per month
  const basePremiumRates: { [key: string]: number } = {
    "low": 0.005,    // 0.5% per month for low risk
    "medium": 0.01,  // 1% per month for medium risk
    "high": 0.02     // 2% per month for high risk
  };

  // Get base premium rate
  const monthlyRate = basePremiumRates[riskLevel];
  const annualRate = monthlyRate * 12;
  
  // Calculate monthly premium
  const baseMonthlyPremium = coverageAmount * monthlyRate;
  
  // Calculate total premium for the entire duration (no discounts)
  const totalPremium = baseMonthlyPremium * durationMonths;

  const breakdown: PremiumCalculationBreakdown = {
    policyType,
    riskLevel,
    coverageAmount,
    monthlyRate,
    annualRate,
    baseMonthlyPremium: Math.round(baseMonthlyPremium * 1000000) / 1000000,
    durationMonths,
    totalPremium: Math.round(totalPremium * 1000000) / 1000000,
    paymentType
  };

  if (paymentType === 'monthly') {
    breakdown.finalMonthlyPayment = Math.round(baseMonthlyPremium * 1000000) / 1000000;
  }

  return breakdown;
}

export function validatePolicyData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!POLICY_TYPES.includes(data.policyType)) {
    errors.push('Invalid policy type');
  }
  
  if (!data.coverageAmount || data.coverageAmount <= 0) {
    errors.push('Coverage amount must be greater than 0');
  }
  
  if (!data.duration || data.duration < 1) {
    errors.push('Duration must be at least 1 month');
  }
  
  if (!['monthly', 'lump'].includes(data.paymentType)) {
    errors.push('Invalid payment type');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
