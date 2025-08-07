import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { LOCAL_MEMORY } from '../lib/mockData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Rocket } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (LOCAL_MEMORY) {
      // In local mode, user is already "authenticated"
      return;
    }

    const { data: { subscription } } = supabase!.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleDemoLogin = () => {
    // In demo mode, just redirect to dashboard
    navigate('/dashboard');
  };

  if (LOCAL_MEMORY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-amber-900 to-orange-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-amber-600 rounded-lg mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to AgentLaunch AI</h1>
            <p className="text-gray-300">Demo Mode - No authentication required</p>
          </div>

          <Card glass className="p-8">
            <div className="space-y-6">
              <div className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-4 py-3 rounded">
                <p className="font-semibold">🧪 Demo Mode Active</p>
                <p className="text-sm mt-1">
                  You're logged in as: <strong>demo@agentlaunch.ai</strong>
                </p>
              </div>

              <Button
                onClick={handleDemoLogin}
                className="w-full"
                size="lg"
              >
                Continue to Dashboard
              </Button>

              <div className="text-center text-sm text-gray-300">
                <p>Demo includes:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Sample startups and campaigns</li>
                  <li>• Mock submission results</li>
                  <li>• Simulated payment flow</li>
                  <li>• Real-time progress updates</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-amber-900 to-orange-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-amber-600 rounded-lg mb-4">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to AgentLaunch AI</h1>
          <p className="text-gray-300">Sign in to start your automated submission campaign</p>
        </div>

        <Card glass className="p-8">
          <Auth
            supabaseClient={supabase!}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#8B5CF6',
                    brandAccent: '#7C3AED',
                    brandButtonText: 'white',
                    defaultButtonBackground: 'transparent',
                    defaultButtonBackgroundHover: '#374151',
                    defaultButtonBorder: '#4B5563',
                    defaultButtonText: 'white',
                    dividerBackground: '#374151',
                    inputBackground: 'rgba(255, 255, 255, 0.1)',
                    inputBorder: 'rgba(255, 255, 255, 0.2)',
                    inputBorderHover: 'rgba(255, 255, 255, 0.4)',
                    inputBorderFocus: '#8B5CF6',
                    inputText: 'white',
                    inputLabelText: 'rgba(255, 255, 255, 0.8)',
                    inputPlaceholder: 'rgba(255, 255, 255, 0.5)',
                  },
                  space: {
                    buttonPaddingX: '16px',
                    buttonPaddingY: '12px',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                }
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              }
            }}
            providers={['google', 'github']}
            redirectTo={`${window.location.origin}/dashboard`}
            view="sign_in"
          />
        </Card>

        <p className="text-center text-gray-400 text-sm mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
