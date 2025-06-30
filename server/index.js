import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { AgentService } from './services/agent.js';
import cron from 'node-cron';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase (service role for server-side operations)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Agent Service
const agentService = new AgentService(supabase);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Stripe webhook middleware (needs raw body)
app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }));

// Regular JSON middleware for other routes
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Create Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, startupId } = req.body;
    
    if (!priceId || !startupId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify startup exists and belongs to authenticated user
    // In a real app, you'd validate the JWT token here
    const { data: startup, error } = await supabase
      .from('startups')
      .select('*')
      .eq('id', startupId)
      .single();

    if (error || !startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/pricing?canceled=true`,
      metadata: {
        startupId,
        priceId,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stripe webhook handler
app.post('/api/stripe-webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { startupId, priceId } = session.metadata;

      // Determine package type based on price ID
      let packageType = 'basic';
      let totalDirectories = 50;

      if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
        packageType = 'pro';
        totalDirectories = 100;
      } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
        packageType = 'enterprise';
        totalDirectories = 150;
      }

      // Get startup to find user_id
      const { data: startup } = await supabase
        .from('startups')
        .select('user_id')
        .eq('id', startupId)
        .single();

      if (startup) {
        // Create submission job
        const { data: job, error } = await supabase
          .from('submission_jobs')
          .insert([{
            user_id: startup.user_id,
            startup_id: startupId,
            package_type: packageType,
            status: 'paid',
            total_directories: totalDirectories,
            stripe_session_id: session.id
          }])
          .select()
          .single();

        if (!error && job) {
          console.log(`Created submission job ${job.id} for startup ${startupId}`);
          
          // Start the agent process (in background)
          agentService.processJob(job.id).catch(console.error);
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handling failed' });
  }
});

// Cron job to process pending jobs (runs every 5 minutes)
cron.schedule('*/5 * * * *', async () => {
  console.log('Checking for pending submission jobs...');
  try {
    await agentService.processPendingJobs();
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

// Start server
app.listen(port, () => {
  console.log(`AgentLaunch AI server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});