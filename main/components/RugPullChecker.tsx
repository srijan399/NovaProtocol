'use client';

import React, { useState } from 'react';

interface RugPullAnalysis {
  isRugPull: boolean;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasons: string[];
  priceDropPercentage: number;
  volumeSpike: number;
  marketCapDrop: number;
  timestamp: number;
  analysis: {
    maxPrice: number;
    minPrice: number;
    currentPrice: number;
    avgVolume: number;
    maxVolume: number;
    timeframe: string;
  };
}

const RugPullChecker: React.FC = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<RugPullAnalysis | null>(null);
  const [error, setError] = useState('');

  const checkRugPull = async () => {
    if (!contractAddress.trim()) {
      setError('Please enter a contract address');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const params = new URLSearchParams({
        contractAddress: contractAddress.trim(),
        days: days.toString()
      });

      const response = await fetch(`/api/claimCheck?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze token');
      }
      
      console.log('Rug Pull Analysis:', result);
      setAnalysis(result.rugPullAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (isRugPull: boolean, confidence: string) => {
    if (!isRugPull) return '✅';
    switch (confidence) {
      case 'CRITICAL': return '🚨';
      case 'HIGH': return '⚠️';
      case 'MEDIUM': return '⚡';
      case 'LOW': return '🔍';
      default: return '❓';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🔍 Rug Pull Detector
      </h1>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Address
          </label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="Enter Solana contract address (e.g., 6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Analysis Period (Days)
          </label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>1 Day</option>
            <option value={3}>3 Days</option>
            <option value={7}>7 Days</option>
            <option value={14}>14 Days</option>
            <option value={30}>30 Days</option>
          </select>
        </div>

        <button
          onClick={checkRugPull}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          {loading ? 'Analyzing...' : 'Check for Rug Pull'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Main Result */}
          <div className={`p-6 rounded-lg border-2 ${
            analysis.isRugPull 
              ? 'border-red-300 bg-red-50' 
              : 'border-green-300 bg-green-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {getRiskIcon(analysis.isRugPull, analysis.confidence)}
                {analysis.isRugPull ? 'RUG PULL DETECTED' : 'NO RUG PULL DETECTED'}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(analysis.confidence)}`}>
                {analysis.confidence} CONFIDENCE
              </span>
            </div>
            
            {analysis.reasons.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Reasons:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.reasons.map((reason, index) => (
                    <li key={index} className="text-gray-700">{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Price Analysis</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Peak Price:</span> ${analysis.analysis.maxPrice.toFixed(4)}</p>
                <p><span className="font-medium">Current Price:</span> ${analysis.analysis.currentPrice.toFixed(4)}</p>
                <p><span className="font-medium">Price Drop:</span> {analysis.priceDropPercentage ? analysis.priceDropPercentage?.toFixed(2) : 'N/A'}%</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Volume Analysis</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Avg Volume:</span> ${(analysis.analysis.avgVolume / 1e6).toFixed(2)}M</p>
                <p><span className="font-medium">Max Volume:</span> ${(analysis.analysis.maxVolume / 1e6).toFixed(2)}M</p>
                <p><span className="font-medium">Volume Spike:</span> {analysis.volumeSpike.toFixed(2)}x</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Market Cap</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Market Cap Drop:</span> {analysis.marketCapDrop.toFixed(2)}%</p>
                <p><span className="font-medium">Analysis Time:</span> {new Date(analysis.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> This analysis is for informational purposes only and should not be considered financial advice. 
              Always do your own research before making investment decisions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RugPullChecker;
