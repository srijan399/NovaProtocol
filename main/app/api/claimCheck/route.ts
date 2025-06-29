import { NextRequest, NextResponse } from 'next/server';

interface PriceData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

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

function analyzeRugPull(data: PriceData): RugPullAnalysis {
  const { prices, market_caps, total_volumes } = data;
  
  if (!prices.length || !market_caps.length || !total_volumes.length) {
    throw new Error('Invalid or empty price data');
  }

  const reasons: string[] = [];
  let confidence: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let isRugPull = false;

  // Extract price values
  const priceValues = prices.map(p => p[1]);
  const volumeValues = total_volumes.map(v => v[1]);
  const marketCapValues = market_caps.map(m => m[1]);
  
  const maxPrice = Math.max(...priceValues);
  const minPrice = Math.min(...priceValues);
  const currentPrice = priceValues[priceValues.length - 1];
  const firstPrice = priceValues[0];
  
  // Calculate price drop from peak
  const priceDropFromPeak = ((maxPrice - currentPrice) / maxPrice) * 100;
  const priceDropFromStart = ((firstPrice - currentPrice) / firstPrice) * 100;
  
  // Volume analysis
  const avgVolume = volumeValues.reduce((a, b) => a + b, 0) / volumeValues.length;
  const maxVolume = Math.max(...volumeValues);
  const volumeSpike = (maxVolume / avgVolume);
  
  // Market cap analysis
  const maxMarketCap = Math.max(...marketCapValues);
  const currentMarketCap = marketCapValues[marketCapValues.length - 1];
  const marketCapDrop = ((maxMarketCap - currentMarketCap) / maxMarketCap) * 100;
  
  // Find rapid price drops (looking for drops > 50% within short timeframes)
  const rapidDrops = findRapidPriceDrops(prices);
  
  // Check for sudden volume spikes followed by price drops
  const suspiciousVolumeSpikes = findSuspiciousVolumeSpikes(prices, total_volumes);
  
  // Rug pull detection logic
  
  // 1. Massive price drop (>80% from peak)
  if (priceDropFromPeak > 80) {
    isRugPull = true;
    confidence = 'CRITICAL';
    reasons.push(`Massive price drop of ${priceDropFromPeak.toFixed(2)}% from peak`);
  }
  
  // 2. Severe price drop (60-80% from peak)
  else if (priceDropFromPeak > 60) {
    isRugPull = true;
    confidence = priceDropFromPeak > 70 ? 'HIGH' : 'MEDIUM';
    reasons.push(`Severe price drop of ${priceDropFromPeak.toFixed(2)}% from peak`);
  }
  
  // 3. Significant price drop (40-60% from peak) with other indicators
  else if (priceDropFromPeak > 40) {
    if (volumeSpike > 10 || rapidDrops.length > 0) {
      isRugPull = true;
      confidence = 'MEDIUM';
      reasons.push(`Significant price drop of ${priceDropFromPeak.toFixed(2)}% from peak with suspicious activity`);
    }
  }
  
  // 4. Volume spike analysis (abnormally high volume followed by price drop)
  if (volumeSpike > 20 && priceDropFromPeak > 30) {
    isRugPull = true;
    confidence = confidence === 'LOW' ? 'HIGH' : confidence;
    reasons.push(`Abnormal volume spike (${volumeSpike.toFixed(2)}x average) followed by price drop`);
  }
  
  // 5. Rapid consecutive drops
  if (rapidDrops.length >= 3) {
    isRugPull = true;
    confidence = 'HIGH';
    reasons.push(`Multiple rapid price drops detected (${rapidDrops.length} instances)`);
  }
  
  // 6. Market cap destruction
  if (marketCapDrop > 70) {
    isRugPull = true;
    confidence = confidence === 'LOW' ? 'HIGH' : confidence;
    reasons.push(`Market cap destroyed by ${marketCapDrop.toFixed(2)}%`);
  }
  
  // 7. Suspicious volume patterns
  if (suspiciousVolumeSpikes.length > 0) {
    if (priceDropFromPeak > 25) {
      isRugPull = true;
      confidence = confidence === 'LOW' ? 'MEDIUM' : confidence;
      reasons.push(`Suspicious volume spikes detected before major price drops`);
    }
  }
  
  // 8. Price near zero (>95% drop)
  if (priceDropFromPeak > 95) {
    isRugPull = true;
    confidence = 'CRITICAL';
    reasons.push(`Token price collapsed by ${priceDropFromPeak.toFixed(2)}% (near zero)`);
  }

  const timeframe = `${new Date(prices[0][0]).toISOString()} to ${new Date(prices[prices.length - 1][0]).toISOString()}`;

  return {
    isRugPull,
    confidence,
    reasons,
    priceDropPercentage: priceDropFromPeak,
    volumeSpike,
    marketCapDrop,
    timestamp: Date.now(),
    analysis: {
      maxPrice,
      minPrice,
      currentPrice,
      avgVolume,
      maxVolume,
      timeframe
    }
  };
}

function findRapidPriceDrops(prices: [number, number][]): Array<{start: number, end: number, dropPercentage: number}> {
  const rapidDrops: Array<{start: number, end: number, dropPercentage: number}> = [];
  
  for (let i = 0; i < prices.length - 1; i++) {
    const currentPrice = prices[i][1];
    const nextPrice = prices[i + 1][1];
    const dropPercentage = ((currentPrice - nextPrice) / currentPrice) * 100;
    
    // Look for drops > 30% in single time period
    if (dropPercentage > 30) {
      rapidDrops.push({
        start: prices[i][0],
        end: prices[i + 1][0],
        dropPercentage
      });
    }
  }
  
  return rapidDrops;
}

function findSuspiciousVolumeSpikes(prices: [number, number][], volumes: [number, number][]): Array<{timestamp: number, volumeSpike: number, priceChange: number}> {
  const suspicious: Array<{timestamp: number, volumeSpike: number, priceChange: number}> = [];
  const avgVolume = volumes.reduce((sum, v) => sum + v[1], 0) / volumes.length;
  
  for (let i = 1; i < Math.min(prices.length, volumes.length); i++) {
    const volumeSpike = volumes[i][1] / avgVolume;
    const priceChange = ((prices[i][1] - prices[i-1][1]) / prices[i-1][1]) * 100;
    
    // High volume spike (>5x average) followed by price drop
    if (volumeSpike > 5 && priceChange < -10) {
      suspicious.push({
        timestamp: volumes[i][0],
        volumeSpike,
        priceChange
      });
    }
  }
  
  return suspicious;
}

async function fetchCoinGeckoData(contractAddress: string, days: number = 30): Promise<PriceData> {
  const toTimestamp = Math.floor(Date.now() / 1000);
  const fromTimestamp = toTimestamp - (days * 24 * 60 * 60);
  
  const url = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}&precision=2`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!data.prices || !data.market_caps || !data.total_volumes) {
    throw new Error('Invalid response from CoinGecko API');
  }
  
  return data;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractAddress, days = 30, customData } = body;
    
    if (!contractAddress && !customData) {
      return NextResponse.json(
        { error: 'Contract address or custom data is required' },
        { status: 400 }
      );
    }
    
    let priceData: PriceData;
    
    if (customData) {
      // Use provided data (like your example)
      priceData = customData;
    } else {
      // Fetch from CoinGecko
      priceData = await fetchCoinGeckoData(contractAddress, days);
    }
    
    const analysis = analyzeRugPull(priceData);
    
    return NextResponse.json({
      success: true,
      contractAddress: contractAddress || 'custom_data',
      rugPullAnalysis: analysis
    });
    
  } catch (error) {
    console.error('Rug pull analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze rug pull',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contractAddress = searchParams.get('contractAddress');
  const days = parseInt(searchParams.get('days') || '30');
  
  if (!contractAddress) {
    return NextResponse.json(
      { error: 'Contract address is required' },
      { status: 400 }
    );
  }
  
  try {
    const priceData = await fetchCoinGeckoData(contractAddress, days);
    const analysis = analyzeRugPull(priceData);
    
    return NextResponse.json({
      success: true,
      contractAddress,
      rugPullAnalysis: analysis
    });
    
  } catch (error) {
    console.error('Rug pull analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze rug pull',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}