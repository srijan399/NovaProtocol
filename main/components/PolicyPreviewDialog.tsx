import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Clock, DollarSign, AlertTriangle, Bot, Calculator, Info } from 'lucide-react';
import { PremiumCalculationBreakdown } from '@/utils/policyUtils';

interface PolicyPreviewData {
  policyType: string;
  coverageAmount: number;
  duration: number;
  paymentType: string;
  premiumAmount: number;
  riskLevel: string;
  autoPayment: boolean;
}

interface ContractData {
  policyType: number;
  _coverageAmount: number;
  _premiumAmount: number;
  _duration: Date;
  uri: string;
  _riskLevel: number;
}

interface PolicyPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: PolicyPreviewData;
  contractData: ContractData;
  calculationBreakdown?: PremiumCalculationBreakdown;
  onConfirm: (contractData: ContractData) => void;
  isCreating?: boolean;
}

const getRiskColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'high':
      return 'text-red-400 bg-red-400/10';
    case 'medium':
      return 'text-yellow-400 bg-yellow-400/10';
    case 'low':
      return 'text-green-400 bg-green-400/10';
    default:
      return 'text-gray-400 bg-gray-400/10';
  }
};

export function PolicyPreviewDialog({
  isOpen,
  onClose,
  previewData,
  contractData,
  calculationBreakdown,
  onConfirm,
  isCreating = false
}: PolicyPreviewDialogProps) {
  const handleConfirm = () => {
    onConfirm(contractData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-gray-900/95 border border-blue-500/40 text-white flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl font-mono text-blue-400">
            <Shield className="w-6 h-6" />
            Policy Preview
          </DialogTitle>
        </DialogHeader>
        
        <div 
          className="space-y-6 p-4 overflow-y-auto flex-1 hide-scrollbar" 
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
          }}
        >
          {/* Policy Type */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Policy Type</span>
            </div>
            <span className="text-blue-300 font-mono">{previewData.policyType}</span>
          </div>

          {/* Coverage Amount */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="font-medium">Coverage Amount</span>
            </div>
            <span className="text-green-300 font-mono">{previewData.coverageAmount} ETH</span>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Duration</span>
            </div>
            <span className="text-purple-300 font-mono">{previewData.duration} months</span>
          </div>

          {/* Risk Level */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <span className="font-medium">Risk Level</span>
            </div>
            <span className={`px-3 py-1 rounded-full font-mono text-sm ${getRiskColor(previewData.riskLevel)}`}>
              {previewData.riskLevel.toUpperCase()}
            </span>
          </div>

          {/* Premium */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">
                Premium ({previewData.paymentType === 'monthly' ? 'Monthly' : 'Total'})
              </span>
            </div>
            <span className="text-yellow-300 font-mono">
              {previewData.premiumAmount.toFixed(6)} ETH
              {previewData.paymentType === 'monthly' && '/month'}
            </span>
          </div>

          {/* Auto Payment */}
          {previewData.autoPayment && (
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-cyan-400" />
                <span className="font-medium">Auto Payment Agent</span>
              </div>
              <span className="text-cyan-300 font-mono">Enabled</span>
            </div>
          )}

          {/* Total Cost Summary */}
          <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <h3 className="text-blue-300 font-medium mb-2">Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Coverage:</span>
                <span className="text-green-400 font-mono">{previewData.coverageAmount} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">
                  {previewData.paymentType === 'monthly' ? 'Monthly Payment:' : 'Total Premium:'}
                </span>
                <span className="text-yellow-400 font-mono">
                  {previewData.premiumAmount.toFixed(6)} ETH
                </span>
              </div>
              {previewData.paymentType === 'monthly' && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Premium:</span>
                  <span className="text-yellow-400 font-mono">
                    {(previewData.premiumAmount * previewData.duration).toFixed(6)} ETH
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Calculation Breakdown */}
          {calculationBreakdown && (
            <div className="p-4 bg-gray-800/40 rounded-lg border border-gray-600/50">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <h3 className="text-cyan-300 font-medium">Premium Calculation Breakdown</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Risk Level:</span>
                  <span className={`font-mono ${getRiskColor(calculationBreakdown.riskLevel)}`}>
                    {calculationBreakdown.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Monthly Rate:</span>
                  <span className="text-cyan-300 font-mono">
                    {(calculationBreakdown.monthlyRate * 100).toFixed(1)}% per month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Annual Rate:</span>
                  <span className="text-cyan-300 font-mono">
                    {(calculationBreakdown.annualRate * 100).toFixed(1)}% per year
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Base Monthly Premium:</span>
                  <span className="text-cyan-300 font-mono">
                    {calculationBreakdown.baseMonthlyPremium.toFixed(6)} ETH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Duration:</span>
                  <span className="text-cyan-300 font-mono">{calculationBreakdown.durationMonths} months</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-600/30">
                  <span className="text-white font-medium">
                    {previewData.paymentType === 'monthly' ? 'Monthly Payment:' : 'Total Premium:'}
                  </span>
                  <span className="text-yellow-400 font-mono font-medium">
                    {previewData.paymentType === 'monthly' 
                      ? previewData.premiumAmount.toFixed(6) 
                      : calculationBreakdown.totalPremium.toFixed(6)
                    } ETH
                  </span>
                </div>
              </div>
              
              {/* Calculation Formula */}
              {/* <div className="mt-3 pt-3 border-t border-gray-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-300 text-xs font-medium">Calculation Formula:</span>
                </div>
                <div className="text-xs text-gray-400 font-mono bg-gray-900/50 p-2 rounded">
                  {previewData.paymentType === 'monthly' ? (
                    <>
                      Monthly = Coverage × {(calculationBreakdown.monthlyRate * 100).toFixed(1)}%
                      <br />
                      = {calculationBreakdown.coverageAmount} × {calculationBreakdown.monthlyRate} 
                      = {calculationBreakdown.finalMonthlyPayment?.toFixed(6)} ETH
                    </>
                  ) : (
                    <>
                      Total = Coverage × {(calculationBreakdown.monthlyRate * 100).toFixed(1)}% × {calculationBreakdown.durationMonths} months
                      <br />
                      = {calculationBreakdown.coverageAmount} × {calculationBreakdown.monthlyRate} × {calculationBreakdown.durationMonths}
                      = {calculationBreakdown.totalPremium.toFixed(6)} ETH
                    </>
                  )}
                </div>
              </div> */}
            </div>
          )}

        </div>
        
        {/* Fixed Action Buttons */}
        <div className="flex gap-4 p-4 pt-0 flex-shrink-0 border-t border-gray-700/50">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 bg-gray-700"
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating Policy...
              </>
            ) : (
              'Confirm & Create Policy'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
