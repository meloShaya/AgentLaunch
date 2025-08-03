export const directories = [
  // Top Tier Directories (High Authority)
  {
    name: "Product Hunt",
    url: "https://www.producthunt.com/posts/new",
    category: "General",
    difficulty: "medium",
    requirements: ["Logo", "Gallery Images", "Description"]
  },
  {
    name: "Crunchbase",
    url: "https://www.crunchbase.com/add-company",
    category: "Startup",
    difficulty: "hard",
    requirements: ["Company Details", "Funding Info", "Logo"]
  },
  {
    name: "AngelList",
    url: "https://angel.co/company/new",
    category: "Startup",
    difficulty: "hard",
    requirements: ["Company Details", "Team Info", "Logo"]
  },
  {
    name: "Hacker News",
    url: "https://news.ycombinator.com/submit",
    category: "Tech",
    difficulty: "easy",
    requirements: ["URL", "Title"]
  },
  {
    name: "Capterra",
    url: "https://www.capterra.com/vendors",
    category: "Software",
    difficulty: "medium",
    requirements: ["Software Details", "Logo", "Screenshots"]
  },
  {
    name: "G2 Crowd",
    url: "https://www.g2crowd.com/products/new",
    category: "Software",
    difficulty: "medium",
    requirements: ["Product Details", "Logo", "Reviews"]
  },
  {
    name: "GetApp",
    url: "https://www.gartner.com/en/digital-markets",
    category: "Software",
    difficulty: "medium",
    requirements: ["Software Details", "Logo"]
  },
  {
    name: "F6S",
    url: "https://www.f6s.com/startups",
    category: "Startup",
    difficulty: "easy",
    requirements: ["Basic Info", "Logo"]
  },
  {
    name: "AlternativeTo",
    url: "https://alternativeto.net/account/signup",
    category: "Software",
    difficulty: "easy",
    requirements: ["Software Details", "Alternative Description"]
  },
  {
    name: "StackShare",
    url: "https://stackshare.io/create-stack/new-company",
    category: "Tech",
    difficulty: "easy",
    requirements: ["Tech Stack", "Company Info"]
  },
  
  // High Quality Directories
  {
    name: "BetaList",
    url: "https://betalist.com/submit",
    category: "Beta",
    difficulty: "medium",
    requirements: ["Logo", "Description", "Screenshots"]
  },
  {
    name: "Indie Hackers",
    url: "https://www.indiehackers.com/products/new",
    category: "Indie",
    difficulty: "medium",
    requirements: ["Product Details", "Revenue Info"]
  },
  {
    name: "Designer News",
    url: "https://www.designernews.co/submit",
    category: "Design",
    difficulty: "medium",
    requirements: ["Design Focus", "Description"]
  },
  {
    name: "KillerStartups",
    url: "https://www.killerstartups.com/submit-startup",
    category: "General",
    difficulty: "medium",
    requirements: ["Logo", "Description", "Category"]
  },
  {
    name: "Inc42",
    url: "https://inc42.com/startup-submission/",
    category: "Startup",
    difficulty: "medium",
    requirements: ["Company Details", "Logo"]
  },
  {
    name: "Growth Hackers",
    url: "https://growthhackers.com/guidelines#new-post",
    category: "Marketing",
    difficulty: "medium",
    requirements: ["Growth Story", "Metrics"]
  },
  {
    name: "Uplabs",
    url: "https://www.uplabs.com/submit",
    category: "Design",
    difficulty: "easy",
    requirements: ["Design Assets", "Description"]
  },
  {
    name: "Springwise",
    url: "https://www.springwise.com/spotted/",
    category: "Innovation",
    difficulty: "hard",
    requirements: ["Innovation Story", "Impact"]
  },
  {
    name: "Webwiki",
    url: "https://www.webwiki.com/info/add-website.html",
    category: "General",
    difficulty: "easy",
    requirements: ["Website URL", "Description"]
  },
  {
    name: "Crozdesk",
    url: "https://vendor.crozdesk.com/",
    category: "Software",
    difficulty: "medium",
    requirements: ["Software Details", "Pricing"]
  },
  
  // Medium Quality Directories
  {
    name: "Alternative.me",
    url: "https://alternative.me/account/submit-item/",
    category: "Software",
    difficulty: "easy",
    requirements: ["Software Details", "Alternatives"]
  },
  {
    name: "NextBigWhat",
    url: "https://nextbigwhat.com/submit-your-startup/",
    category: "Startup",
    difficulty: "easy",
    requirements: ["Startup Details", "Logo"]
  },
  {
    name: "StartupResources.io",
    url: "https://startupresources.io/add-resource/",
    category: "Resources",
    difficulty: "easy",
    requirements: ["Resource Details", "Category"]
  },
  {
    name: "All Top Startups",
    url: "https://alltopstartups.com/submit-startup/",
    category: "General",
    difficulty: "medium",
    requirements: ["Detailed Description", "Logo"]
  },
  {
    name: "Ebool",
    url: "https://www.ebool.com/submit",
    category: "General",
    difficulty: "medium",
    requirements: ["Company Details", "Logo"]
  },
  {
    name: "Index.co",
    url: "https://index.co/login?redirect_to=/",
    category: "Startup",
    difficulty: "medium",
    requirements: ["Company Profile", "Funding Info"]
  },
  {
    name: "SaaSHub",
    url: "https://www.saashub.com/submit",
    category: "SaaS",
    difficulty: "easy",
    requirements: ["SaaS Details", "Features"]
  },
  {
    name: "StartupStash",
    url: "https://startupstash.typeform.com/to/CJ8kSU",
    category: "General",
    difficulty: "easy",
    requirements: ["Basic Info", "Category"]
  },
  {
    name: "StartupBlink",
    url: "https://www.startupblink.com/startups",
    category: "Startup",
    difficulty: "medium",
    requirements: ["Location", "Industry", "Details"]
  },
  {
    name: "Side Projectors",
    url: "https://www.sideprojectors.com/project/submit",
    category: "Side Projects",
    difficulty: "easy",
    requirements: ["Project Details", "Story"]
  },
  {
    name: "Remote.tools",
    url: "https://www.remote.tools/post-product",
    category: "Remote Work",
    difficulty: "easy",
    requirements: ["Tool Details", "Remote Focus"]
  },
  {
    name: "FeedMyApp",
    url: "https://feedmyapp.com/submit/",
    category: "Apps",
    difficulty: "medium",
    requirements: ["App Details", "Screenshots"]
  },
  {
    name: "SaasGenius",
    url: "http://www.saasgenius.com/free-listing",
    category: "SaaS",
    difficulty: "easy",
    requirements: ["SaaS Details", "Pricing"]
  },
  {
    name: "StartupRanking",
    url: "https://www.startupranking.com/login",
    category: "Startup",
    difficulty: "medium",
    requirements: ["Company Details", "Metrics"]
  },
  {
    name: "SnapMunk",
    url: "https://www.snapmunk.com/submit-your-startup/",
    category: "General",
    difficulty: "easy",
    requirements: ["Startup Details", "Logo"]
  },
  {
    name: "BetaPage",
    url: "https://betapage.co/product/submit",
    category: "Beta",
    difficulty: "medium",
    requirements: ["Product Details", "Beta Status"]
  },
  {
    name: "StartupBase",
    url: "https://startupbase.io/submit",
    category: "General",
    difficulty: "easy",
    requirements: ["Company Profile", "Logo"]
  },
  {
    name: "Betabound",
    url: "https://www.betabound.com/announce/",
    category: "Beta",
    difficulty: "easy",
    requirements: ["Beta Details", "Description"]
  },
  {
    name: "Appvita",
    url: "mailto:submissions@appvita.com",
    category: "Apps",
    difficulty: "easy",
    requirements: ["App Details", "Email Submission"]
  },
  {
    name: "Launching Next",
    url: "https://www.launchingnext.com/submit/",
    category: "General",
    difficulty: "easy",
    requirements: ["Basic Info", "Logo"]
  },
  {
    name: "Startup Videos",
    url: "http://startup-videos.com/submit-a-video/",
    category: "Video",
    difficulty: "easy",
    requirements: ["Video Content", "Startup Story"]
  },
  {
    name: "Startup Tracker",
    url: "https://startuptracker.io/crowdsourcing/",
    category: "General",
    difficulty: "easy",
    requirements: ["Basic Info"]
  },
  {
    name: "TechFaster",
    url: "http://techfaster.com/submit-your-company/",
    category: "Tech",
    difficulty: "easy",
    requirements: ["Company Details", "Tech Focus"]
  },
  {
    name: "Startup Buffer",
    url: "https://startupbuffer.com/site/submit",
    category: "General",
    difficulty: "easy",
    requirements: ["Company Info", "Logo"]
  },
  {
    name: "Web App Rater",
    url: "https://webapprater.com/submit-your-web-application-for-review-html",
    category: "Web Apps",
    difficulty: "medium",
    requirements: ["Web App Details", "Review Request"]
  },
  {
    name: "The Startup Pitch",
    url: "https://thestartuppitch.com/post-a-pitch/",
    category: "Pitch",
    difficulty: "medium",
    requirements: ["Pitch Deck", "Company Story"]
  },
  {
    name: "Astrogrowth",
    url: "https://www.astrogrowth.com",
    category: "Growth",
    difficulty: "easy",
    requirements: ["Growth Story", "Metrics"]
  },
  {
    name: "Paggu",
    url: "https://www.paggu.com/submit-your-startup/",
    category: "General",
    difficulty: "easy",
    requirements: ["Startup Details", "Logo"]
  },
  {
    name: "Robin Good's Tools",
    url: "http://tools.robingood.com/content/new/387",
    category: "Tools",
    difficulty: "easy",
    requirements: ["Tool Details", "Utility"]
  },
  {
    name: "EZlauncher",
    url: "https://www.ezlauncher.com/",
    category: "General",
    difficulty: "easy",
    requirements: ["Basic Info", "Description"]
  },
  {
    name: "Launched",
    url: "https://launched.io/newsubmission",
    category: "General",
    difficulty: "easy",
    requirements: ["Launch Details", "Story"]
  },
  {
    name: "Crazy About Startups",
    url: "https://www.crazyaboutstartups.com/share-your-startup-2",
    category: "General",
    difficulty: "easy",
    requirements: ["Startup Story", "Details"]
  },
  {
    name: "Allstartups",
    url: "http://allstartups.info/Startups/Submit",
    category: "General",
    difficulty: "easy",
    requirements: ["Basic Info", "Category"]
  },
  {
    name: "Startup Inspire",
    url: "https://www.startupinspire.com/submit",
    category: "General",
    difficulty: "easy",
    requirements: ["Inspiring Story", "Details"]
  },
  {
    name: "Bootstrappers.io",
    url: "https://bootstrappers.io/submit-a-link/",
    category: "Bootstrap",
    difficulty: "easy",
    requirements: ["Bootstrap Story", "Link"]
  },
  {
    name: "Startup88",
    url: "https://startup88.typeform.com/to/CRjWqM",
    category: "General",
    difficulty: "easy",
    requirements: ["Basic Info", "Form"]
  },
  {
    name: "Getworm",
    url: "https://getworm.com/submit-startup",
    category: "General",
    difficulty: "easy",
    requirements: ["Startup Details", "Description"]
  },
  {
    name: "Startup Costs",
    url: "https://www.startupcosts.co/add",
    category: "Costs",
    difficulty: "easy",
    requirements: ["Cost Breakdown", "Details"]
  },
  {
    name: "Surges.io",
    url: "https://www.surges.co/",
    category: "General",
    difficulty: "easy",
    requirements: ["Basic Info", "Description"]
  },
  {
    name: "10 Words",
    url: "https://app.10words.io",
    category: "Simple",
    difficulty: "easy",
    requirements: ["10 Word Description"]
  },
  {
    name: "Owwly",
    url: "https://owwly.com/account/login",
    category: "General",
    difficulty: "easy",
    requirements: ["Account", "Basic Info"]
  },
  {
    name: "Allstartups.org",
    url: "https://www.allstartups.org/submit-a-startup.html",
    category: "General",
    difficulty: "easy",
    requirements: ["Startup Details", "Form"]
  },
  {
    name: "Startup Button",
    url: "https://www.startupbutton.com/submit",
    category: "General",
    difficulty: "easy",
    requirements: ["Basic Info", "Logo"]
  },
  {
    name: "Awesome Indie",
    url: "https://awesomeindie.com/",
    category: "Indie",
    difficulty: "easy",
    requirements: ["Indie Project", "Description"]
  },
  
  // Additional Popular Directories
  {
    name: "Reddit /r/startups",
    url: "https://www.reddit.com/r/startups/submit",
    category: "Community",
    difficulty: "easy",
    requirements: ["Title", "Description"]
  },
  {
    name: "Reddit /r/SideProject",
    url: "https://www.reddit.com/r/SideProject/submit",
    category: "Side Projects",
    difficulty: "easy",
    requirements: ["Project Details", "Story"]
  },
  {
    name: "Reddit /r/entrepreneur",
    url: "https://www.reddit.com/r/entrepreneur/submit",
    category: "Entrepreneurship",
    difficulty: "easy",
    requirements: ["Business Story", "Value"]
  },
  {
    name: "Google My Business",
    url: "https://www.google.com/business/",
    category: "Local",
    difficulty: "easy",
    requirements: ["Business Details", "Location"]
  },
  {
    name: "LinkedIn Company Page",
    url: "https://www.linkedin.com/company/setup/new/",
    category: "Professional",
    difficulty: "easy",
    requirements: ["Company Details", "Logo"]
  },
  {
    name: "CNET Download",
    url: "https://www.cnet.com/",
    category: "Software",
    difficulty: "medium",
    requirements: ["Software Details", "Download"]
  },
  {
    name: "TechCrunch Tips",
    url: "https://techcrunch.com/tips/",
    category: "News",
    difficulty: "hard",
    requirements: ["Story Pitch", "Newsworthiness"]
  },
  {
    name: "Y Combinator Startup School",
    url: "https://www.startupschool.org/",
    category: "Education",
    difficulty: "medium",
    requirements: ["Startup Details", "Application"]
  },
  {
    name: "AppSumo",
    url: "https://sell.appsumo.com/",
    category: "Deals",
    difficulty: "hard",
    requirements: ["Product Details", "Deal Structure"]
  },
  {
    name: "Slant",
    url: "https://www.slant.co/",
    category: "Recommendations",
    difficulty: "medium",
    requirements: ["Product Comparison", "Features"]
  },
  {
    name: "Feedough",
    url: "https://feedough.com/submit-your-startup/",
    category: "Startup Stories",
    difficulty: "medium",
    requirements: ["Startup Story", "Details"]
  },
  {
    name: "GeekWire",
    url: "https://www.geekwire.com/submit-startup/",
    category: "Tech News",
    difficulty: "medium",
    requirements: ["Tech Story", "Innovation"]
  },
  {
    name: "VentureBeat",
    url: "https://venturebeat.com/submit-news/",
    category: "News",
    difficulty: "hard",
    requirements: ["Press Release", "Images"]
  },
  {
    name: "Exploding Topics",
    url: "https://explodingtopics.com/",
    category: "Trends",
    difficulty: "hard",
    requirements: ["Trending Topic", "Data"]
  },
  {
    name: "CB Insights",
    url: "https://www.cbinsights.com/",
    category: "Research",
    difficulty: "hard",
    requirements: ["Company Data", "Verification"]
  },
  {
    name: "PitchWall",
    url: "https://pitchwall.co/",
    category: "Pitch",
    difficulty: "medium",
    requirements: ["Pitch Video", "Details"]
  },
  {
    name: "Startup Grind",
    url: "https://www.startupgrind.com/",
    category: "Community",
    difficulty: "medium",
    requirements: ["Community Engagement", "Story"]
  },
  {
    name: "AngelCo Jobs",
    url: "https://angel.co/jobs",
    category: "Jobs",
    difficulty: "medium",
    requirements: ["Company Profile", "Job Listings"]
  },
  {
    name: "Wellfound",
    url: "https://wellfound.com/",
    category: "Startup Jobs",
    difficulty: "medium",
    requirements: ["Company Profile", "Team Info"]
  },
  {
    name: "Startup Jobs",
    url: "https://startup.jobs/",
    category: "Jobs",
    difficulty: "easy",
    requirements: ["Job Listings", "Company Info"]
  },
  {
    name: "NoDesk",
    url: "https://nodesk.co/",
    category: "Remote Work",
    difficulty: "easy",
    requirements: ["Remote Tool", "Description"]
  },
  {
    name: "Remote Year",
    url: "https://remoteyear.com/",
    category: "Remote Work",
    difficulty: "medium",
    requirements: ["Remote Story", "Community"]
  },
  {
    name: "Nomad List",
    url: "https://nomadlist.com/",
    category: "Digital Nomad",
    difficulty: "medium",
    requirements: ["Nomad Tool", "Community"]
  },
  {
    name: "Maker Log",
    url: "https://getmakerlog.com/",
    category: "Makers",
    difficulty: "easy",
    requirements: ["Project Log", "Progress"]
  },
  {
    name: "WIP",
    url: "https://wip.co/",
    category: "Work in Progress",
    difficulty: "easy",
    requirements: ["Project Updates", "Community"]
  },
  {
    name: "Makerpad",
    url: "https://www.makerpad.co/",
    category: "No-Code",
    difficulty: "medium",
    requirements: ["No-Code Tool", "Tutorial"]
  },
  {
    name: "No Code Founders",
    url: "https://www.nocodefounders.com/",
    category: "No-Code",
    difficulty: "easy",
    requirements: ["No-Code Story", "Founder"]
  },
  {
    name: "Bubble Showcase",
    url: "https://bubble.io/showcase",
    category: "No-Code",
    difficulty: "easy",
    requirements: ["Bubble App", "Description"]
  },
  {
    name: "Webflow Showcase",
    url: "https://webflow.com/discover/popular",
    category: "Design",
    difficulty: "medium",
    requirements: ["Webflow Site", "Design Quality"]
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com/",
    category: "Design",
    difficulty: "medium",
    requirements: ["Design Portfolio", "Quality"]
  },
  {
    name: "Behance",
    url: "https://www.behance.net/",
    category: "Creative",
    difficulty: "medium",
    requirements: ["Creative Portfolio", "Projects"]
  },
  {
    name: "DevPost",
    url: "https://devpost.com/",
    category: "Developer",
    difficulty: "easy",
    requirements: ["Project Details", "Code"]
  },
  {
    name: "GitHub Showcase",
    url: "https://github.com/",
    category: "Open Source",
    difficulty: "easy",
    requirements: ["Open Source Project", "Code"]
  },
  {
    name: "Awesome Lists",
    url: "https://github.com/sindresorhus/awesome",
    category: "Curated Lists",
    difficulty: "medium",
    requirements: ["Quality Tool", "Category Fit"]
  },
  {
    name: "Tools of the Trade",
    url: "https://github.com/cjbarber/ToolsOfTheTrade",
    category: "Developer Tools",
    difficulty: "medium",
    requirements: ["Developer Tool", "Utility"]
  },
  {
    name: "Stack Overflow",
    url: "https://stackoverflow.com/",
    category: "Developer",
    difficulty: "medium",
    requirements: ["Technical Solution", "Community"]
  },
  {
    name: "Dev.to",
    url: "https://dev.to/",
    category: "Developer",
    difficulty: "easy",
    requirements: ["Technical Article", "Story"]
  },
  {
    name: "Hashnode",
    url: "https://hashnode.com/",
    category: "Developer Blog",
    difficulty: "easy",
    requirements: ["Technical Content", "Blog"]
  },
  {
    name: "Medium Publications",
    url: "https://medium.com/",
    category: "Content",
    difficulty: "medium",
    requirements: ["Quality Article", "Story"]
  },
  {
    name: "Substack",
    url: "https://substack.com/",
    category: "Newsletter",
    difficulty: "medium",
    requirements: ["Newsletter Content", "Audience"]
  },
  {
    name: "ConvertKit",
    url: "https://convertkit.com/",
    category: "Email Marketing",
    difficulty: "medium",
    requirements: ["Email Tool", "Marketing"]
  },
  {
    name: "Mailchimp Showcase",
    url: "https://mailchimp.com/",
    category: "Email Marketing",
    difficulty: "medium",
    requirements: ["Email Campaign", "Design"]
  },
  {
    name: "Zapier App Directory",
    url: "https://zapier.com/apps",
    category: "Automation",
    difficulty: "hard",
    requirements: ["API Integration", "Automation"]
  },
  {
    name: "IFTTT",
    url: "https://ifttt.com/",
    category: "Automation",
    difficulty: "medium",
    requirements: ["Service Integration", "Automation"]
  },
  {
    name: "Integromat Scenarios",
    url: "https://www.make.com/",
    category: "Automation",
    difficulty: "medium",
    requirements: ["Integration Scenario", "Workflow"]
  }
];

