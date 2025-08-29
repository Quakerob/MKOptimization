import { supabase } from './supabase';
import { Lead, LeadFormData } from '../types/lead';
import { QuizResults } from './quizService';

export const submitLead = async (
  leadData: LeadFormData, 
  quizResults: QuizResults
): Promise<{ success: boolean; error?: string }> => {
  try {
    const lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'> = {
      name: leadData.name,
      company: leadData.company,
      email: leadData.email,
      phone: leadData.phone || null,
      industry: quizResults.industry,
      company_size: quizResults.companySize,
      quiz_scores: {
        process: quizResults.userScores.process,
        customer: quizResults.userScores.customer,
        revenue: quizResults.userScores.revenue,
        overall: quizResults.userScores.overall
      }
    };

    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();

    if (error) {
      console.error('Error submitting lead:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error submitting lead:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const getLeads = async (): Promise<{ leads: Lead[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return { leads: [], error: error.message };
    }

    return { leads: data || [] };
  } catch (error) {
    console.error('Unexpected error fetching leads:', error);
    return { leads: [], error: 'An unexpected error occurred' };
  }
};