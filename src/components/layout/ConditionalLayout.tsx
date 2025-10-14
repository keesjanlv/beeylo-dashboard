'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MainLayout from './MainLayout';
import { useAuth } from '@/contexts/AuthContext';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Pages that should NOT have the main layout (sidebar, header, etc.)
  const authPages = ['/login', '/register', '/auth/callback'];

  // Check if current page is an auth page
  const isAuthPage = authPages.some(page => pathname?.startsWith(page));

  // Redirect to login if not authenticated and not on an auth page
  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.push('/login');
    }
  }, [user, loading, isAuthPage, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If it's an auth page, render children without MainLayout
  if (isAuthPage) {
    return <>{children}</>;
  }

  // If not authenticated, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  // Otherwise, render with MainLayout
  return <MainLayout>{children}</MainLayout>;
};

export default ConditionalLayout;
