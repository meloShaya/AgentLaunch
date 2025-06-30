import { Directory } from '../types';

export const directories: Directory[] = [
  {
    name: "Product Hunt",
    url: "https://www.producthunt.com/posts/new",
    category: "General",
    difficulty: "medium",
    requirements: ["Logo", "Gallery Images", "Description"]
  },
  {
    name: "Hacker News",
    url: "https://news.ycombinator.com/submit",
    category: "Tech",
    difficulty: "easy",
    requirements: ["URL", "Title"]
  },
  {
    name: "Reddit /r/startups",
    url: "https://www.reddit.com/r/startups/submit",
    category: "General",
    difficulty: "easy",
    requirements: ["Title", "Description"]
  },
  {
    name: "AngelList",
    url: "https://angel.co/company/new",
    category: "Startup",
    difficulty: "hard",
    requirements: ["Company Details", "Team Info", "Logo"]
  },
  {
    name: "Crunchbase",
    url: "https://www.crunchbase.com/add-company",
    category: "Startup",
    difficulty: "hard",
    requirements: ["Company Details", "Funding Info", "Logo"]
  },
  {
    name: "BetaList",
    url: "https://betalist.com/submit",
    category: "Beta",
    difficulty: "medium",
    requirements: ["Logo", "Description", "Screenshots"]
  },
  {
    name: "StartupStash",
    url: "https://startupstash.com/submit-startup/",
    category: "General",
    difficulty: "medium",
    requirements: ["Logo", "Description", "Category"]
  },
  {
    name: "Launching Next",
    url: "https://www.launchingnext.com/submit/",
    category: "General",
    difficulty: "easy",
    requirements: ["Basic Info", "Logo"]
  },
  {
    name: "Startup Buffer",
    url: "https://startupbuffer.com/submit",
    category: "General",
    difficulty: "easy",
    requirements: ["Company Info", "Logo"]
  },
  {
    name: "All Top Startups",
    url: "https://alltopstartups.com/submit-startup/",
    category: "General",
    difficulty: "medium",
    requirements: ["Detailed Description", "Logo"]
  },
  // Adding more directories to reach 100+
  {
    name: "Startup Tracker",
    url: "https://startuptracker.io/submit",
    category: "General",
    difficulty: "easy",
    requirements: ["Basic Info"]
  },
  {
    name: "StartupBase",
    url: "https://startupbase.io/submit",
    category: "General",
    difficulty: "medium",
    requirements: ["Company Profile", "Logo"]
  },
  {
    name: "Venture Beat",
    url: "https://venturebeat.com/submit-news/",
    category: "News",
    difficulty: "hard",
    requirements: ["Press Release", "Images"]
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/tips/",
    category: "News",
    difficulty: "hard",
    requirements: ["Story Pitch", "Company Info"]
  },
  {
    name: "Indie Hackers",
    url: "https://www.indiehackers.com/products/new",
    category: "Indie",
    difficulty: "medium",
    requirements: ["Product Details", "Revenue Info"]
  }
  // This would continue to 100+ directories in a real implementation
];

export const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    directories: 50,
    features: [
      '50 Directory Submissions',
      'Basic Reporting',
      'Email Support',
      'Standard Processing'
    ],
    stripePriceId: 'price_basic_plan'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    directories: 100,
    features: [
      '100 Directory Submissions',
      'Detailed Analytics',
      'Priority Support',
      'Fast Processing',
      'Logo Optimization'
    ],
    stripePriceId: 'price_pro_plan',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    directories: 150,
    features: [
      '150+ Directory Submissions',
      'Advanced Analytics',
      '24/7 Support',
      'Instant Processing',
      'Custom Submissions',
      'Dedicated Manager'
    ],
    stripePriceId: 'price_enterprise_plan'
  }
];