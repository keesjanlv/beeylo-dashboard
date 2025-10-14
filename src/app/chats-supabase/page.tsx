'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import FullscreenWrapper from '../../components/layout/FullscreenWrapper';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { useChats } from '../../hooks/useChats';
import { useMessages } from '../../hooks/useMessages';
import { useChatActions } from '../../hooks/useChatActions';
import { useAuth } from '../../contexts/AuthContext';

function ChatsSupabaseContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'pending' | 'closed'>('all');

  // Get user's company ID from profile
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanyId() {
      if (!user) return;

      const { supabase } = await import('../../lib/supabase');
      const { data } = await supabase
        .from('user_profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (data?.company_id) {
        setCompanyId(data.company_id);
      }
    }

    fetchCompanyId();
  }, [user]);

  const { chats, loading: chatsLoading, error: chatsError } = useChats(companyId || undefined);
  const { messages, loading: messagesLoading } = useMessages(selectedChatId);
  const { sendMessage, sending, updateChatStatus } = useChatActions();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || chat.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid date';

    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return minutes <= 0 ? 'Just now' : `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChatId) return;

    try {
      await sendMessage(selectedChatId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <FullscreenWrapper>
      <div className="flex flex-col bg-gray-50 !p-0 !m-0 !max-w-none h-full w-full">
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          <div className="flex flex-col lg:flex-row flex-1 bg-white overflow-hidden">
            {/* Chat List */}
            <div className="w-full lg:w-[420px] flex flex-col h-full min-h-0 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h1 className="text-lg font-semibold text-gray-900 mb-4">
                  Customer Chats
                </h1>

                {/* Search */}
                <div className="relative mb-4">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                </div>

                {/* Status Filters */}
                <div className="flex gap-2">
                  {(['all', 'open', 'pending', 'closed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filterStatus === status
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {chatsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                  </div>
                ) : chatsError ? (
                  <div className="p-4 text-center text-red-600">
                    Error loading chats: {chatsError.message}
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No chats found</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleSelectChat(chat.id)}
                      className={`p-5 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-all ${
                        selectedChatId === chat.id
                          ? 'bg-blue-50 border-l-4 border-l-blue-500'
                          : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {chat.customer?.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('') || '?'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {chat.customer?.name || 'Unknown Customer'}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatTime(chat.last_message_at)}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-gray-600 truncate mt-1">
                            {chat.subject || 'No subject'}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {chat.last_message || 'No messages yet'}
                          </p>
                          <div className="mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                chat.status
                              )}`}
                            >
                              {chat.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="w-full lg:flex-1 flex flex-col h-full min-h-0">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-gray-50 p-4 md:p-5 lg:p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handleBackToList}
                          className="lg:hidden mr-2 p-2 hover:bg-gray-200 rounded-full"
                        >
                          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                        </button>
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {selectedChat.customer?.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('') || '?'}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">
                            {selectedChat.customer?.name || 'Unknown'}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {selectedChat.subject || 'No subject'}
                          </p>
                        </div>
                      </div>
                      <select
                        value={selectedChat.status}
                        onChange={(e) =>
                          updateChatStatus(
                            selectedChat.id,
                            e.target.value as 'open' | 'pending' | 'closed'
                          )
                        }
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-5 lg:p-6 space-y-4 bg-gray-50">
                    {messagesLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <p>No messages yet</p>
                        <p className="text-sm mt-2">
                          Start the conversation with {selectedChat.customer?.name}
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isAgent =
                          message.sender?.role === 'agent' ||
                          message.sender?.role === 'company_owner' ||
                          message.sender?.role === 'admin';

                        return (
                          <div
                            key={message.id}
                            className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md rounded-2xl shadow-sm px-5 py-3 ${
                                isAgent
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border border-gray-200 text-gray-900'
                              }`}
                            >
                              {!isAgent && (
                                <p
                                  className={`text-xs font-medium mb-1 ${
                                    isAgent ? 'text-blue-100' : 'text-blue-600'
                                  }`}
                                >
                                  {message.sender?.name || 'Customer'}
                                </p>
                              )}
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isAgent ? 'text-blue-100' : 'text-gray-500'
                                }`}
                              >
                                {new Date(message.created_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="bg-white border-t border-gray-200 p-4 md:p-5 lg:p-6">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={sending}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={sending || !newMessage.trim()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {sending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <PaperAirplaneIcon className="h-5 w-5" />
                            Send
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500">
                      Choose a conversation from the sidebar to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </FullscreenWrapper>
  );
}

export default function ChatsSupabasePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      }
    >
      <ChatsSupabaseContent />
    </Suspense>
  );
}
