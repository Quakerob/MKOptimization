import { QuizData, QuizAnswer } from '../types/quiz';
import { getIndustryBenchmark, calculatePercentile, getPerformanceLevel } from '../data/industryBenchmarks';

export interface QuizResults {
  userScores: {
    process: number;
    customer: number;
    revenue: number;
    overall: number;
  };
  industryAverages: {
    process: number;
    customer: number;
    revenue: number;
    overall: number;
  };
  percentiles: {
    process: number;
    customer: number;
    revenue: number;
    overall: number;
  };
  performanceLevels: {
    process: string;
    customer: string;
    revenue: string;
    overall: string;
  };
  industry: string;
  companySize: string;
  sampleSize: number;
}

export const calculateQuizResults = (quizData: QuizData): QuizResults => {
  // Calculate user scores
  const pillarScores = {
    process: 0,
    customer: 0,
    revenue: 0
  };

  const pillarCounts = {
    process: 0,
    customer: 0,
    revenue: 0
  };

  quizData.answers.forEach(answer => {
    if (answer.pillar) {
      pillarScores[answer.pillar] += answer.value;
      pillarCounts[answer.pillar]++;
    }
  });

  const processScore = pillarCounts.process > 0 ? (pillarScores.process / pillarCounts.process) * 20 : 0;
  const customerScore = pillarCounts.customer > 0 ? (pillarScores.customer / pillarCounts.customer) * 20 : 0;
  const revenueScore = pillarCounts.revenue > 0 ? (pillarScores.revenue / pillarCounts.revenue) * 20 : 0;
  const overallScore = (processScore + customerScore + revenueScore) / 3;

  const userScores = {
    process: Math.round(processScore),
    customer: Math.round(customerScore),
    revenue: Math.round(revenueScore),
    overall: Math.round(overallScore)
  };

  // Get industry benchmarks
  const benchmark = getIndustryBenchmark(quizData.industry);
  const industryAverages = benchmark ? benchmark.averages : {
    process: 40,
    customer: 45,
    revenue: 38,
    overall: 41
  };

  // Calculate percentiles
  const percentiles = {
    process: calculatePercentile(userScores.process, industryAverages.process),
    customer: calculatePercentile(userScores.customer, industryAverages.customer),
    revenue: calculatePercentile(userScores.revenue, industryAverages.revenue),
    overall: calculatePercentile(userScores.overall, industryAverages.overall)
  };

  // Get performance levels
  const performanceLevels = {
    process: getPerformanceLevel(percentiles.process),
    customer: getPerformanceLevel(percentiles.customer),
    revenue: getPerformanceLevel(percentiles.revenue),
    overall: getPerformanceLevel(percentiles.overall)
  };

  return {
    userScores,
    industryAverages,
    percentiles,
    performanceLevels,
    industry: quizData.industry,
    companySize: quizData.companySize,
    sampleSize: benchmark?.sampleSize || 0
  };
};

export const generateRecommendations = (results: QuizResults): string[] => {
  const recommendations: string[] = [];
  
  // Process recommendations
  if (results.userScores.process < results.industryAverages.process) {
    recommendations.push('Focus on automating repetitive tasks like invoicing and data entry');
    recommendations.push('Implement workflow automation tools to connect your existing systems');
  }
  
  // Customer recommendations
  if (results.userScores.customer < results.industryAverages.customer) {
    recommendations.push('Develop customer segmentation strategies for personalized marketing');
    recommendations.push('Implement AI-powered chatbots for 24/7 customer support');
  }
  
  // Revenue recommendations
  if (results.userScores.revenue < results.industryAverages.revenue) {
    recommendations.push('Use predictive analytics to identify upselling opportunities');
    recommendations.push('Implement dynamic pricing based on market conditions and demand');
  }
  
  // Industry-specific recommendations
  switch (results.industry) {
    case 'Retail':
      recommendations.push('Consider implementing inventory optimization AI');
      break;
    case 'Professional Services':
      recommendations.push('Automate time tracking and project management workflows');
      break;
    case 'Manufacturing':
      recommendations.push('Implement predictive maintenance for equipment');
      break;
    case 'Healthcare':
      recommendations.push('Focus on patient data management and appointment scheduling automation');
      break;
  }
  
  return recommendations.slice(0, 5); // Return top 5 recommendations
};