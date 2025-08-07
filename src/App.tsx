import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase, getUser } from './lib/supabase';
import { LOCAL_MEMORY, mockUser } from './lib/mockData';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Landing } from './pages/Landing';
import { AuthPage } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Pricing } from './pages/Pricing';
import { SubmitStartup } from './pages/SubmitStartup';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (LOCAL_MEMORY) {
      // Use mock user for local testing
      setUser(mockUser);
      setLoading(false);
      return;
    }

    // Real Supabase implementation
    supabase!.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          {LOCAL_MEMORY && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              <p className="font-semibold">🧪 Demo Mode Active</p>
              <p className="text-sm">Using mock data for testing</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        {LOCAL_MEMORY && (
          <div className="bg-emerald-600 text-white text-center py-2 px-4 text-sm">
            🧪 <strong>Demo Mode:</strong> Using mock data - No real payments or submissions
          </div>
        )}
        <Header user={user} />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/auth" />}
            />
            <Route
              path="/submit"
              element={user ? <SubmitStartup /> : <Navigate to="/auth" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
