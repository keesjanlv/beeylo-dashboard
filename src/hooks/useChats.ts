import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Chat = Database['public']['Tables']['chats']['Row'];
type ChatWithProfiles = Chat & {
  customer: {
    name: string;
    avatar_url: string | null;
  } | null;
  agent: {
    name: string;
    avatar_url: string | null;
  } | null;
  company: {
    name: string;
    image_url: string | null;
  } | null;
};

export function useChats(companyId?: string) {
  const [chats, setChats] = useState<ChatWithProfiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('[useChats] Effect triggered, companyId:', companyId);

    // Don't fetch if companyId is undefined or null
    if (!companyId) {
      console.log('[useChats] No companyId provided, skipping fetch');
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchChats();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('chats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: companyId ? `company_id=eq.${companyId}` : undefined,
        },
        () => {
          console.log('[useChats] Real-time update received, refetching chats');
          // Refetch chats when changes occur
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      console.log('[useChats] Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [companyId]);

  async function fetchChats() {
    try {
      console.log('[useChats] Starting fetchChats, companyId:', companyId);
      setLoading(true);

      // Fetch chats first
      let chatsQuery = supabase
        .from('chats')
        .select('*')
        .order('last_message_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (companyId) {
        chatsQuery = chatsQuery.eq('company_id', companyId);
        console.log('[useChats] Filtering by company_id:', companyId);
      }

      const { data: chatsData, error: chatsError } = await chatsQuery;

      if (chatsError) {
        console.error('[useChats] Error fetching chats:', chatsError);
        throw chatsError;
      }

      console.log('[useChats] Fetched chats:', chatsData?.length || 0, 'chats');

      if (!chatsData || chatsData.length === 0) {
        console.log('[useChats] No chats found');
        setChats([]);
        setError(null);
        return;
      }

      // Get unique user IDs and company IDs
      const customerIds = [...new Set(chatsData.map(c => c.customer_id))];
      const agentIds = [...new Set(chatsData.map(c => c.agent_id).filter(Boolean))];
      const companyIds = [...new Set(chatsData.map(c => c.company_id))];

      console.log('[useChats] Fetching profiles for customers:', customerIds.length, 'agents:', agentIds.length);

      // Fetch user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, name, avatar_url')
        .in('id', [...customerIds, ...agentIds]);

      if (profilesError) {
        console.error('[useChats] Error fetching profiles:', profilesError);
      } else {
        console.log('[useChats] Fetched profiles:', profiles?.length || 0);
      }

      // Fetch companies
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('id, name, image_url')
        .in('id', companyIds);

      if (companiesError) {
        console.error('[useChats] Error fetching companies:', companiesError);
      } else {
        console.log('[useChats] Fetched companies:', companies?.length || 0);
      }

      // Create lookup maps
      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
      const companiesMap = new Map(companies?.map(c => [c.id, c]) || []);

      // Combine data
      const chatsWithProfiles: ChatWithProfiles[] = chatsData.map(chat => ({
        ...chat,
        customer: profilesMap.get(chat.customer_id) || null,
        agent: chat.agent_id ? profilesMap.get(chat.agent_id) || null : null,
        company: companiesMap.get(chat.company_id) || null,
      }));

      console.log('[useChats] Successfully loaded', chatsWithProfiles.length, 'chats with profiles');
      setChats(chatsWithProfiles);
      setError(null);
    } catch (err) {
      console.error('[useChats] Error in fetchChats:', err);
      setError(err as Error);
    } finally {
      console.log('[useChats] fetchChats complete, loading=false');
      setLoading(false);
    }
  }

  return { chats, loading, error, refetch: fetchChats };
}
