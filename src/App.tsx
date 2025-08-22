import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, Gauge, Calendar, BarChart3, Users, Zap, ArrowRight, Mail, Linkedin } from 'lucide-react';

import { QuizData, QuizAnswer, Question } from './types/quiz';
import { calculateQuizResults, generateRecommendations } from './services/quizService';
import { getPerformanceLevelColor } from './data/industryBenchmarks';
type DesignVersion = 'minimal' | 'professional' | 'modern';

const App: React.FC = () => {
  const [currentVersion, setCurrentVersion] = useState<DesignVersion>('minimal');
  const [currentPage, setCurrentPage] = useState<'home' | 'quiz' | 'results'>('home');
  const [quizStep, setQuizStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({
    industry: '',
    companySize: '',
    answers: []
  });
  const [quizResults, setQuizResults] = useState<any>(null);

  const questions: Question[] = [
    { id: 'industry', type: 'select', question: 'What industry best describes your business?', options: ['Retail', 'Professional Services', 'Manufacturing', 'Healthcare', 'Other'], pillar: null },
    { id: 'companySize', type: 'select', question: 'What is your company size?', options: ['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees'], pillar: null },
    { id: 'p1', type: 'scale', question: 'How automated are your day-to-day admin tasks (invoicing, payroll, order entry)?', pillar: 'process' },
    { id: 'p2', type: 'scale', question: 'Do your tools "talk" to each other (e.g., CRM ↔ accounting ↔ inventory)?', pillar: 'process' },
    { id: 'p3', type: 'scale', question: 'In the next 12 months, how likely are you to invest in automating more back-office work?', pillar: 'process' },
    { id: 'c1', type: 'scale', question: 'How personalised is the marketing content customers receive?', pillar: 'customer' },
    { id: 'c2', type: 'scale', question: 'Are you using AI for your customer-support channels?', pillar: 'customer' },
    { id: 'c3', type: 'scale', question: 'Priority to improve Customer Experience (CX) with AI in the next year?', pillar: 'customer' },
    { id: 'r1', type: 'scale', question: 'How much do you rely on data/AI to spot upsell or cross-sell opportunities?', pillar: 'revenue' },
    { id: 'r2', type: 'scale', question: 'Today I am using AI for pricing decisions:', pillar: 'revenue' },
    { id: 'r3', type: 'scale', question: 'Urgency to use AI for new revenue streams in the next 12 months?', pillar: 'revenue' }
  ];

  const scaleLabels = ['Not at all', 'Somewhat', 'Moderately', 'Very much', 'Completely'];

  const calculateScores = () => {
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

    return {
      process: Math.round(processScore),
      customer: Math.round(customerScore),
      revenue: Math.round(revenueScore),
      overall: Math.round(overallScore)
    };
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return currentVersion === 'minimal' ? 'text-red-600' : currentVersion === 'professional' ? 'text-red-700' : 'text-red-500';
    if (score < 70) return currentVersion === 'minimal' ? 'text-yellow-600' : currentVersion === 'professional' ? 'text-orange-600' : 'text-yellow-500';
    return currentVersion === 'minimal' ? 'text-green-600' : currentVersion === 'professional' ? 'text-green-700' : 'text-green-500';
  };

  const getTrafficLight = (score: number) => {
    if (score < 40) return 'bg-red-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleQuizAnswer = (value: number | string) => {
    const currentQuestion = questions[quizStep];
    
    if (currentQuestion.id === 'industry') {
      setQuizData(prev => ({ ...prev, industry: value as string }));
    } else if (currentQuestion.id === 'companySize') {
      setQuizData(prev => ({ ...prev, companySize: value as string }));
    } else {
      const answer: QuizAnswer = {
        questionId: currentQuestion.id,
        value: value as number,
        pillar: currentQuestion.pillar as 'process' | 'customer' | 'revenue'
      };
      
      setQuizData(prev => ({
        ...prev,
        answers: [...prev.answers.filter(a => a.questionId !== currentQuestion.id), answer]
      }));
    }
    
    if (quizStep < questions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate results when quiz is completed
      const results = calculateQuizResults(quizData);
      setQuizResults(results);
      setCurrentPage('results');
    }
  };

  const VersionSelector = () => (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-2 flex gap-2">
      <button
        onClick={() => setCurrentVersion('minimal')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentVersion === 'minimal' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        V1: Minimal
      </button>
      <button
        onClick={() => setCurrentVersion('professional')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentVersion === 'professional' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        V2: Professional
      </button>
      <button
        onClick={() => setCurrentVersion('modern')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentVersion === 'modern' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        V3: Modern
      </button>
    </div>
  );

  const getThemeClasses = () => {
    switch (currentVersion) {
      case 'minimal':
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          accent: 'bg-blue-500 hover:bg-blue-600',
          accentText: 'text-blue-500',
          secondary: 'bg-gray-100',
          border: 'border-gray-200',
          font: 'font-inter'
        };
      case 'professional':
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-900',
          accent: 'bg-indigo-600 hover:bg-indigo-700',
          accentText: 'text-indigo-600',
          secondary: 'bg-white',
          border: 'border-slate-300',
          font: 'font-serif'
        };
      case 'modern':
        return {
          bg: 'bg-gray-900',
          text: 'text-white',
          accent: 'bg-purple-600 hover:bg-purple-700',
          accentText: 'text-purple-400',
          secondary: 'bg-gray-800',
          border: 'border-gray-700',
          font: 'font-sans'
        };
      default:
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          accent: 'bg-blue-500 hover:bg-blue-600',
          accentText: 'text-blue-500',
          secondary: 'bg-gray-100',
          border: 'border-gray-200',
          font: 'font-inter'
        };
    }
  };

  const theme = getThemeClasses();

  const Header = () => (
    <header className={`${theme.bg} ${theme.border} border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className={`text-2xl font-bold ${theme.text} ${theme.font}`}>
            MK Optimization
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <button className={`${theme.text} hover:${theme.accentText} transition-colors`}>About</button>
            <button className={`${theme.text} hover:${theme.accentText} transition-colors`}>Services</button>
            <button 
              onClick={() => setCurrentPage('quiz')}
              className={`${theme.text} hover:${theme.accentText} transition-colors`}
            >
              Quiz
            </button>
            <button className={`${theme.accent} text-white px-4 py-2 rounded-lg transition-colors`}>
              Book Call
            </button>
          </nav>
        </div>
      </div>
    </header>
  );

  const LandingPage = () => (
    <div className={`min-h-screen ${theme.bg} ${theme.text} ${theme.font}`}>
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`text-lg font-semibold mb-4 ${theme.accentText}`}>
            MK Optimization
          </div>
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${
            currentVersion === 'minimal' ? 'text-gray-900' :
            currentVersion === 'professional' ? 'text-slate-900' :
            'text-white'
          }`}>
            Unlock Your AI Edge in 5 Minutes
          </h1>
          <p className={`text-xl mb-8 ${
            currentVersion === 'minimal' ? 'text-gray-600' :
            currentVersion === 'professional' ? 'text-slate-600' :
            'text-gray-300'
          }`}>
            Take our free quiz to benchmark your business against competitors and get a mini action plan.
          </p>
          <button 
            onClick={() => setCurrentPage('quiz')}
            className={`${theme.accent} text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center gap-2`}
          >
            Take the Free Readiness Quiz
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className={`py-16 px-4 ${theme.secondary}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`w-16 h-16 ${theme.accent} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Answer 10 quick questions</h3>
              <p className={`${
                currentVersion === 'minimal' ? 'text-gray-600' :
                currentVersion === 'professional' ? 'text-slate-600' :
                'text-gray-400'
              }`}>
                Simple questions about your current processes
              </p>
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 ${theme.accent} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Gauge className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get your AI Readiness Score</h3>
              <p className={`${
                currentVersion === 'minimal' ? 'text-gray-600' :
                currentVersion === 'professional' ? 'text-slate-600' :
                'text-gray-400'
              }`}>
                Instant analysis with personalized action plan
              </p>
            </div>
            <div className="text-center">
              <div className={`w-16 h-16 ${theme.accent} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book a strategy session</h3>
              <p className={`${
                currentVersion === 'minimal' ? 'text-gray-600' :
                currentVersion === 'professional' ? 'text-slate-600' :
                'text-gray-400'
              }`}>
                Free 30-minute consultation with our experts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${theme.secondary} p-6 rounded-lg`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold">Client {i}</div>
                    <div className={`text-sm ${
                      currentVersion === 'minimal' ? 'text-gray-600' :
                      currentVersion === 'professional' ? 'text-slate-600' :
                      'text-gray-400'
                    }`}>
                      CEO, Company {i}
                    </div>
                  </div>
                </div>
                <p className={`${
                  currentVersion === 'minimal' ? 'text-gray-600' :
                  currentVersion === 'professional' ? 'text-slate-600' :
                  'text-gray-400'
                }`}>
                  "The AI readiness quiz helped us identify key areas for improvement and gave us a clear roadmap forward."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AI for SMBs */}
      <section className={`py-16 px-4 ${theme.secondary}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why AI for SMBs?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Zap className={`w-12 h-12 ${theme.accentText} mx-auto mb-4`} />
              <h3 className="text-xl font-semibold mb-2">Process Automation</h3>
              <p className={`${
                currentVersion === 'minimal' ? 'text-gray-600' :
                currentVersion === 'professional' ? 'text-slate-600' :
                'text-gray-400'
              }`}>
                Streamline operations and reduce manual work by up to 70%
              </p>
            </div>
            <div className="text-center">
              <Users className={`w-12 h-12 ${theme.accentText} mx-auto mb-4`} />
              <h3 className="text-xl font-semibold mb-2">Customer Experience</h3>
              <p className={`${
                currentVersion === 'minimal' ? 'text-gray-600' :
                currentVersion === 'professional' ? 'text-slate-600' :
                'text-gray-400'
              }`}>
                Deliver personalized experiences that increase satisfaction
              </p>
            </div>
            <div className="text-center">
              <BarChart3 className={`w-12 h-12 ${theme.accentText} mx-auto mb-4`} />
              <h3 className="text-xl font-semibold mb-2">Revenue Growth</h3>
              <p className={`${
                currentVersion === 'minimal' ? 'text-gray-600' :
                currentVersion === 'professional' ? 'text-slate-600' :
                'text-gray-400'
              }`}>
                Unlock new revenue streams with data-driven insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to discover your AI advantage?</h2>
          <button 
            onClick={() => setCurrentPage('quiz')}
            className={`${theme.accent} text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center gap-2`}
          >
            Start the Quiz
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${theme.secondary} py-8 px-4 ${theme.border} border-t`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className={`${
            currentVersion === 'minimal' ? 'text-gray-600' :
            currentVersion === 'professional' ? 'text-slate-600' :
            'text-gray-400'
          }`}>
            © 2025 MK Optimization. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Mail className={`w-5 h-5 ${theme.accentText}`} />
            <Linkedin className={`w-5 h-5 ${theme.accentText}`} />
            <button className={`${
              currentVersion === 'minimal' ? 'text-gray-600 hover:text-gray-800' :
              currentVersion === 'professional' ? 'text-slate-600 hover:text-slate-800' :
              'text-gray-400 hover:text-white'
            } transition-colors`}>
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );

  const QuizPage = () => (
    <div className={`min-h-screen ${theme.bg} ${theme.text} ${theme.font}`}>
      <Header />
      
      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Company Name */}
          <div className="text-center mb-6">
            <div className={`text-xl font-bold ${theme.accentText}`}>
              MK Optimization
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className={`w-full ${theme.secondary} rounded-full h-2 mb-8`}>
            <div 
              className={`h-2 ${theme.accent.replace('hover:', '')} rounded-full transition-all duration-300`}
              style={{ width: `${((quizStep + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className={`${theme.secondary} rounded-lg p-8 shadow-lg`}>
            <div className="mb-6">
              <span className={`text-sm ${theme.accentText} font-medium`}>
                Question {quizStep + 1} of {questions.length}
              </span>
              <h2 className="text-2xl font-semibold mt-2 mb-4">
                {questions[quizStep].question}
              </h2>
            </div>

            {questions[quizStep].type === 'select' ? (
              <div className="space-y-3">
                {questions[quizStep].options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(option)}
                    className={`w-full p-4 text-left ${theme.border} border rounded-lg hover:${theme.accentText.replace('text-', 'border-')} transition-colors`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleQuizAnswer(value)}
                    className={`w-full p-4 text-left ${theme.border} border rounded-lg hover:${theme.accentText.replace('text-', 'border-')} transition-colors flex items-center justify-between`}
                  >
                    <span>{scaleLabels[value - 1]}</span>
                    <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      theme.border
                    }`}>
                      {value}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setQuizStep(Math.max(0, quizStep - 1))}
                disabled={quizStep === 0}
                className={`px-6 py-2 rounded-lg ${theme.border} border transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              
              {quizStep === questions.length - 1 && (
                <div className={`text-sm ${
                  currentVersion === 'minimal' ? 'text-gray-600' :
                  currentVersion === 'professional' ? 'text-slate-600' :
                  'text-gray-400'
                } mt-2`}>
                  We use your answers only to create your personalised AI Readiness Score. Nothing is shared or sold.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ResultsPage = () => {
    if (!quizResults) {
      return <div>Loading results...</div>;
    }

    const recommendations = generateRecommendations(quizResults);
    
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} ${theme.font}`}>
        <Header />
        
        <div className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className={`text-xl font-bold mb-2 ${theme.accentText}`}>
                MK Optimization
              </div>
              <h1 className="text-4xl font-bold mb-4">Your AI Readiness Results</h1>
              <p className={`text-xl ${
                currentVersion === 'minimal' ? 'text-gray-600' :
                currentVersion === 'professional' ? 'text-slate-600' :
                'text-gray-300'
              }`}>
                Here's how your {quizResults.industry} business compares to industry averages
              </p>
            </div>

            {/* Overall Score */}
            <div className={`${theme.secondary} rounded-lg p-8 mb-8 text-center`}>
              <div className="relative inline-flex items-center justify-center w-48 h-48 mb-4">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className={`${
                      currentVersion === 'minimal' ? 'text-gray-200' :
                      currentVersion === 'professional' ? 'text-slate-200' :
                      'text-gray-700'
                    }`}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * quizResults.userScores.overall) / 100}
                    className={`transition-all duration-1000 ${
                      currentVersion === 'minimal' ? 'stroke-blue-500' :
                      currentVersion === 'professional' ? 'stroke-indigo-600' :
                      'stroke-purple-500'
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold">{quizResults.userScores.overall}</span>
                  <span className={`text-sm ${
                    currentVersion === 'minimal' ? 'text-gray-600' :
                    currentVersion === 'professional' ? 'text-slate-600' :
                    'text-gray-400'
                  }`}>
                    Overall Score
                  </span>
                </div>
              </div>
            </div>

            {/* Industry Comparison */}
            <div className={`${theme.secondary} rounded-lg p-8 mb-8`}>
              <h2 className="text-2xl font-bold mb-6">Industry Comparison</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{quizResults.percentiles.overall}th</div>
                  <div className={`text-lg font-semibold mb-1 ${getPerformanceLevelColor(quizResults.percentiles.overall)}`}>
                    {quizResults.performanceLevels.overall}
                  </div>
                  <div className={`text-sm ${
                    currentVersion === 'minimal' ? 'text-gray-600' :
                    currentVersion === 'professional' ? 'text-slate-600' :
                    'text-gray-400'
                  }`}>
                    Percentile in {quizResults.industry}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{quizResults.sampleSize.toLocaleString()}</div>
                  <div className="text-lg font-semibold mb-1">Companies</div>
                  <div className={`text-sm ${
                    currentVersion === 'minimal' ? 'text-gray-600' :
                    currentVersion === 'professional' ? 'text-slate-600' :
                    'text-gray-400'
                  }`}>
                    In our {quizResults.industry} database
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {quizResults.userScores.overall > quizResults.industryAverages.overall ? '+' : ''}
                    {quizResults.userScores.overall - quizResults.industryAverages.overall}
                  </div>
                  <div className="text-lg font-semibold mb-1">Points</div>
                  <div className={`text-sm ${
                    currentVersion === 'minimal' ? 'text-gray-600' :
                    currentVersion === 'professional' ? 'text-slate-600' :
                    'text-gray-400'
                  }`}>
                    vs. Industry Average ({quizResults.industryAverages.overall})
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar Scores */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className={`${theme.secondary} rounded-lg p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Process Automation</h3>
                  <div className={`w-4 h-4 rounded-full ${getTrafficLight(quizResults.userScores.process)}`} />
                </div>
                <div className={`text-2xl font-bold mb-2 ${getScoreColor(quizResults.userScores.process)}`}>
                  {quizResults.userScores.process}/100
                </div>
                <div className={`text-sm ${getPerformanceLevelColor(quizResults.percentiles.process)} font-medium mb-1`}>
                  {quizResults.performanceLevels.process}
                </div>
                <div className={`text-xs ${
                  currentVersion === 'minimal' ? 'text-gray-500' :
                  currentVersion === 'professional' ? 'text-slate-500' :
                  'text-gray-400'
                }`}>
                  Industry avg: {quizResults.industryAverages.process} | {quizResults.percentiles.process}th percentile
                </div>
              </div>
              <div className={`${theme.secondary} rounded-lg p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Customer Experience</h3>
                  <div className={`w-4 h-4 rounded-full ${getTrafficLight(quizResults.userScores.customer)}`} />
                </div>
                <div className={`text-2xl font-bold mb-2 ${getScoreColor(quizResults.userScores.customer)}`}>
                  {quizResults.userScores.customer}/100
                </div>
                <div className={`text-sm ${getPerformanceLevelColor(quizResults.percentiles.customer)} font-medium mb-1`}>
                  {quizResults.performanceLevels.customer}
                </div>
                <div className={`text-xs ${
                  currentVersion === 'minimal' ? 'text-gray-500' :
                  currentVersion === 'professional' ? 'text-slate-500' :
                  'text-gray-400'
                }`}>
                  Industry avg: {quizResults.industryAverages.customer} | {quizResults.percentiles.customer}th percentile
                </div>
              </div>
              <div className={`${theme.secondary} rounded-lg p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Revenue Growth</h3>
                  <div className={`w-4 h-4 rounded-full ${getTrafficLight(quizResults.userScores.revenue)}`} />
                </div>
                <div className={`text-2xl font-bold mb-2 ${getScoreColor(quizResults.userScores.revenue)}`}>
                  {quizResults.userScores.revenue}/100
                </div>
                <div className={`text-sm ${getPerformanceLevelColor(quizResults.percentiles.revenue)} font-medium mb-1`}>
                  {quizResults.performanceLevels.revenue}
                </div>
                <div className={`text-xs ${
                  currentVersion === 'minimal' ? 'text-gray-500' :
                  currentVersion === 'professional' ? 'text-slate-500' :
                  'text-gray-400'
                }`}>
                  Industry avg: {quizResults.industryAverages.revenue} | {quizResults.percentiles.revenue}th percentile
                </div>
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div className={`${theme.secondary} rounded-lg p-8 mb-8`}>
              <h2 className="text-2xl font-bold mb-6">Personalized Recommendations</h2>
              <p className={`mb-6 ${
                currentVersion === 'minimal' ? 'text-gray-600' :
                currentVersion === 'professional' ? 'text-slate-600' :
                'text-gray-400'
              }`}>
                Based on your {quizResults.industry} industry profile and current AI readiness level:
              </p>
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full ${theme.accent.replace('bg-', 'bg-').replace('hover:', '')} mt-2`} />
                    <p className={`${
                      currentVersion === 'minimal' ? 'text-gray-600' :
                      currentVersion === 'professional' ? 'text-slate-600' :
                      'text-gray-400'
                    }`}>
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 90-Day Roadmap */}
            <div className={`${theme.secondary} rounded-lg p-8 mb-8`}>
              <h2 className="text-2xl font-bold mb-6">90-Day Roadmap</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme.accent.replace('bg-', 'bg-').replace('hover:', '')} flex items-center justify-center text-white font-semibold`}>
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Process Integration Phase</h3>
                    <p className={`${
                      currentVersion === 'minimal' ? 'text-gray-600' :
                      currentVersion === 'professional' ? 'text-slate-600' :
                      'text-gray-400'
                    }`}>
                      Connect existing tools and automate core workflows
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme.accent.replace('bg-', 'bg-').replace('hover:', '')} flex items-center justify-center text-white font-semibold`}>
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Customer Experience Enhancement</h3>
                    <p className={`${
                      currentVersion === 'minimal' ? 'text-gray-600' :
                      currentVersion === 'professional' ? 'text-slate-600' :
                      'text-gray-400'
                    }`}>
                      Deploy personalization and improved support channels
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme.accent.replace('bg-', 'bg-').replace('hover:', '')} flex items-center justify-center text-white font-semibold`}>
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Revenue Optimization</h3>
                    <p className={`${
                      currentVersion === 'minimal' ? 'text-gray-600' :
                      currentVersion === 'professional' ? 'text-slate-600' :
                      'text-gray-400'
                    }`}>
                      Launch predictive analytics and new revenue streams
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
              <p className={`text-lg mb-6 ${
                currentVersion === 'minimal' ? 'text-gray-600' :
                currentVersion === 'professional' ? 'text-slate-600' :
                'text-gray-300'
              }`}>
                Let's discuss how we can help you outperform your {quizResults.industry} competitors
              </p>
              <button className={`${theme.accent} text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors`}>
                Book a Free 30-Min Strategy Call
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <VersionSelector />
      {currentPage === 'home' && <LandingPage />}
      {currentPage === 'quiz' && <QuizPage />}
      {currentPage === 'results' && <ResultsPage />}
    </>
  );
};

export default App;