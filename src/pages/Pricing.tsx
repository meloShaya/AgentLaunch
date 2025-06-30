import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { pricingPlans } from '../data/directories';
import { createCheckoutSession } from '../lib/stripe';
import { LOCAL_MEMORY } from '../lib/mockData';

export const Pricing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const startupId = searchParams.get('startup');
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (plan: any) => {
    if (!startupId) {
      alert('Please submit your startup information first');
      return;
    }

    setLoading(plan.id);
    try {
      await createCheckoutSession(plan.stripePriceId, startupId);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your startup's growth. 
              All plans include our advanced AI automation and detailed reporting.
            </p>
            {LOCAL_MEMORY && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mt-6 max-w-md mx-auto">
                <p className="font-semibold">🧪 Demo Mode</p>
                <p className="text-sm">Payments are simulated - no real charges</p>
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={plan.popular ? 'md:scale-105' : ''}
            >
              <Card className={`p-6 sm:p-8 h-full relative ${plan.popular ? 'border-purple-500 border-2' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-cyan-600">
                    {plan.id === 'basic' && <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                    {plan.id === 'pro' && <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                    {plan.id === 'enterprise' && <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {LOCAL_MEMORY ? 'FREE' : `$${plan.price}`}
                    </span>
                    {!LOCAL_MEMORY && <span className="text-sm sm:text-base text-gray-500">/campaign</span>}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">{plan.directories} directory submissions</p>
                </div>

                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  onClick={() => handleSelectPlan(plan)}
                  loading={loading === plan.id}
                  disabled={!startupId || loading === plan.id}
                >
                  {LOCAL_MEMORY ? 'Start Demo Campaign' : 'Get Started'}
                </Button>

                {!startupId && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Submit your startup info first
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Need a Custom Solution?</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              For larger campaigns or custom requirements, we offer tailored solutions 
              with dedicated support and advanced features.
            </p>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};