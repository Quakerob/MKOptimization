export interface Lead {
  id?: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  industry: string;
  company_size: string;
  quiz_scores: {
    process: number;
    customer: number;
    revenue: number;
    overall: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface LeadFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
}