import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Message = Database['public']['Tables']['messages']['Row'];
type MessageWithSender = Message & {
  sender: {
    name: string;
    avatar_url: string | null;
    role: 'customer' | 'agent' | 'company_owner' | 'admin';
  } | null;
};

export function useMessages(chatId: string | null) {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`messages-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          // Add new message to the list
          const newMessage = payload.new as Message;

          // Fetch sender info for the new message
          supabase
            .from('user_profiles')
            .select('name, avatar_url, role')
            .eq('id', newMessage.sender_id)
            .single()
            .then(({ data: sender }) => {
              setMessages((prev) => [...prev, { ...newMessage, sender }]);
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  async function fetchMessages() {
    if (!chatId) return;

    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles(name, avatar_url, role)
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setMessages(data as MessageWithSender[]);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return { messages, loading, error, refetch: fetchMessages };
}
