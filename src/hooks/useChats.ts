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
          // Refetch chats when changes occur
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [companyId]);

  async function fetchChats() {
    try {
      setLoading(true);

      // Fetch chats first
      let chatsQuery = supabase
        .from('chats')
        .select('*')
        .order('last_message_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (companyId) {
        chatsQuery = chatsQuery.eq('company_id', companyId);
      }

      const { data: chatsData, error: chatsError } = await chatsQuery;

      if (chatsError) throw chatsError;

      if (!chatsData || chatsData.length === 0) {
        setChats([]);
        setError(null);
        return;
      }

      // Get unique user IDs and company IDs
      const customerIds = [...new Set(chatsData.map(c => c.customer_id))];
      const agentIds = [...new Set(chatsData.map(c => c.agent_id).filter(Boolean))];
      const companyIds = [...new Set(chatsData.map(c => c.company_id))];

      // Fetch user profiles
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, name, avatar_url')
        .in('id', [...customerIds, ...agentIds]);

      // Fetch companies
      const { data: companies } = await supabase
        .from('companies')
        .select('id, name, image_url')
        .in('id', companyIds);

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

      setChats(chatsWithProfiles);
      setError(null);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return { chats, loading, error, refetch: fetchChats };
}
