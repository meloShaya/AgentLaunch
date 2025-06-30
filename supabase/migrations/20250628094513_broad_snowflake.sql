/*
  # AgentLaunch AI Database Schema

  This file contains the complete database schema for the AgentLaunch AI application.
  Run this SQL in your Supabase project to create all necessary tables and security policies.

  ## Tables Created:
  1. startups - Store startup information submitted by users
  2. submission_jobs - Track background job status for directory submissions
  3. submission_results - Store individual directory submission results
  4. directories - Master list of all available directories (optional)

  ## Security:
  - Row Level Security (RLS) is enabled on all tables
  - Policies ensure users can only access their own data
  - Service role key required for backend operations
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage bucket for startup logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('startup-logos', 'startup-logos', true)
ON CONFLICT DO NOTHING;

-- Allow public access to logo bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'startup-logos');
CREATE POLICY "Authenticated users can upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'startup-logos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own logos" ON storage.objects FOR UPDATE USING (bucket_id = 'startup-logos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own logos" ON storage.objects FOR DELETE USING (bucket_id = 'startup-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create startups table
CREATE TABLE IF NOT EXISTS startups (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  logo_url text,
  tags text[] DEFAULT '{}',
  contact_email text NOT NULL,
  contact_name text NOT NULL,
  founded_year integer,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on startups
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;

-- Create policies for startups
CREATE POLICY "Users can view their own startups"
  ON startups FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own startups"
  ON startups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own startups"
  ON startups FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create submission_jobs table
CREATE TABLE IF NOT EXISTS submission_jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  startup_id uuid REFERENCES startups(id) ON DELETE CASCADE NOT NULL,
  package_type text NOT NULL CHECK (package_type IN ('basic', 'pro', 'enterprise')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'in_progress', 'completed', 'failed')),
  total_directories integer NOT NULL DEFAULT 0,
  completed_directories integer NOT NULL DEFAULT 0,
  successful_submissions integer NOT NULL DEFAULT 0,
  failed_submissions integer NOT NULL DEFAULT 0,
  stripe_session_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on submission_jobs
ALTER TABLE submission_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for submission_jobs
CREATE POLICY "Users can view their own submission jobs"
  ON submission_jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submission jobs"
  ON submission_jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update submission jobs"
  ON submission_jobs FOR UPDATE
  TO service_role
  USING (true);

-- Create submission_results table
CREATE TABLE IF NOT EXISTS submission_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid REFERENCES submission_jobs(id) ON DELETE CASCADE NOT NULL,
  directory_name text NOT NULL,
  directory_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'pending_review')),
  error_message text,
  submission_url text,
  screenshot_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on submission_results
ALTER TABLE submission_results ENABLE ROW LEVEL SECURITY;

-- Create policies for submission_results
CREATE POLICY "Users can view results for their jobs"
  ON submission_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM submission_jobs 
      WHERE submission_jobs.id = submission_results.job_id 
      AND submission_jobs.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert submission results"
  ON submission_results FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update submission results"
  ON submission_results FOR UPDATE
  TO service_role
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_startups_user_id ON startups(user_id);
CREATE INDEX IF NOT EXISTS idx_submission_jobs_user_id ON submission_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_submission_jobs_status ON submission_jobs(status);
CREATE INDEX IF NOT EXISTS idx_submission_results_job_id ON submission_results(job_id);
CREATE INDEX IF NOT EXISTS idx_submission_results_status ON submission_results(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_startups_updated_at BEFORE UPDATE ON startups FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_submission_jobs_updated_at BEFORE UPDATE ON submission_jobs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_submission_results_updated_at BEFORE UPDATE ON submission_results FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Optional: Create directories table for managing the master list
CREATE TABLE IF NOT EXISTS directories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  url text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  difficulty text NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  requirements text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  success_rate numeric(3,2) DEFAULT 0.0,
  average_processing_time interval,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on directories (public read access)
ALTER TABLE directories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active directories"
  ON directories FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Insert sample directories
INSERT INTO directories (name, url, category, difficulty, requirements) VALUES
('Product Hunt', 'https://www.producthunt.com/posts/new', 'General', 'medium', ARRAY['Logo', 'Gallery Images', 'Description']),
('Hacker News', 'https://news.ycombinator.com/submit', 'Tech', 'easy', ARRAY['URL', 'Title']),
('AngelList', 'https://angel.co/company/new', 'Startup', 'hard', ARRAY['Company Details', 'Team Info', 'Logo']),
('BetaList', 'https://betalist.com/submit', 'Beta', 'medium', ARRAY['Logo', 'Description', 'Screenshots']),
('Crunchbase', 'https://www.crunchbase.com/add-company', 'Startup', 'hard', ARRAY['Company Details', 'Funding Info', 'Logo'])
ON CONFLICT DO NOTHING;

-- Create trigger for directories updated_at
CREATE TRIGGER update_directories_updated_at BEFORE UPDATE ON directories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();