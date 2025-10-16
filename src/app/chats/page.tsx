'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FullscreenWrapper from '../../components/layout/FullscreenWrapper';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

// Mock data types
interface Customer {
  name: string;
  email: string;
}

interface Message {
  id: string;
  content: string;
  sender: {
    name: string;
    role: 'customer' | 'agent';
  };
  created_at: string;
}

interface Chat {
  id: string;
  customer: Customer;
  subject: string;
  status: 'open' | 'pending' | 'closed';
  last_message_at: string;
  last_message?: string;
  isBriefing?: boolean;
  briefingSummary?: string;
  messages: Message[];
}

export default function ChatsPage() {
  const router = useRouter();
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'pending' | 'closed'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Initialize mock chats with 2 briefing cards and regular chats
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      customer: { name: 'Sarah Johnson', email: 'sarah@example.com' },
      subject: 'Product inquiry about pricing',
      status: 'open',
      last_message_at: new Date(Date.now() - 30 * 60000).toISOString(),
      isBriefing: true,
      briefingSummary: 'Customer is inquiring about bulk pricing options for enterprise plans and wants to know if there are any discounts available.',
      messages: [
        {
          id: 'm1',
          content: 'Hi, I\'m interested in your enterprise plans. Can you provide information about bulk pricing and any available discounts for long-term contracts?',
          sender: { name: 'Sarah Johnson', role: 'customer' },
          created_at: new Date(Date.now() - 30 * 60000).toISOString(),
        }
      ],
    },
    {
      id: '2',
      customer: { name: 'Michael Chen', email: 'michael@example.com' },
      subject: 'Technical support needed',
      status: 'open',
      last_message_at: new Date(Date.now() - 45 * 60000).toISOString(),
      isBriefing: true,
      briefingSummary: 'Customer is experiencing integration issues with the API and needs guidance on proper authentication setup.',
      messages: [
        {
          id: 'm2',
          content: 'Hello, I\'m having trouble integrating your API with our system. The authentication keeps failing even though I\'m using the correct credentials. Can someone help me troubleshoot this?',
          sender: { name: 'Michael Chen', role: 'customer' },
          created_at: new Date(Date.now() - 45 * 60000).toISOString(),
        }
      ],
    },
    {
      id: '3',
      customer: { name: 'Emma Wilson', email: 'emma@example.com' },
      subject: 'Account upgrade question',
      status: 'pending',
      last_message_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      last_message: 'Thank you! I\'ll review those options.',
      messages: [
        {
          id: 'm3a',
          content: 'I\'d like to upgrade my account to access more features.',
          sender: { name: 'Emma Wilson', role: 'customer' },
          created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
        },
        {
          id: 'm3b',
          content: 'Great! We have several upgrade options available. Let me share the details with you.',
          sender: { name: 'Support Agent', role: 'agent' },
          created_at: new Date(Date.now() - 2.5 * 3600000).toISOString(),
        },
        {
          id: 'm3c',
          content: 'Thank you! I\'ll review those options.',
          sender: { name: 'Emma Wilson', role: 'customer' },
          created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
        }
      ],
    },
    {
      id: '4',
      customer: { name: 'David Brown', email: 'david@example.com' },
      subject: 'Billing inquiry',
      status: 'closed',
      last_message_at: new Date(Date.now() - 48 * 3600000).toISOString(),
      last_message: 'Perfect, that resolves my issue. Thanks!',
      messages: [
        {
          id: 'm4a',
          content: 'I noticed an unexpected charge on my invoice.',
          sender: { name: 'David Brown', role: 'customer' },
          created_at: new Date(Date.now() - 50 * 3600000).toISOString(),
        },
        {
          id: 'm4b',
          content: 'Let me look into that for you right away.',
          sender: { name: 'Support Agent', role: 'agent' },
          created_at: new Date(Date.now() - 49 * 3600000).toISOString(),
        },
        {
          id: 'm4c',
          content: 'Perfect, that resolves my issue. Thanks!',
          sender: { name: 'David Brown', role: 'customer' },
          created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
        }
      ],
    },
  ]);

  // Handle triple click to navigate to supabase version
  const handlePageClick = () => {
    clickCountRef.current += 1;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (clickCountRef.current === 3) {
      // Triple click detected
      router.push('/chats-supabase');
      clickCountRef.current = 0;
    } else {
      // Reset counter after 500ms
      clickTimeoutRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 500);
    }
  };

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || chat.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
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

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isUrgent = (lastMessageAt: string, status: string) => {
    if (status === 'closed') return false;
    const date = new Date(lastMessageAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffInHours < 2 && (status === 'open' || status === 'pending');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChatId) return;

    const currentChat = chats.find(c => c.id === selectedChatId);
    if (!currentChat) return;

    // Create new message
    const newMsg: Message = {
      id: `m${Date.now()}`,
      content: newMessage.trim(),
      sender: { name: 'Support Agent', role: 'agent' },
      created_at: new Date().toISOString(),
    };

    // Update chats
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === selectedChatId) {
        const updatedChat = {
          ...chat,
          messages: [...chat.messages, newMsg],
          last_message: newMessage.trim(),
          last_message_at: new Date().toISOString(),
          // Remove briefing status when replying
          isBriefing: false,
          briefingSummary: undefined,
        };
        return updatedChat;
      }
      return chat;
    }));

    setNewMessage('');
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

  const updateChatStatus = (chatId: string, newStatus: 'open' | 'pending' | 'closed') => {
    setChats(prevChats => prevChats.map(chat =>
      chat.id === chatId ? { ...chat, status: newStatus } : chat
    ));
  };

  return (
    <FullscreenWrapper>
      <div
        className="flex flex-col bg-gray-50 !p-0 !m-0 !max-w-none h-full w-full"
        onClick={handlePageClick}
      >
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          <div className="flex flex-col lg:flex-row flex-1 bg-white overflow-hidden">
            {/* Chat List */}
            <div className="w-full lg:w-[420px] flex flex-col h-full min-h-0 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
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

                {/* Status Filter Dropdown - Full Width */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-between shadow-sm"
                  >
                    <span>{filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</span>
                    <ChevronDownIcon className="h-4 w-4 ml-2" />
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                      {(['all', 'open', 'pending', 'closed'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setFilterStatus(status);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
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
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No chats found</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => {
                    const urgent = isUrgent(chat.last_message_at, chat.status);

                    // Render briefing card differently
                    if (chat.isBriefing) {
                      return (
                        <div
                          key={chat.id}
                          onClick={() => handleSelectChat(chat.id)}
                          className={`p-5 border-b border-gray-100 cursor-pointer hover:bg-amber-50 transition-all ${
                            selectedChatId === chat.id
                              ? 'bg-amber-50 border-l-4 border-l-amber-500'
                              : 'bg-amber-25'
                          }`}
                          style={selectedChatId !== chat.id ? { backgroundColor: '#FFFBEB' } : {}}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium text-amber-800">
                                {chat.customer.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                  {chat.customer.name}
                                </h3>
                                <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: '#FBBF16', color: '#78350f' }}>
                                  NEW
                                </span>
                              </div>
                              <p className="text-xs font-medium text-gray-700 truncate mb-2">
                                {chat.subject}
                              </p>
                              <div className="bg-white rounded-lg p-3 border border-amber-200">
                                <p className="text-xs font-medium text-amber-900 mb-1">Briefing:</p>
                                <p className="text-xs text-gray-700 line-clamp-2">
                                  {chat.briefingSummary}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {formatTime(chat.last_message_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Regular chat rendering
                    return (
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
                              {chat.customer.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {chat.customer.name}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatTime(chat.last_message_at)}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-gray-600 truncate mt-1">
                              {chat.subject}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {chat.last_message || 'No messages yet'}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              {urgent && (
                                <div className="flex flex-col">
                                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 font-semibold uppercase">
                                    Urgent
                                  </span>
                                  <span className="text-xs text-gray-500 mt-1">
                                    {formatDate(chat.last_message_at)}
                                  </span>
                                </div>
                              )}
                              {!urgent && (
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                    chat.status
                                  )}`}
                                >
                                  {chat.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="w-full lg:flex-1 flex flex-col h-full min-h-0">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
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
                            {selectedChat.customer.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-sm font-medium text-gray-900">
                            {selectedChat.messages.length} conversation{selectedChat.messages.length !== 1 ? 's' : ''}
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
                    {selectedChat.messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <p>No messages yet</p>
                        <p className="text-sm mt-2">
                          Start the conversation with {selectedChat.customer.name}
                        </p>
                      </div>
                    ) : (
                      selectedChat.messages.map((message) => {
                        const isAgent = message.sender.role === 'agent';

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
                                  {message.sender.name}
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
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                        Send
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
                    <p className="text-xs text-gray-400 mt-4">
                      Tip: Triple-click anywhere to view Supabase version
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
