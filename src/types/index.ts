export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Startup {
  id: string;
  user_id: string;
  name: string;
  url: string;
  description: string;
  short_description: string;
  logo_url?: string;
  tags: string[];
  contact_email: string;
  contact_name: string;
  founded_year?: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface SubmissionJob {
  id: string;
  user_id: string;
  startup_id: string;
  package_type: 'basic' | 'pro' | 'enterprise';
  status: 'pending' | 'paid' | 'in_progress' | 'completed' | 'failed';
  total_directories: number;
  completed_directories: number;
  successful_submissions: number;
  failed_submissions: number;
  stripe_session_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SubmissionResult {
  id: string;
  job_id: string;
  directory_name: string;
  directory_url: string;
  status: 'pending' | 'success' | 'failed' | 'pending_review';
  error_message?: string;
  submission_url?: string;
  screenshot_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Directory {
  name: string;
  url: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  directories: number;
  features: string[];
  stripePriceId: string;
  popular?: boolean;
}

export interface FormData {
  name: string;
  url: string;
  description: string;
  shortDescription: string;
  contactEmail: string;
  contactName: string;
  foundedYear?: number;
  category: string;
  tags: string[];
  logo?: File;
}