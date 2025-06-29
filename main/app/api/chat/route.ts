import { NextRequest, NextResponse } from 'next/server';
import { generate } from '@/constants/generate';
import { 
  calculatePremium as utilsCalculatePremium, 
  RISK_LEVELS as utilsRiskLevels, 
  POLICY_TYPES, 
  validatePolicyData,
  getPremiumCalculationBreakdown 
} from '@/utils/policyUtils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface PolicyData {
  policyType: string;
  coverageAmount: number;
  duration: number;
  paymentType: string;
  premiumAmount: number;
  riskLevel: string;
  autoPayment: boolean;
  ready: boolean;
}

// Risk level mappings
const RISK_LEVELS = {
  'Rug Pull Insurance': { level: 2, rate: 0.08 }, // 8% annually - high risk
  'Protocol Hack Insurance': { level: 1, rate: 0.05 }, // 5% annually - medium risk
  'Bridge Failure Insurance': { level: 2, rate: 0.07 } // 7% annually - high risk
};

// Policy type mappings for contract
const POLICY_TYPE_MAPPING = {
  'Rug Pull Insurance': 0,
  'Protocol Hack Insurance': 1,
  'Bridge Failure Insurance': 2
};

function parsePreviewData(response: string): PolicyData | null {
  const previewMatch = response.match(/PREVIEW_READY:({[\s\S]*?})/);
  if (!previewMatch) return null;
  
  try {
    return JSON.parse(previewMatch[1]);
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages }: { messages: ChatMessage[] } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Generate AI response
    const aiResponse = await generate(messages);
    
    // Check if response contains preview data
    const previewData = parsePreviewData(aiResponse);
    
    if (previewData) {
      // Calculate actual premium if not provided or incorrect
      const calculatedPremium = utilsCalculatePremium(
        previewData.policyType as any,
        previewData.coverageAmount,
        previewData.duration,
        previewData.paymentType as any
      );
      
      // Get detailed calculation breakdown
      const calculationBreakdown = getPremiumCalculationBreakdown(
        previewData.policyType as any,
        previewData.coverageAmount,
        previewData.duration,
        previewData.paymentType as any
      );
      
      // Validate the policy data
      const validation = validatePolicyData(previewData);
      if (!validation.isValid) {
        return NextResponse.json({
          message: `I found some issues with the policy data: ${validation.errors.join(', ')}. Please provide the correct information.`,
          showPreview: false
        });
      }
      
      // Prepare contract data
      const contractData = {
        policyType: POLICY_TYPE_MAPPING[previewData.policyType as keyof typeof POLICY_TYPE_MAPPING],
        _coverageAmount: previewData.coverageAmount,
        _premiumAmount: calculatedPremium,
        _duration: new Date(Date.now() + (previewData.duration * 30 * 24 * 60 * 60 * 1000)), // Convert months to date
        uri: `ipfs://policy-${Date.now()}`, // You can implement actual IPFS upload here
        _riskLevel: utilsRiskLevels[previewData.policyType as keyof typeof utilsRiskLevels] === 'high' ? 2 : 
                   utilsRiskLevels[previewData.policyType as keyof typeof utilsRiskLevels] === 'medium' ? 1 : 0
      };
      
      return NextResponse.json({
        message: aiResponse.replace(/PREVIEW_READY:[\s\S]*$/, '').trim(),
        previewData: {
          ...previewData,
          premiumAmount: calculatedPremium
        },
        calculationBreakdown,
        contractData,
        showPreview: true
      });
    }
    
    return NextResponse.json({
      message: aiResponse,
      showPreview: false
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
