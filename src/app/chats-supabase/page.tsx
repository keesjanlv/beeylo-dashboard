'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import FullscreenWrapper from '../../components/layout/FullscreenWrapper';
import CustomerInfoSidebar from '../../components/CustomerInfoSidebar';
import ChatCard from '../../components/ChatCard';
import CustomerCard from '../../components/CustomerCard';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
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
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'chats' | 'customers'>('chats');
  const [showCustomerSidebar, setShowCustomerSidebar] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

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

  // Group chats by customer
  const customerGroups = chats.reduce((acc, chat) => {
    const customerId = chat.customer_id;
    if (!acc[customerId]) {
      acc[customerId] = {
        customerId,
        customerName: chat.customer?.name || 'Unknown',
        chats: [],
      };
    }
    acc[customerId].chats.push(chat);
    return acc;
  }, {} as Record<string, { customerId: string; customerName: string; chats: typeof chats }>);

  const customers = Object.values(customerGroups);

  // Filter for chats view
  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || chat.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Filter for customers view
  const filteredCustomers = customers.filter((customer) => {
    return customer.customerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get chats for selected customer
  const selectedCustomerChats = selectedCustomerId
    ? chats.filter((chat) => chat.customer_id === selectedCustomerId)
    : [];

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

  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isUrgent = (lastMessageAt: string | null, status: string) => {
    if (!lastMessageAt || status === 'closed') return false;
    const date = new Date(lastMessageAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    // Mark as urgent if message is within last 2 hours and chat is open or pending
    return diffInHours < 2 && (status === 'open' || status === 'pending');
  };

  const isBriefingChat = (chat: any) => {
    // A chat is considered a "briefing" (new) if:
    // 1. It has no agent assigned yet, or
    // 2. It was created less than 5 minutes ago and is open
    if (!chat.agent_id) return true;

    const createdDate = new Date(chat.created_at);
    const now = new Date();
    const diffInMinutes = (now.getTime() - createdDate.getTime()) / (1000 * 60);

    return diffInMinutes < 5 && chat.status === 'open';
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
    setShowCustomerSidebar(true);
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
    setShowCustomerSidebar(false);
    if (viewMode === 'customers') {
      setSelectedCustomerId(null);
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setSelectedChatId(null); // Clear any selected chat
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
            {/* Chat List (Chats view) OR Customer List (Customers view) */}
            <div className="w-full lg:w-[320px] flex flex-col h-full min-h-0 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                {/* View Mode Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setViewMode('chats')}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      viewMode === 'chats'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Chats
                  </button>
                  <button
                    onClick={() => setViewMode('customers')}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      viewMode === 'customers'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Customers
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Filter and Unread Count Row */}
                {viewMode === 'chats' && (
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900"
                      >
                        <span>{filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</span>
                        <ChevronDownIcon className="h-3 w-3" />
                      </button>
                      {showFilterDropdown && (
                        <div className="absolute z-10 mt-1 min-w-[120px] bg-white border border-gray-200 rounded-lg shadow-lg">
                          {(['all', 'open', 'pending', 'closed'] as const).map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                setFilterStatus(status);
                                setShowFilterDropdown(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                                filterStatus === status
                                  ? 'bg-blue-50 text-blue-700 font-medium'
                                  : 'text-gray-700'
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {filteredChats.filter(c => isBriefingChat(c)).length} unread
                    </span>
                  </div>
                )}
              </div>

              {/* List Content */}
              <div className="flex-1 overflow-y-auto">
                {chatsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                  </div>
                ) : chatsError ? (
                  <div className="p-4 text-center text-red-600">
                    Error loading chats: {chatsError.message}
                  </div>
                ) : viewMode === 'chats' ? (
                  // Chats View
                  filteredChats.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No chats found</p>
                    </div>
                  ) : (
                    filteredChats.map((chat) => {
                      const urgent = isUrgent(chat.last_message_at, chat.status);
                      const isBriefing = isBriefingChat(chat);

                      return (
                        <ChatCard
                          key={chat.id}
                          id={chat.id}
                          customerName={chat.customer?.name || 'Unknown Customer'}
                          customerInitials={
                            chat.customer?.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('') || '?'
                          }
                          subject={chat.subject || 'No subject'}
                          lastMessage={chat.last_message || 'No messages yet'}
                          timestamp={formatTime(chat.last_message_at || chat.created_at)}
                          status={chat.status}
                          isUrgent={urgent}
                          isBriefing={isBriefing}
                          isSelected={selectedChatId === chat.id}
                          onClick={() => handleSelectChat(chat.id)}
                        />
                      );
                    })
                  )
                ) : (
                  // Customers View
                  filteredCustomers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No customers found</p>
                    </div>
                  ) : (
                    filteredCustomers.map((customer) => {
                      const openChats = customer.chats.filter((c) => c.status === 'open').length;
                      const lastChat = customer.chats.sort(
                        (a, b) => new Date(b.last_message_at || b.created_at).getTime() - new Date(a.last_message_at || a.created_at).getTime()
                      )[0];

                      return (
                        <CustomerCard
                          key={customer.customerId}
                          customerId={customer.customerId}
                          customerName={customer.customerName}
                          customerInitials={
                            customer.customerName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                          }
                          totalChats={customer.chats.length}
                          openChats={openChats}
                          lastActivity={formatTime(lastChat?.last_message_at || lastChat?.created_at)}
                          isSelected={selectedCustomerId === customer.customerId}
                          onClick={() => handleSelectCustomer(customer.customerId)}
                        />
                      );
                    })
                  )
                )}
              </div>
            </div>

            {/* Customer's Chats Panel (Only visible in customer view when customer selected) */}
            {viewMode === 'customers' && selectedCustomerId && (
              <div className="w-full lg:w-[320px] flex flex-col h-full min-h-0 border-r border-gray-200 bg-gray-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {customers.find(c => c.customerId === selectedCustomerId)?.customerName}'s Chats
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {selectedCustomerChats.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No chats found</p>
                    </div>
                  ) : (
                    selectedCustomerChats.map((chat) => {
                      const urgent = isUrgent(chat.last_message_at, chat.status);
                      const isBriefing = isBriefingChat(chat);

                      return (
                        <ChatCard
                          key={chat.id}
                          id={chat.id}
                          customerName={chat.customer?.name || 'Unknown Customer'}
                          customerInitials={
                            chat.customer?.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('') || '?'
                          }
                          subject={chat.subject || 'No subject'}
                          lastMessage={chat.last_message || 'No messages yet'}
                          timestamp={formatTime(chat.last_message_at || chat.created_at)}
                          status={chat.status}
                          isUrgent={urgent}
                          isBriefing={isBriefing}
                          isSelected={selectedChatId === chat.id}
                          onClick={() => handleSelectChat(chat.id)}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Chat Window */}
            <div className="w-full lg:flex-1 flex flex-row h-full min-h-0">
              <div className="flex-1 flex flex-col min-w-0">
              {selectedChat ? (
                <>
                  {/* Chat Header - Matching height with left column */}
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between h-[52px]">
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
                          <h2 className="text-sm font-medium text-gray-900">
                            {messages.length} conversation{messages.length !== 1 ? 's' : ''}
                          </h2>
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
                      <>
                        {/* AI Summary Section - Placeholder for future functionality */}
                        {isBriefingChat(selectedChat) && (
                          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 mb-4">
                            <div className="flex items-start gap-2 mb-2">
                              <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-semibold text-purple-900 mb-1">AI Summary</h4>
                                <p className="text-xs text-purple-800">
                                  New inquiry from {selectedChat.customer?.name || 'customer'}. Awaiting initial response.
                                </p>
                              </div>
                            </div>

                            {/* AI Suggestion Pills - Placeholder */}
                            <div className="mt-3">
                              <p className="text-xs font-medium text-purple-900 mb-2">Suggested Actions:</p>
                              <div className="flex flex-wrap gap-2">
                                <button className="px-3 py-1.5 bg-white border border-purple-300 rounded-full text-xs text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-colors">
                                  Acknowledge inquiry
                                </button>
                                <button className="px-3 py-1.5 bg-white border border-purple-300 rounded-full text-xs text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-colors">
                                  Request more details
                                </button>
                                <button className="px-3 py-1.5 bg-white border border-purple-300 rounded-full text-xs text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-colors">
                                  Escalate to supervisor
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {messages.map((message) => {
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
                        })}
                      </>
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

              {/* Customer Info Sidebar */}
              {selectedChat && showCustomerSidebar && (
                <div className="w-[360px] border-l border-gray-200">
                  <CustomerInfoSidebar
                    customerPersona={{
                      id: selectedChat.customer_id,
                      name: selectedChat.customer?.name || 'Unknown',
                      beeyloId: selectedChat.customer_id,
                      phone: '+1 (555) 123-4567',
                      location: 'Unknown',
                      joinDate: selectedChat.created_at,
                      totalOrders: 0,
                      totalSpent: 0,
                      loyaltyTier: 'Bronze',
                      preferredCategories: [],
                      lastActivity: formatTime(selectedChat.last_message_at),
                    }}
                    orderHistory={[]}
                    isVisible={showCustomerSidebar}
                  />
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
