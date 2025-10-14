import { supabase } from './supabase';

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithMicrosoft() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: 'email profile',
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
}

export async function createCompanyProfile(userId: string, companyName: string) {
  // First create the company
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .insert({
      name: companyName,
    })
    .select()
    .single();

  if (companyError) throw companyError;

  // Then update the user profile to be a company_owner
  const { error: profileError } = await supabase
    .from('user_profiles')
    .update({
      role: 'company_owner',
      company_id: company.id,
    })
    .eq('id', userId);

  if (profileError) throw profileError;

  return company;
}
