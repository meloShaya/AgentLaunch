# AgentLaunch AI - Deployment Guide

## Overview

AgentLaunch AI is now ready for production deployment. This guide covers the complete setup process for both development and production environments.

## What's Been Completed

### ✅ Frontend (React + TypeScript + Vite)
- Modern React application with TypeScript
- Responsive design with Tailwind CSS
- Complete user interface for startup submission
- Dashboard with campaign tracking
- Pricing page with multiple plans
- Authentication flow integration
- Demo mode with mock data for testing

### ✅ Backend (Node.js + Express)
- RESTful API server with Express
- Stripe payment integration
- Supabase database integration
- AI-powered agent service with OpenAI GPT-4 Vision
- Automated form filling using Puppeteer
- Webhook handling for payment processing
- Cron job for processing pending submissions

### ✅ Database (Supabase)
- Complete database schema with migrations
- Tables for users, startups, submission jobs, and results
- Comprehensive directory list (100+ startup directories)
- Proper relationships and constraints

### ✅ AI Agent Service
- Advanced AI agent using OpenAI GPT-4 Vision API
- Automated form analysis and filling
- Screenshot analysis for form field detection
- Intelligent submission handling
- Error handling and retry logic
- Progress tracking and reporting

### ✅ Directory Database
- Curated list of 100+ high-quality startup directories
- Includes top-tier directories like Product Hunt, Crunchbase, AngelList
- Categorized by difficulty and requirements
- Regular directories for broader reach

## Environment Setup

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/meloShaya/AgentLaunch
cd AgentLaunch
npm install
cd server && npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required services:
- **Supabase**: Database and authentication
- **Stripe**: Payment processing
- **OpenAI**: AI agent functionality

### 3. Database Setup

1. Create a new Supabase project
2. Run the migration file in the SQL editor:
   ```sql
   -- Copy content from supabase/migrations/20250628094513_broad_snowflake.sql
   ```
3. Enable Row Level Security (RLS) policies as needed

### 4. Stripe Configuration

1. Create Stripe products and prices for each plan
2. Set up webhook endpoint: `your-domain.com/api/stripe-webhook`
3. Configure webhook events: `checkout.session.completed`

## Development

### Start Development Servers

```bash
# Frontend (port 5173)
npm run dev

# Backend (port 3001)
cd server && npm start
```

### Demo Mode

The application includes a demo mode for testing without real payments:
- Set `LOCAL_MEMORY = true` in `src/lib/mockData.ts`
- Uses mock data for all operations
- No real API calls or payments

## Production Deployment

### Frontend Deployment

```bash
# Build for production
npm run build

# Deploy to your hosting platform
# The dist/ folder contains the built application
```

### Backend Deployment

```bash
# Install production dependencies
cd server && npm install --production

# Start with PM2 or similar process manager
pm2 start index.js --name agentlaunch-api
```

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:
- Database URLs and keys
- API keys for external services
- Proper CORS origins
- Webhook secrets

## Testing

### Manual Testing Checklist

✅ **Frontend**
- Landing page loads correctly
- User authentication flow
- Dashboard displays campaigns
- Startup submission form works
- Pricing page displays plans
- Responsive design on mobile

✅ **Backend**
- Health check endpoint responds
- Stripe webhook processing
- Database connections work
- AI agent service functions
- Cron jobs execute properly

✅ **Integration**
- Payment flow (in demo mode)
- Campaign creation and tracking
- Real-time progress updates
- Error handling and recovery

## Security Considerations

### Implemented Security Features
- Environment variable protection
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization
- Rate limiting (recommended for production)
- Secure webhook signature verification

### Additional Recommendations
- Enable HTTPS in production
- Set up proper firewall rules
- Monitor API usage and errors
- Regular security updates
- Database backup strategy

## Monitoring and Maintenance

### Logging
- Server logs for debugging
- Error tracking for issues
- Performance monitoring
- User activity analytics

### Maintenance Tasks
- Regular dependency updates
- Database maintenance
- Monitor AI API usage and costs
- Review and update directory list
- Performance optimization

## Troubleshooting

### Common Issues

1. **Frontend not loading**
   - Check if Vite dev server is running
   - Verify environment variables
   - Check browser console for errors

2. **Backend API errors**
   - Verify database connection
   - Check API keys and secrets
   - Review server logs

3. **AI agent failures**
   - Verify OpenAI API key and credits
   - Check Puppeteer browser installation
   - Review form analysis logic

4. **Payment processing issues**
   - Verify Stripe configuration
   - Check webhook endpoint accessibility
   - Review webhook signature verification

## Support and Documentation

### Additional Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [React Documentation](https://react.dev)

### Getting Help
- Check the GitHub repository for issues
- Review error logs for specific problems
- Test in demo mode to isolate issues
- Verify all environment variables are set correctly

## Conclusion

AgentLaunch AI is now production-ready with:
- Complete full-stack application
- AI-powered automation
- Payment processing
- Comprehensive directory database
- Robust error handling
- Scalable architecture

The application can handle real-world startup directory submissions with intelligent form filling and progress tracking.

