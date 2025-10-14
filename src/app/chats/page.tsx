'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page redirects to /chats-supabase which uses real Supabase data
// The original mock data design is preserved in page.mock-design-reference.tsx
// for implementing future features

export default function ChatsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/chats-supabase');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Redirecting to chats...</p>
      </div>
    </div>
  );
}
