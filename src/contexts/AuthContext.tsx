'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Company {
  id: string;
  name: string;
  bio: string | null;
  industry: string | null;
  image_url: string | null;
}

interface AuthContextType {
  user: User | null;
  company: Company | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshCompany: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  company: null,
  loading: true,
  signOut: async () => {},
  refreshCompany: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCompanyData = async (userId: string) => {
    try {
      // Get user profile to find company_id
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('company_id')
        .eq('id', userId)
        .single();

      if (profileError || !profile?.company_id) {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      // Get company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id, name, bio, industry, image_url')
        .eq('id', profile.company_id)
        .single();

      if (companyError) {
        console.error('Error fetching company:', companyError);
        return;
      }

      setCompany(companyData);
    } catch (error) {
      console.error('Unexpected error fetching company:', error);
    }
  };

  const refreshCompany = async () => {
    if (user?.id) {
      await fetchCompanyData(user.id);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchCompanyData(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchCompanyData(session.user.id);
      } else {
        setCompany(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCompany(null);
  };

  return (
    <AuthContext.Provider value={{ user, company, loading, signOut, refreshCompany }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
