export interface IndustryBenchmark {
  industry: string;
  averages: {
    process: number;
    customer: number;
    revenue: number;
    overall: number;
  };
  sampleSize: number;
  lastUpdated: string;
}

export const industryBenchmarks: Record<string, IndustryBenchmark> = {
  'Retail': {
    industry: 'Retail',
    averages: {
      process: 45,
      customer: 52,
      revenue: 38,
      overall: 45
    },
    sampleSize: 1250,
    lastUpdated: '2024-12-01'
  },
  'Professional Services': {
    industry: 'Professional Services',
    averages: {
      process: 35,
      customer: 48,
      revenue: 42,
      overall: 42
    },
    sampleSize: 890,
    lastUpdated: '2024-12-01'
  },
  'Manufacturing': {
    industry: 'Manufacturing',
    averages: {
      process: 58,
      customer: 35,
      revenue: 45,
      overall: 46
    },
    sampleSize: 675,
    lastUpdated: '2024-12-01'
  },
  'Healthcare': {
    industry: 'Healthcare',
    averages: {
      process: 42,
      customer: 55,
      revenue: 32,
      overall: 43
    },
    sampleSize: 520,
    lastUpdated: '2024-12-01'
  },
  'Other': {
    industry: 'Other',
    averages: {
      process: 40,
      customer: 45,
      revenue: 38,
      overall: 41
    },
    sampleSize: 2100,
    lastUpdated: '2024-12-01'
  }
};

export const getIndustryBenchmark = (industry: string): IndustryBenchmark | null => {
  return industryBenchmarks[industry] || null;
};

export const calculatePercentile = (userScore: number, industryAverage: number): number => {
  // Simplified percentile calculation
  // In a real implementation, this would use actual distribution data
  const difference = userScore - industryAverage;
  const percentile = 50 + (difference * 0.8); // Rough approximation
  return Math.max(5, Math.min(95, Math.round(percentile)));
};

export const getPerformanceLevel = (percentile: number): string => {
  if (percentile >= 80) return 'Top Performer';
  if (percentile >= 60) return 'Above Average';
  if (percentile >= 40) return 'Average';
  if (percentile >= 20) return 'Below Average';
  return 'Needs Improvement';
};

export const getPerformanceLevelColor = (percentile: number): string => {
  if (percentile >= 80) return 'text-green-600';
  if (percentile >= 60) return 'text-blue-600';
  if (percentile >= 40) return 'text-yellow-600';
  if (percentile >= 20) return 'text-orange-600';
  return 'text-red-600';
};