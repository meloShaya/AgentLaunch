// Mock data and local memory simulation
export const LOCAL_MEMORY = true; // Set to false to use real Supabase/Stripe

// Mock user data
export const mockUser = {
  id: 'mock-user-123',
  email: 'demo@agentlaunch.ai',
  created_at: '2024-01-01T00:00:00Z'
};

// Mock startups data
export let mockStartups: any[] = [
  {
    id: 'startup-1',
    user_id: 'mock-user-123',
    name: 'TechFlow AI',
    url: 'https://techflow.ai',
    description: 'Revolutionary AI platform that automates complex business workflows using advanced machine learning algorithms. Our solution helps companies reduce manual work by 80% while improving accuracy and efficiency.',
    short_description: 'AI-powered workflow automation platform for businesses',
    logo_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=200',
    tags: ['AI', 'automation', 'SaaS', 'productivity'],
    contact_email: 'founder@techflow.ai',
    contact_name: 'Sarah Chen',
    founded_year: 2023,
    category: 'AI/ML',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'startup-2',
    user_id: 'mock-user-123',
    name: 'EcoTrack',
    url: 'https://ecotrack.com',
    description: 'Comprehensive sustainability tracking platform that helps businesses monitor, measure, and reduce their environmental impact. Features real-time carbon footprint analysis and actionable insights.',
    short_description: 'Sustainability tracking and carbon footprint management',
    logo_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=200',
    tags: ['sustainability', 'environment', 'analytics', 'SaaS'],
    contact_email: 'hello@ecotrack.com',
    contact_name: 'Marcus Rivera',
    founded_year: 2024,
    category: 'SaaS',
    created_at: '2024-02-01T14:20:00Z',
    updated_at: '2024-02-01T14:20:00Z'
  }
];

// Mock submission jobs
export let mockSubmissionJobs: any[] = [
  {
    id: 'job-1',
    user_id: 'mock-user-123',
    startup_id: 'startup-1',
    package_type: 'pro',
    status: 'completed',
    total_directories: 100,
    completed_directories: 100,
    successful_submissions: 87,
    failed_submissions: 13,
    stripe_session_id: 'cs_mock_session_123',
    created_at: '2024-01-16T09:00:00Z',
    updated_at: '2024-01-16T15:30:00Z',
    startup: {
      name: 'TechFlow AI',
      url: 'https://techflow.ai'
    }
  },
  {
    id: 'job-2',
    user_id: 'mock-user-123',
    startup_id: 'startup-2',
    package_type: 'basic',
    status: 'in_progress',
    total_directories: 50,
    completed_directories: 32,
    successful_submissions: 28,
    failed_submissions: 4,
    stripe_session_id: 'cs_mock_session_456',
    created_at: '2024-02-02T11:15:00Z',
    updated_at: '2024-02-02T16:45:00Z',
    startup: {
      name: 'EcoTrack',
      url: 'https://ecotrack.com'
    }
  }
];

// Mock submission results
export let mockSubmissionResults: any[] = [
  // Results for job-1 (TechFlow AI - Completed)
  {
    id: 'result-1',
    job_id: 'job-1',
    directory_name: 'Product Hunt',
    directory_url: 'https://www.producthunt.com/posts/new',
    status: 'success',
    error_message: null,
    submission_url: 'https://www.producthunt.com/posts/techflow-ai',
    screenshot_url: null,
    notes: 'Successfully submitted with featured badge',
    created_at: '2024-01-16T09:15:00Z',
    updated_at: '2024-01-16T09:20:00Z'
  },
  {
    id: 'result-2',
    job_id: 'job-1',
    directory_name: 'Hacker News',
    directory_url: 'https://news.ycombinator.com/submit',
    status: 'success',
    error_message: null,
    submission_url: 'https://news.ycombinator.com/item?id=123456',
    screenshot_url: null,
    notes: 'Posted successfully, gained 45 upvotes',
    created_at: '2024-01-16T09:25:00Z',
    updated_at: '2024-01-16T09:30:00Z'
  },
  {
    id: 'result-3',
    job_id: 'job-1',
    directory_name: 'AngelList',
    directory_url: 'https://angel.co/company/new',
    status: 'failed',
    error_message: 'CAPTCHA verification required',
    submission_url: null,
    screenshot_url: null,
    notes: 'Manual review needed for CAPTCHA completion',
    created_at: '2024-01-16T09:35:00Z',
    updated_at: '2024-01-16T09:40:00Z'
  },
  {
    id: 'result-4',
    job_id: 'job-1',
    directory_name: 'BetaList',
    directory_url: 'https://betalist.com/submit',
    status: 'pending_review',
    error_message: null,
    submission_url: 'https://betalist.com/startups/techflow-ai',
    screenshot_url: null,
    notes: 'Submitted successfully, pending editorial review',
    created_at: '2024-01-16T09:45:00Z',
    updated_at: '2024-01-16T09:50:00Z'
  },
  {
    id: 'result-5',
    job_id: 'job-1',
    directory_name: 'Crunchbase',
    directory_url: 'https://www.crunchbase.com/add-company',
    status: 'success',
    error_message: null,
    submission_url: 'https://www.crunchbase.com/organization/techflow-ai',
    screenshot_url: null,
    notes: 'Company profile created successfully',
    created_at: '2024-01-16T09:55:00Z',
    updated_at: '2024-01-16T10:00:00Z'
  },
  // Results for job-2 (EcoTrack - In Progress)
  {
    id: 'result-6',
    job_id: 'job-2',
    directory_name: 'Product Hunt',
    directory_url: 'https://www.producthunt.com/posts/new',
    status: 'success',
    error_message: null,
    submission_url: 'https://www.producthunt.com/posts/ecotrack',
    screenshot_url: null,
    notes: 'Successfully submitted, scheduled for launch',
    created_at: '2024-02-02T11:30:00Z',
    updated_at: '2024-02-02T11:35:00Z'
  },
  {
    id: 'result-7',
    job_id: 'job-2',
    directory_name: 'Startup Buffer',
    directory_url: 'https://startupbuffer.com/submit',
    status: 'success',
    error_message: null,
    submission_url: 'https://startupbuffer.com/startup/ecotrack',
    screenshot_url: null,
    notes: 'Listed in sustainability category',
    created_at: '2024-02-02T11:40:00Z',
    updated_at: '2024-02-02T11:45:00Z'
  },
  {
    id: 'result-8',
    job_id: 'job-2',
    directory_name: 'All Top Startups',
    directory_url: 'https://alltopstartups.com/submit-startup/',
    status: 'pending',
    error_message: null,
    submission_url: null,
    screenshot_url: null,
    notes: 'Queued for processing',
    created_at: '2024-02-02T11:50:00Z',
    updated_at: '2024-02-02T11:50:00Z'
  }
];

// Helper functions to simulate API delays
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockAPI = {
  // Auth functions
  async getUser() {
    await delay(300);
    return mockUser;
  },

  async signOut() {
    await delay(200);
    return { success: true };
  },

  // Startup functions
  async createStartup(startupData: any) {
    await delay(800);
    const newStartup = {
      id: `startup-${Date.now()}`,
      user_id: mockUser.id,
      ...startupData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockStartups.push(newStartup);
    return newStartup;
  },

  async getStartups(userId: string) {
    await delay(400);
    return mockStartups.filter(startup => startup.user_id === userId);
  },

  async uploadLogo(file: File, startupId: string) {
    await delay(1200);
    // Simulate file upload with a mock URL
    const mockUrl = `https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=200&t=${Date.now()}`;
    
    // Update the startup with the logo URL
    const startup = mockStartups.find(s => s.id === startupId);
    if (startup) {
      startup.logo_url = mockUrl;
      startup.updated_at = new Date().toISOString();
    }
    
    return mockUrl;
  },

  // Submission job functions
  async getSubmissionJobs(userId: string) {
    await delay(500);
    return mockSubmissionJobs.filter(job => job.user_id === userId);
  },

  async createSubmissionJob(jobData: any) {
    await delay(600);
    const newJob = {
      id: `job-${Date.now()}`,
      user_id: mockUser.id,
      ...jobData,
      status: 'pending',
      total_directories: 0,
      completed_directories: 0,
      successful_submissions: 0,
      failed_submissions: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockSubmissionJobs.push(newJob);
    return newJob;
  },

  // Submission results functions
  async getSubmissionResults(jobId: string) {
    await delay(400);
    return mockSubmissionResults.filter(result => result.job_id === jobId);
  },

  // Stripe functions
  async createCheckoutSession(priceId: string, startupId: string) {
    await delay(800);
    
    // Simulate Stripe checkout - in real app this would redirect to Stripe
    // For demo, we'll simulate a successful payment and create a job
    const startup = mockStartups.find(s => s.id === startupId);
    if (!startup) throw new Error('Startup not found');

    // Determine package details based on price ID
    let packageType = 'basic';
    let totalDirectories = 50;
    
    if (priceId.includes('pro')) {
      packageType = 'pro';
      totalDirectories = 100;
    } else if (priceId.includes('enterprise')) {
      packageType = 'enterprise';
      totalDirectories = 150;
    }

    // Create a new submission job
    const newJob = {
      id: `job-${Date.now()}`,
      user_id: mockUser.id,
      startup_id: startupId,
      package_type: packageType,
      status: 'paid',
      total_directories: totalDirectories,
      completed_directories: 0,
      successful_submissions: 0,
      failed_submissions: 0,
      stripe_session_id: `cs_mock_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      startup: {
        name: startup.name,
        url: startup.url
      }
    };

    mockSubmissionJobs.push(newJob);

    // Simulate the job starting to process
    setTimeout(() => {
      const job = mockSubmissionJobs.find(j => j.id === newJob.id);
      if (job) {
        job.status = 'in_progress';
        job.updated_at = new Date().toISOString();
        
        // Simulate gradual progress
        let completed = 0;
        const interval = setInterval(() => {
          if (job && completed < totalDirectories) {
            completed += Math.floor(Math.random() * 5) + 1;
            if (completed > totalDirectories) completed = totalDirectories;
            
            job.completed_directories = completed;
            job.successful_submissions = Math.floor(completed * 0.85); // 85% success rate
            job.failed_submissions = completed - job.successful_submissions;
            job.updated_at = new Date().toISOString();
            
            if (completed >= totalDirectories) {
              job.status = 'completed';
              clearInterval(interval);
            }
          }
        }, 2000); // Update every 2 seconds
      }
    }, 3000); // Start processing after 3 seconds

    // Return success (in real app, this would redirect to Stripe)
    return { 
      success: true, 
      message: 'Payment processed successfully! Your submission campaign has started.',
      jobId: newJob.id 
    };
  }
};