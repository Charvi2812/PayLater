import type { AssessmentResult, FinancialProfile, PurchaseRequest } from '../types';
import { supabase } from './Supabase';

// The Supabase migration is optional in local development. Keeping history
// disabled until the table is provisioned prevents repeated 404 requests from
// an otherwise fully working application.
const isHistoryEnabled = import.meta.env.VITE_ENABLE_ASSESSMENT_HISTORY === 'true';

interface StoredAssessment {
  profile: FinancialProfile;
  purchase: PurchaseRequest;
  result: AssessmentResult;
}

const storageKey = (userId: string) => `paylater-assessment:${userId}`;

function getLocalAssessment(userId: string): StoredAssessment | null {
  try {
    const saved = window.localStorage.getItem(storageKey(userId));
    return saved ? JSON.parse(saved) as StoredAssessment : null;
  } catch {
    return null;
  }
}

function saveLocalAssessment(userId: string, assessment: StoredAssessment) {
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(assessment));
  } catch {
    // Local storage may be unavailable in private browsing modes.
  }
}

export const assessmentHistory = {
  async save(userId: string, profile: FinancialProfile, purchase: PurchaseRequest, result: AssessmentResult) {
    const assessment = { profile, purchase, result };
    saveLocalAssessment(userId, assessment);

    if (!isHistoryEnabled || !supabase) return;
    const { error } = await supabase.from('assessments').insert({
      user_id: userId,
      ...assessment
    });
    if (error) throw error;
  },

  async getLatest(userId: string): Promise<StoredAssessment | null> {
    if (!isHistoryEnabled || !supabase) return getLocalAssessment(userId);
    const { data, error } = await supabase
      .from('assessments')
      .select('profile, purchase, result')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return getLocalAssessment(userId);
    return (data as StoredAssessment | null) ?? getLocalAssessment(userId);
  }
};
