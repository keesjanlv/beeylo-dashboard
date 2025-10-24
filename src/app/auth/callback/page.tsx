'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleAuthCallback();
  }, []);

  async function handleAuthCallback() {
    try {
      console.log('[Auth Callback] Starting authentication callback');

      // Check for error in URL params
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (errorParam) {
        console.error('[Auth Callback] Error in URL params:', errorParam, errorDescription);
        throw new Error(errorDescription || errorParam);
      }

      // Exchange the code for a session
      const code = searchParams.get('code');

      if (code) {
        console.log('[Auth Callback] Exchanging code for session');

        // Clear any existing session before exchanging code
        await supabase.auth.signOut({ scope: 'local' });

        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error('[Auth Callback] Exchange error:', exchangeError);
          throw exchangeError;
        }

        console.log('[Auth Callback] Successfully exchanged code for session');
      }

      // Get the current session with a small delay to ensure it's set
      await new Promise(resolve => setTimeout(resolve, 100));

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('[Auth Callback] Session error:', sessionError);
        throw sessionError;
      }

      if (!session) {
        console.error('[Auth Callback] No session found after exchange');
        throw new Error('No session found after authentication');
      }

      console.log('[Auth Callback] Authentication successful, redirecting to dashboard');

      // Successfully authenticated, redirect to dashboard
      router.push('/');
    } catch (err) {
      console.error('[Auth Callback] Fatal error:', err);

      // Clear any bad session state
      await supabase.auth.signOut({ scope: 'local' });

      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/register')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
