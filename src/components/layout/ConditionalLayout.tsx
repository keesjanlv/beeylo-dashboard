'use client';

import { usePathname } from 'next/navigation';
import MainLayout from './MainLayout';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Pages that should NOT have the main layout (sidebar, header, etc.)
  const authPages = ['/login', '/register', '/auth/callback'];

  // Check if current page is an auth page
  const isAuthPage = authPages.some(page => pathname?.startsWith(page));

  // If it's an auth page, render children without MainLayout
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Otherwise, render with MainLayout
  return <MainLayout>{children}</MainLayout>;
};

export default ConditionalLayout;
