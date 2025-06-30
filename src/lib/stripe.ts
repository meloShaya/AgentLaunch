import { loadStripe } from '@stripe/stripe-js';
import { LOCAL_MEMORY, mockAPI } from './mockData';

const stripePromise = LOCAL_MEMORY ? null : loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (priceId: string, startupId: string) => {
  if (LOCAL_MEMORY) {
    // Use mock API for local testing
    const result = await mockAPI.createCheckoutSession(priceId, startupId);
    
    // Show success message and redirect to dashboard
    alert(`🎉 ${result.message}\n\nRedirecting to dashboard to view progress...`);
    
    // Simulate redirect delay
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
    
    return result;
  }

  // Real Stripe implementation
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      startupId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const { sessionId } = await response.json();
  
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  const { error } = await stripe.redirectToCheckout({
    sessionId,
  });

  if (error) {
    throw error;
  }
};

export { stripePromise };