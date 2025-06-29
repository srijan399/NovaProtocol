// Function to get the monthly subscription rate (premium) the user needs to pay
export function getMonthlySubscriptionRate(
    policyType: string,
    coverageAmount: number
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

    // Monthly premium rates as percentage of coverage amount
    const monthlyRates: { [key: string]: number } = {
        "low": 0.005,    // 0.5% per month for low risk
        "medium": 0.01,  // 1% per month for medium risk
        "high": 0.02     // 2% per month for high risk
    };

    // Calculate monthly subscription rate
    const monthlyRate = monthlyRates[riskLevel];
    const subscriptionAmount = coverageAmount * monthlyRate;
    
    return Math.round(subscriptionAmount * 100) / 100; // Round to 2 decimal places
}

// Helper function to get risk level for a policy type
export function getRiskLevel(policyType: string): string {
    const policyRiskLevels: { [key: string]: string } = {
        "Rug Pull Insurance": "high",
        "Protocol Hack Insurance": "low", 
        "Bridge Failure Insurance": "medium",
        "Liquidity Pool Insurance": "medium"
    };

    return policyRiskLevels[policyType] || "";
}

export async function calculatePremium(
    policyType: string,
    coverageAmount: number,
    durationInMonths: number = 1,
    riskLevel?: string
): Promise<number> {
    // Define risk levels for each policy type
    const policyRiskLevels: { [key: string]: string } = {
        "Rug Pull Insurance": "high",
        "Protocol Hack Insurance": "low", 
        "Bridge Failure Insurance": "medium",
        "Liquidity Pool Insurance": "medium" // default to medium if not specified
    };

    // Use predefined risk level or provided one
    const effectiveRiskLevel = riskLevel || policyRiskLevels[policyType];
    
    if (!effectiveRiskLevel) {
        throw new Error("Invalid policy type");
    }

    // Base premium rates as percentage of coverage amount per month
    const basePremiumRates: { [key: string]: number } = {
        "low": 0.005,    // 0.5% per month for low risk
        "medium": 0.01,  // 1% per month for medium risk
        "high": 0.02     // 2% per month for high risk
    };

    // Get base premium rate
    const baseRate = basePremiumRates[effectiveRiskLevel];
    if (!baseRate) {
        throw new Error("Invalid risk level");
    }

    // Calculate monthly premium
    const monthlyPremium = coverageAmount * baseRate;
    
    // Calculate total premium for the entire duration (no discounts)
    const totalPremium = monthlyPremium * durationInMonths;

    return Math.round(totalPremium * 100) / 100; // Round to 2 decimal places
}