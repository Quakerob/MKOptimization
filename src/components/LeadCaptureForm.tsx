import React, { useState } from 'react';
import { Mail, Building, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { LeadFormData } from '../types/lead';
import { submitLead } from '../services/leadService';
import { QuizResults } from '../services/quizService';

interface LeadCaptureFormProps {
  quizResults: QuizResults;
  onSuccess: () => void;
  theme: any;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ 
  quizResults, 
  onSuccess, 
  theme 
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    company: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.company || !formData.email) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await submitLead(formData, quizResults);

    if (result.success) {
      setSubmitStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      setSubmitStatus('error');
      setErrorMessage(result.error || 'Failed to submit. Please try again.');
    }

    setIsSubmitting(false);
  };

  if (submitStatus === 'success') {
    return (
      <div className={`${theme.secondary} rounded-lg p-8 text-center`}>
        <CheckCircle className={`w-16 h-16 ${theme.accentText} mx-auto mb-4`} />
        <h2 className="text-2xl font-bold mb-4">Thank you!</h2>
        <p className={`text-lg mb-4 ${
          theme.bg === 'bg-gray-900' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Your information has been submitted successfully. We'll be in touch soon to discuss your AI readiness results.
        </p>
        <div className={`text-sm ${
          theme.bg === 'bg-gray-900' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Redirecting to your results...
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.secondary} rounded-lg p-8`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Get Your Detailed Results</h2>
        <p className={`text-lg ${
          theme.bg === 'bg-gray-900' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Enter your details to receive your personalized AI readiness report and action plan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              theme.bg === 'bg-gray-900' ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={`w-full pl-10 pr-4 py-3 ${theme.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme.bg === 'bg-gray-900' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-2">
            Company Name *
          </label>
          <div className="relative">
            <Building className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              theme.bg === 'bg-gray-900' ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              required
              className={`w-full pl-10 pr-4 py-3 ${theme.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme.bg === 'bg-gray-900' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
              placeholder="Enter your company name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              theme.bg === 'bg-gray-900' ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`w-full pl-10 pr-4 py-3 ${theme.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme.bg === 'bg-gray-900' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Phone Number (Optional)
          </label>
          <div className="relative">
            <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              theme.bg === 'bg-gray-900' ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 ${theme.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme.bg === 'bg-gray-900' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {submitStatus === 'error' && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full ${theme.accent} text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? 'Submitting...' : 'Get My Detailed Results'}
        </button>

        <div className={`text-xs text-center ${
          theme.bg === 'bg-gray-900' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          We respect your privacy. Your information will only be used to send you your results and relevant AI insights.
        </div>
      </form>
    </div>
  );
};