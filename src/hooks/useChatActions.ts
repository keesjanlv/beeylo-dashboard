import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Message = Database['public']['Tables']['messages']['Insert'];
type Chat = Database['public']['Tables']['chats']['Update'];

export function useChatActions() {
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function sendMessage(
    chatId: string,
    content: string,
    type: 'text' | 'order_update' | 'system' = 'text',
    metadata?: Record<string, any>
  ) {
    try {
      setSending(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const message: Message = {
        chat_id: chatId,
        sender_id: user.id,
        content,
        type,
        metadata: metadata || {},
      };

      const { data, error: sendError } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();

      if (sendError) throw sendError;

      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err as Error);
      throw err;
    } finally {
      setSending(false);
    }
  }

  async function updateChatStatus(
    chatId: string,
    status: 'open' | 'pending' | 'closed'
  ) {
    try {
      setUpdating(true);
      setError(null);

      const update: Chat = {
        status,
        updated_at: new Date().toISOString(),
      };

      const { data, error: updateError } = await supabase
        .from('chats')
        .update(update)
        .eq('id', chatId)
        .select()
        .single();

      if (updateError) throw updateError;

      return data;
    } catch (err) {
      console.error('Error updating chat status:', err);
      setError(err as Error);
      throw err;
    } finally {
      setUpdating(false);
    }
  }

  async function assignAgent(chatId: string, agentId: string | null) {
    try {
      setUpdating(true);
      setError(null);

      const update: Chat = {
        agent_id: agentId,
        updated_at: new Date().toISOString(),
      };

      const { data, error: updateError } = await supabase
        .from('chats')
        .update(update)
        .eq('id', chatId)
        .select()
        .single();

      if (updateError) throw updateError;

      return data;
    } catch (err) {
      console.error('Error assigning agent:', err);
      setError(err as Error);
      throw err;
    } finally {
      setUpdating(false);
    }
  }

  async function updateChatSubject(chatId: string, subject: string) {
    try {
      setUpdating(true);
      setError(null);

      const update: Chat = {
        subject,
        updated_at: new Date().toISOString(),
      };

      const { data, error: updateError } = await supabase
        .from('chats')
        .update(update)
        .eq('id', chatId)
        .select()
        .single();

      if (updateError) throw updateError;

      return data;
    } catch (err) {
      console.error('Error updating chat subject:', err);
      setError(err as Error);
      throw err;
    } finally {
      setUpdating(false);
    }
  }

  return {
    sendMessage,
    updateChatStatus,
    assignAgent,
    updateChatSubject,
    sending,
    updating,
    error,
  };
}
