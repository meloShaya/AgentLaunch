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

-- Insert comprehensive directories list
INSERT INTO directories (name, url, category, difficulty, requirements) VALUES
-- Top Tier Directories (High Authority)
('Product Hunt', 'https://www.producthunt.com/posts/new', 'General', 'medium', ARRAY['Logo', 'Gallery Images', 'Description']),
('Crunchbase', 'https://www.crunchbase.com/add-company', 'Startup', 'hard', ARRAY['Company Details', 'Funding Info', 'Logo']),
('AngelList', 'https://angel.co/company/new', 'Startup', 'hard', ARRAY['Company Details', 'Team Info', 'Logo']),
('Hacker News', 'https://news.ycombinator.com/submit', 'Tech', 'easy', ARRAY['URL', 'Title']),
('Capterra', 'https://www.capterra.com/vendors', 'Software', 'medium', ARRAY['Software Details', 'Logo', 'Screenshots']),
('G2 Crowd', 'https://www.g2crowd.com/products/new', 'Software', 'medium', ARRAY['Product Details', 'Logo', 'Reviews']),
('GetApp', 'https://www.gartner.com/en/digital-markets', 'Software', 'medium', ARRAY['Software Details', 'Logo']),
('F6S', 'https://www.f6s.com/startups', 'Startup', 'easy', ARRAY['Basic Info', 'Logo']),
('AlternativeTo', 'https://alternativeto.net/account/signup', 'Software', 'easy', ARRAY['Software Details', 'Alternative Description']),
('StackShare', 'https://stackshare.io/create-stack/new-company', 'Tech', 'easy', ARRAY['Tech Stack', 'Company Info']),

-- High Quality Directories
('BetaList', 'https://betalist.com/submit', 'Beta', 'medium', ARRAY['Logo', 'Description', 'Screenshots']),
('Indie Hackers', 'https://www.indiehackers.com/products/new', 'Indie', 'medium', ARRAY['Product Details', 'Revenue Info']),
('Designer News', 'https://www.designernews.co/submit', 'Design', 'medium', ARRAY['Design Focus', 'Description']),
('KillerStartups', 'https://www.killerstartups.com/submit-startup', 'General', 'medium', ARRAY['Logo', 'Description', 'Category']),
('Inc42', 'https://inc42.com/startup-submission/', 'Startup', 'medium', ARRAY['Company Details', 'Logo']),
('Growth Hackers', 'https://growthhackers.com/guidelines#new-post', 'Marketing', 'medium', ARRAY['Growth Story', 'Metrics']),
('Uplabs', 'https://www.uplabs.com/submit', 'Design', 'easy', ARRAY['Design Assets', 'Description']),
('Springwise', 'https://www.springwise.com/spotted/', 'Innovation', 'hard', ARRAY['Innovation Story', 'Impact']),
('Webwiki', 'https://www.webwiki.com/info/add-website.html', 'General', 'easy', ARRAY['Website URL', 'Description']),
('Crozdesk', 'https://vendor.crozdesk.com/', 'Software', 'medium', ARRAY['Software Details', 'Pricing']),

-- Medium Quality Directories
('Alternative.me', 'https://alternative.me/account/submit-item/', 'Software', 'easy', ARRAY['Software Details', 'Alternatives']),
('NextBigWhat', 'https://nextbigwhat.com/submit-your-startup/', 'Startup', 'easy', ARRAY['Startup Details', 'Logo']),
('StartupResources.io', 'https://startupresources.io/add-resource/', 'Resources', 'easy', ARRAY['Resource Details', 'Category']),
('All Top Startups', 'https://alltopstartups.com/submit-startup/', 'General', 'medium', ARRAY['Detailed Description', 'Logo']),
('Ebool', 'https://www.ebool.com/submit', 'General', 'medium', ARRAY['Company Details', 'Logo']),
('Index.co', 'https://index.co/login?redirect_to=/', 'Startup', 'medium', ARRAY['Company Profile', 'Funding Info']),
('SaaSHub', 'https://www.saashub.com/submit', 'SaaS', 'easy', ARRAY['SaaS Details', 'Features']),
('StartupStash', 'https://startupstash.typeform.com/to/CJ8kSU', 'General', 'easy', ARRAY['Basic Info', 'Category']),
('StartupBlink', 'https://www.startupblink.com/startups', 'Startup', 'medium', ARRAY['Location', 'Industry', 'Details']),
('Side Projectors', 'https://www.sideprojectors.com/project/submit', 'Side Projects', 'easy', ARRAY['Project Details', 'Story']),
('Remote.tools', 'https://www.remote.tools/post-product', 'Remote Work', 'easy', ARRAY['Tool Details', 'Remote Focus']),
('FeedMyApp', 'https://feedmyapp.com/submit/', 'Apps', 'medium', ARRAY['App Details', 'Screenshots']),
('SaasGenius', 'http://www.saasgenius.com/free-listing', 'SaaS', 'easy', ARRAY['SaaS Details', 'Pricing']),
('StartupRanking', 'https://www.startupranking.com/login', 'Startup', 'medium', ARRAY['Company Details', 'Metrics']),
('SnapMunk', 'https://www.snapmunk.com/submit-your-startup/', 'General', 'easy', ARRAY['Startup Details', 'Logo']),
('BetaPage', 'https://betapage.co/product/submit', 'Beta', 'medium', ARRAY['Product Details', 'Beta Status']),
('StartupBase', 'https://startupbase.io/submit', 'General', 'easy', ARRAY['Company Profile', 'Logo']),
('Betabound', 'https://www.betabound.com/announce/', 'Beta', 'easy', ARRAY['Beta Details', 'Description']),
('Launching Next', 'https://www.launchingnext.com/submit/', 'General', 'easy', ARRAY['Basic Info', 'Logo']),
('Startup Tracker', 'https://startuptracker.io/crowdsourcing/', 'General', 'easy', ARRAY['Basic Info']),
('TechFaster', 'http://techfaster.com/submit-your-company/', 'Tech', 'easy', ARRAY['Company Details', 'Tech Focus']),
('Startup Buffer', 'https://startupbuffer.com/site/submit', 'General', 'easy', ARRAY['Company Info', 'Logo']),
('Web App Rater', 'https://webapprater.com/submit-your-web-application-for-review-html', 'Web Apps', 'medium', ARRAY['Web App Details', 'Review Request']),
('The Startup Pitch', 'https://thestartuppitch.com/post-a-pitch/', 'Pitch', 'medium', ARRAY['Pitch Deck', 'Company Story']),
('Crazy About Startups', 'https://www.crazyaboutstartups.com/share-your-startup-2', 'General', 'easy', ARRAY['Startup Story', 'Details']),
('Startup Inspire', 'https://www.startupinspire.com/submit', 'General', 'easy', ARRAY['Inspiring Story', 'Details']),
('Bootstrappers.io', 'https://bootstrappers.io/submit-a-link/', 'Bootstrap', 'easy', ARRAY['Bootstrap Story', 'Link']),
('Startup88', 'https://startup88.typeform.com/to/CRjWqM', 'General', 'easy', ARRAY['Basic Info', 'Form']),
('Getworm', 'https://getworm.com/submit-startup', 'General', 'easy', ARRAY['Startup Details', 'Description']),
('Startup Costs', 'https://www.startupcosts.co/add', 'Costs', 'easy', ARRAY['Cost Breakdown', 'Details']),
('10 Words', 'https://app.10words.io', 'Simple', 'easy', ARRAY['10 Word Description']),
('Startup Button', 'https://www.startupbutton.com/submit', 'General', 'easy', ARRAY['Basic Info', 'Logo']),
('Awesome Indie', 'https://awesomeindie.com/', 'Indie', 'easy', ARRAY['Indie Project', 'Description']),

-- Community and Social Directories
('Reddit /r/startups', 'https://www.reddit.com/r/startups/submit', 'Community', 'easy', ARRAY['Title', 'Description']),
('Reddit /r/SideProject', 'https://www.reddit.com/r/SideProject/submit', 'Side Projects', 'easy', ARRAY['Project Details', 'Story']),
('Reddit /r/entrepreneur', 'https://www.reddit.com/r/entrepreneur/submit', 'Entrepreneurship', 'easy', ARRAY['Business Story', 'Value']),
('Google My Business', 'https://www.google.com/business/', 'Local', 'easy', ARRAY['Business Details', 'Location']),
('LinkedIn Company Page', 'https://www.linkedin.com/company/setup/new/', 'Professional', 'easy', ARRAY['Company Details', 'Logo']),

-- News and Media Directories
('TechCrunch Tips', 'https://techcrunch.com/tips/', 'News', 'hard', ARRAY['Story Pitch', 'Newsworthiness']),
('VentureBeat', 'https://venturebeat.com/submit-news/', 'News', 'hard', ARRAY['Press Release', 'Images']),
('GeekWire', 'https://www.geekwire.com/submit-startup/', 'Tech News', 'medium', ARRAY['Tech Story', 'Innovation']),
('Feedough', 'https://feedough.com/submit-your-startup/', 'Startup Stories', 'medium', ARRAY['Startup Story', 'Details']),

-- Specialized Directories
('AppSumo', 'https://sell.appsumo.com/', 'Deals', 'hard', ARRAY['Product Details', 'Deal Structure']),
('Slant', 'https://www.slant.co/', 'Recommendations', 'medium', ARRAY['Product Comparison', 'Features']),
('Y Combinator Startup School', 'https://www.startupschool.org/', 'Education', 'medium', ARRAY['Startup Details', 'Application']),
('Exploding Topics', 'https://explodingtopics.com/', 'Trends', 'hard', ARRAY['Trending Topic', 'Data']),
('CB Insights', 'https://www.cbinsights.com/', 'Research', 'hard', ARRAY['Company Data', 'Verification']),
('PitchWall', 'https://pitchwall.co/', 'Pitch', 'medium', ARRAY['Pitch Video', 'Details']),
('Startup Grind', 'https://www.startupgrind.com/', 'Community', 'medium', ARRAY['Community Engagement', 'Story']),
('Wellfound', 'https://wellfound.com/', 'Startup Jobs', 'medium', ARRAY['Company Profile', 'Team Info']),
('Startup Jobs', 'https://startup.jobs/', 'Jobs', 'easy', ARRAY['Job Listings', 'Company Info']),

-- Remote Work and Digital Nomad Directories
('NoDesk', 'https://nodesk.co/', 'Remote Work', 'easy', ARRAY['Remote Tool', 'Description']),
('Remote Year', 'https://remoteyear.com/', 'Remote Work', 'medium', ARRAY['Remote Story', 'Community']),
('Nomad List', 'https://nomadlist.com/', 'Digital Nomad', 'medium', ARRAY['Nomad Tool', 'Community']),

-- Maker and Developer Directories
('Maker Log', 'https://getmakerlog.com/', 'Makers', 'easy', ARRAY['Project Log', 'Progress']),
('WIP', 'https://wip.co/', 'Work in Progress', 'easy', ARRAY['Project Updates', 'Community']),
('Makerpad', 'https://www.makerpad.co/', 'No-Code', 'medium', ARRAY['No-Code Tool', 'Tutorial']),
('No Code Founders', 'https://www.nocodefounders.com/', 'No-Code', 'easy', ARRAY['No-Code Story', 'Founder']),
('DevPost', 'https://devpost.com/', 'Developer', 'easy', ARRAY['Project Details', 'Code']),
('GitHub Showcase', 'https://github.com/', 'Open Source', 'easy', ARRAY['Open Source Project', 'Code']),
('Stack Overflow', 'https://stackoverflow.com/', 'Developer', 'medium', ARRAY['Technical Solution', 'Community']),
('Dev.to', 'https://dev.to/', 'Developer', 'easy', ARRAY['Technical Article', 'Story']),
('Hashnode', 'https://hashnode.com/', 'Developer Blog', 'easy', ARRAY['Technical Content', 'Blog']),

-- Design and Creative Directories
('Dribbble', 'https://dribbble.com/', 'Design', 'medium', ARRAY['Design Portfolio', 'Quality']),
('Behance', 'https://www.behance.net/', 'Creative', 'medium', ARRAY['Creative Portfolio', 'Projects']),
('Webflow Showcase', 'https://webflow.com/discover/popular', 'Design', 'medium', ARRAY['Webflow Site', 'Design Quality']),

-- Content and Publishing Directories
('Medium Publications', 'https://medium.com/', 'Content', 'medium', ARRAY['Quality Article', 'Story']),
('Substack', 'https://substack.com/', 'Newsletter', 'medium', ARRAY['Newsletter Content', 'Audience']),

-- Marketing and Automation Directories
('ConvertKit', 'https://convertkit.com/', 'Email Marketing', 'medium', ARRAY['Email Tool', 'Marketing']),
('Zapier App Directory', 'https://zapier.com/apps', 'Automation', 'hard', ARRAY['API Integration', 'Automation']),
('IFTTT', 'https://ifttt.com/', 'Automation', 'medium', ARRAY['Service Integration', 'Automation']),
('Make (Integromat)', 'https://www.make.com/', 'Automation', 'medium', ARRAY['Integration Scenario', 'Workflow'])
ON CONFLICT DO NOTHING;

-- Create trigger for directories updated_at
CREATE TRIGGER update_directories_updated_at BEFORE UPDATE ON directories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();