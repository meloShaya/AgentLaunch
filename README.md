# AgentLaunch AI

AgentLaunch AI is a full-stack web application that automates startup directory submissions using advanced AI technology. The platform allows startup founders to submit their company information to 100+ online directories with intelligent form-filling powered by multimodal AI.

## 🚀 Features

- **AI-Powered Automation**: Advanced multimodal LLM analyzes directory forms and fills them intelligently
- **100+ Directories**: Submit to Product Hunt, Hacker News, AngelList, and many more
- **Real-time Dashboard**: Track submission progress and results in real-time
- **Secure Payments**: Integrated Stripe payment processing
- **Responsive Design**: Modern, mobile-first UI with glass morphism effects
- **Background Processing**: Intelligent job queuing and processing system

## 🏗️ Architecture

### Frontend (React + TypeScript + Tailwind CSS)
- **Landing Page**: Futuristic design with clear value proposition
- **Authentication**: Supabase Auth with email/password and social logins
- **Multi-step Form**: Comprehensive startup information collection
- **Dashboard**: Real-time submission tracking and detailed reporting
- **Pricing Page**: Multiple packages with Stripe integration

### Backend (Node.js + Express)
- **API Server**: RESTful API with JWT authentication
- **AI Agent Service**: Puppeteer + OpenAI for intelligent form filling
- **Stripe Integration**: Payment processing and webhook handling
- **Background Jobs**: Automated submission processing with cron jobs

### Database (Supabase PostgreSQL)
- **Row Level Security**: Secure data access policies
- **Real-time Updates**: Live dashboard updates
- **File Storage**: Logo upload and management

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Stripe account
- OpenAI API key

### 1. Clone and Install
```bash
git clone <repository-url>
cd agentlaunch-ai
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side)
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `OPENAI_API_KEY`: OpenAI API key for multimodal AI
- `STRIPE_BASIC_PRICE_ID`: Stripe price ID for basic plan
- `STRIPE_PRO_PRICE_ID`: Stripe price ID for pro plan
- `STRIPE_ENTERPRISE_PRICE_ID`: Stripe price ID for enterprise plan

### 3. Database Setup
1. Create a new Supabase project
2. Run the SQL script in `database/schema.sql` in your Supabase SQL editor
3. Enable Row Level Security on all tables (done automatically by the script)

### 4. Stripe Setup
1. Create a Stripe account and get your API keys
2. Create webhook endpoint pointing to `https://yourdomain.com/api/stripe-webhook`
3. Create products and prices for your packages
4. Add the webhook secret to your environment variables

### 5. OpenAI Setup
1. Get an OpenAI API key with access to GPT-4 Vision
2. Add the key to your environment variables

### 6. Supabase Storage Setup
The schema script automatically creates the `startup-logos` bucket, but verify:
1. Go to Storage in your Supabase dashboard
2. Ensure the `startup-logos` bucket exists and is public
3. Verify the RLS policies are active

## 🚀 Running the Application

### Development Mode
```bash
# Start the frontend (Vite dev server)
npm run dev

# Start the backend server (in another terminal)
npm run server
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.

### Production Build
```bash
# Build the frontend
npm run build

# Start the production server
NODE_ENV=production npm run server
```

## 🤖 AI Agent Architecture

The AI agent uses a sophisticated multi-step process:

1. **Page Analysis**: Takes screenshot and captures HTML DOM
2. **AI Processing**: Sends data to GPT-4 Vision for form field identification
3. **Intelligent Filling**: Maps startup data to identified form fields
4. **Smart Submission**: Handles form submission and result verification
5. **Error Handling**: Graceful failure handling with detailed logging

### Supported Form Types
- React/Vue.js dynamic forms
- Traditional HTML forms
- Multi-step wizards
- File upload forms
- CAPTCHA detection (logged for manual review)

## 📊 Database Schema

### Core Tables
- `startups`: Company information and metadata
- `submission_jobs`: Background job tracking
- `submission_results`: Individual directory submission results
- `directories`: Master list of supported directories

### Security
- Row Level Security enabled on all tables
- Users can only access their own data
- Service role required for backend operations

## 🔧 Configuration

### Adding New Directories
Edit `src/data/directories.ts` to add new submission targets:

```typescript
{
  name: "New Directory",
  url: "https://example.com/submit",
  category: "General",
  difficulty: "medium",
  requirements: ["Logo", "Description"]
}
```

### Customizing Pricing Plans
Modify `src/data/directories.ts` to adjust pricing tiers and features.

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred hosting platform
3. Set environment variables in your hosting platform

### Backend (Railway/Render/DigitalOcean)
1. Deploy the entire project to your server platform
2. Set all environment variables
3. Ensure the server runs `npm run server`
4. Configure domain and SSL

### Database (Supabase)
Already hosted - just ensure your connection strings are correct.

## 🔒 Security Considerations

- All API endpoints require authentication
- Sensitive operations use service role key
- Row Level Security prevents data leaks
- Stripe webhooks are verified with signatures
- Rate limiting should be implemented for production

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   - Verify your project URL and keys
   - Check if RLS policies are properly configured

2. **Stripe Webhook Failures**
   - Ensure webhook secret matches environment variable
   - Verify webhook endpoint is accessible

3. **AI Analysis Failures**
   - Check OpenAI API key and credits
   - Verify internet connectivity for API calls

4. **Puppeteer Issues**
   - Install Chrome dependencies on Linux servers
   - Use `--no-sandbox` flag in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@agentlaunch.ai
- Documentation: [docs.agentlaunch.ai](https://docs.agentlaunch.ai)

---

Built with ❤️ by the AgentLaunch AI team