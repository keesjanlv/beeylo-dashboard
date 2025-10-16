'use client';

import { useState } from 'react';
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
  sentiment?: 'angry' | 'neutral' | 'happy';
  aiSuggestions?: string[];
  messages: Message[];
}

export default function ChatsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'pending' | 'closed'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'chats' | 'customers'>('chats');
  const [showCustomerSidebar, setShowCustomerSidebar] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Initialize mock chats with 2 briefing cards and regular chats
  const [chats, setChats] = useState<Chat[]>([
    // Briefing Card 1 - Carlos Rodriguez (Urgent)
    {
      id: '1',
      customer: { name: 'Carlos Rodriguez', email: 'carlos@example.com' },
      subject: 'Defective Product Received - Business Order Deadline',
      status: 'open',
      last_message_at: new Date(Date.now() - 46 * 60000).toISOString(),
      isBriefing: true,
      sentiment: 'angry',
      briefingSummary: 'Bulk order of 50 jerseys has 15 items with wrong logo printed. Tournament deadline in 48 hours.',
      aiSuggestions: ['Offer expedited replacement', 'Process full refund', 'Provide 25% discount'],
      messages: [
        {
          id: 'm1',
          content: 'Bulk order of 50 jerseys has 15 items with wrong logo printed. Tournament deadline in 48 hours.',
          sender: { name: 'Carlos Rodriguez', role: 'customer' },
          created_at: new Date(Date.now() - 46 * 60000).toISOString(),
        }
      ],
    },
    // Briefing Card 2 - Jennifer Martinez (New Customer)
    {
      id: '2',
      customer: { name: 'Jennifer Martinez', email: 'jennifer@example.com' },
      subject: 'Wrong Item Shipped - Need Replacement Before Weekend',
      status: 'open',
      last_message_at: new Date(Date.now() - 120 * 60000).toISOString(),
      isBriefing: true,
      sentiment: 'neutral',
      briefingSummary: 'Ordered size M blue jacket, received size L red jacket instead. Needs correct item before weekend event.',
      aiSuggestions: ['Arrange immediate replacement', 'Offer free return shipping', 'Apply courtesy discount'],
      messages: [
        {
          id: 'm2_1',
          content: 'I ordered a size M blue jacket but received a size L red jacket instead. I need the correct item before this weekend for an event. Order #45789',
          sender: { name: 'Jennifer Martinez', role: 'customer' },
          created_at: new Date(Date.now() - 120 * 60000).toISOString(),
        }
      ],
    },
    // Regular Chat 1 - Carlos Rodriguez (Follow-up on old issue)
    {
      id: '3',
      customer: { name: 'Carlos Rodriguez', email: 'carlos2@example.com' },
      subject: 'Defective Product Received - Business Order Deadl...',
      status: 'open',
      last_message_at: new Date(Date.now() - 62 * 24 * 3600000).toISOString(),
      sentiment: 'angry',
      last_message: 'I just received my bulk order of 50 custom jerseys, f... product issue',
      aiSuggestions: ['Schedule follow-up call', 'Send replacement batch', 'Escalate to supervisor'],
      messages: [
        {
          id: 'm3a',
          content: 'I just received my bulk order of 50 custom jerseys, but there is a product issue.',
          sender: { name: 'Carlos Rodriguez', role: 'customer' },
          created_at: new Date(Date.now() - 62 * 24 * 3600000).toISOString(),
        },
        {
          id: 'm3b',
          content: 'I\'m sorry to hear about the issue. Let me help you with that right away.',
          sender: { name: 'Support Agent', role: 'agent' },
          created_at: new Date(Date.now() - 62 * 24 * 3600000 + 300000).toISOString(),
        }
      ],
    },
    // Regular Chat 2 - Emma Thompson (Expanded conversation)
    {
      id: '4',
      customer: { name: 'Emma Thompson', email: 'emma@example.com' },
      subject: 'Multiple Issues with Recent Order - Urgent Help Nee...',
      status: 'open',
      last_message_at: new Date(Date.now() - 457 * 24 * 3600000 + 1800000).toISOString(),
      sentiment: 'angry',
      last_message: 'Thank you, I really appreciate your help on this',
      aiSuggestions: ['Provide tracking update', 'Issue partial refund', 'Send apology gift'],
      messages: [
        {
          id: 'm4a',
          content: 'Hi there, I\'m writing because I\'m extremely frustrated with multiple issues on my recent order #34521. First, the delivery was 5 days late despite paying for express shipping. Second, when it finally arrived, 2 out of 5 items were damaged with torn packaging. Third, one item was completely missing from the box. I\'ve been a loyal customer for 3 years and have never experienced such poor service. This order was for my daughter\'s birthday party which has already passed. I need this resolved immediately.',
          sender: { name: 'Emma Thompson', role: 'customer' },
          created_at: new Date(Date.now() - 457 * 24 * 3600000).toISOString(),
        },
        {
          id: 'm4b',
          content: 'Emma, I sincerely apologize for this terrible experience. You\'re absolutely right to be upset. Let me address each issue: I\'m processing a full refund for your express shipping right now. For the damaged items, I\'ll send replacements via overnight shipping at no cost. For the missing item, I\'m also shipping that overnight. Additionally, I\'d like to offer you a $50 credit and 20% off your next order as an apology. Would this help make things right?',
          sender: { name: 'Support Agent', role: 'agent' },
          created_at: new Date(Date.now() - 457 * 24 * 3600000 + 600000).toISOString(),
        },
        {
          id: 'm4c',
          content: 'Thank you for the quick response and for taking this seriously. Yes, that would be very helpful. Can you confirm the tracking numbers for the overnight shipments?',
          sender: { name: 'Emma Thompson', role: 'customer' },
          created_at: new Date(Date.now() - 457 * 24 * 3600000 + 1200000).toISOString(),
        },
        {
          id: 'm4d',
          content: 'Absolutely! I\'ve sent the tracking numbers to your email. The packages should arrive tomorrow by 3 PM. Your $50 credit has been applied to your account, and I\'ve added a note for the 20% discount on your next purchase. Is there anything else I can help you with?',
          sender: { name: 'Support Agent', role: 'agent' },
          created_at: new Date(Date.now() - 457 * 24 * 3600000 + 1500000).toISOString(),
        },
        {
          id: 'm4e',
          content: 'Thank you, I really appreciate your help on this',
          sender: { name: 'Emma Thompson', role: 'customer' },
          created_at: new Date(Date.now() - 457 * 24 * 3600000 + 1800000).toISOString(),
        }
      ],
    },
    // Regular Chat 3 - Maria Santos (Expanded conversation)
    {
      id: '5',
      customer: { name: 'Maria Santos', email: 'maria@example.com' },
      subject: 'Tent Return - Wrong Size',
      status: 'pending',
      last_message_at: new Date(Date.now() - 458 * 24 * 3600000 + 1200000).toISOString(),
      sentiment: 'neutral',
      last_message: 'Perfect, I\'ll get that tent returned today then!',
      aiSuggestions: ['Send return label', 'Process exchange', 'Waive restocking fee'],
      messages: [
        {
          id: 'm5a',
          content: 'I need to return this 4-person tent and get a 6-person tent instead. We just realized we need more space for our camping trip next month.',
          sender: { name: 'Maria Santos', role: 'customer' },
          created_at: new Date(Date.now() - 458 * 24 * 3600000).toISOString(),
        },
        {
          id: 'm5b',
          content: 'Hi Maria! I\'d be happy to help you exchange that. Can you provide your order number so I can process the return and send you a prepaid shipping label?',
          sender: { name: 'Support Agent', role: 'agent' },
          created_at: new Date(Date.now() - 458 * 24 * 3600000 + 300000).toISOString(),
        },
        {
          id: 'm5c',
          content: 'Sure! The order number is #67234. Will there be any restocking fees?',
          sender: { name: 'Maria Santos', role: 'customer' },
          created_at: new Date(Date.now() - 458 * 24 * 3600000 + 600000).toISOString(),
        },
        {
          id: 'm5d',
          content: 'Great! Since this is an exchange and the tent is in new condition, I\'ll waive the restocking fee. I\'ve emailed you the return label. Once we receive the 4-person tent, we\'ll ship out the 6-person tent at no additional cost. The new tent is actually on sale right now, so you\'ll receive a $30 credit too!',
          sender: { name: 'Support Agent', role: 'agent' },
          created_at: new Date(Date.now() - 458 * 24 * 3600000 + 900000).toISOString(),
        },
        {
          id: 'm5e',
          content: 'Perfect, I\'ll get that tent returned today then!',
          sender: { name: 'Maria Santos', role: 'customer' },
          created_at: new Date(Date.now() - 458 * 24 * 3600000 + 1200000).toISOString(),
        }
      ],
    },
    // Regular Chat 4 - Linda Garcia (Expanded conversation)
    {
      id: '6',
      customer: { name: 'Linda Garcia', email: 'linda@example.com' },
      subject: 'Fitness Tracker Sync Issues',
      status: 'closed',
      last_message_at: new Date(Date.now() - 458 * 24 * 3600000 + 1600000).toISOString(),
      sentiment: 'happy',
      last_message: 'It works! Thank you so much for your patience!',
      aiSuggestions: [],
      messages: [
        {
          id: 'm6a',
          content: 'The device won\'t sync with my phone app. I\'ve tried restarting both the tracker and my phone multiple times.',
          sender: { name: 'Linda Garcia', role: 'customer' },
          created_at: new Date(Date.now() - 458 * 24 * 3600000).toISOString(),
        },
        {
          id: 'm6b',
          content: 'Hi Linda! I can help troubleshoot this. Which phone model are you using, and have you checked if Bluetooth is enabled?',
          sender: { name: 'Support Agent', role: 'agent' },
          created_at: new Date(Date.now() - 458 * 24 * 3600000 + 300000).toISOString(),
        },
        {
          id: 'm6c',
          content: 'I have an iPhone 13 and yes, Bluetooth is on. I can see other devices but not the fitness tracker.',
          sender: { name: 'Linda Garcia', role: 'customer' },
          created_at: new Date(Date.now() - 458 * 24 * 3600000 + 600000).toISOString(),
        },
        {
          id: 'm6d',
          content: 'Thanks for that info. Let\'s try this: 1) Delete the app and reinstall it, 2) Make sure location permissions are enabled for the app, 3) In the tracker settings, do a factory reset (hold button for 10 seconds). Then try pairing again. Let me know if this works!',
          sender: { name: 'Support Agent', role: 'agent' },
          created_at: new Date(Date.now() - 458 * 24 * 3600000 + 900000).toISOString(),
        },
        {
          id: 'm6e',
          content: 'It works! Thank you so much for your patience!',
          sender: { name: 'Linda Garcia', role: 'customer' },
          created_at: new Date(Date.now() - 458 * 24 * 3600000 + 1500000).toISOString(),
        },
        {
          id: 'm6f',
          content: 'Wonderful! I\'m so glad we got it working. Enjoy your fitness tracker! Feel free to reach out if you need anything else.',
          sender: { name: 'Support Agent', role: 'agent' },
          created_at: new Date(Date.now() - 458 * 24 * 3600000 + 1600000).toISOString(),
        }
      ],
    },
  ]);

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || chat.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Group chats by customer for customer view
  const customerGroups = chats.reduce((acc, chat) => {
    const customerId = chat.customer.email; // Using email as ID for mock data
    if (!acc[customerId]) {
      acc[customerId] = {
        customerId,
        customerName: chat.customer.name,
        chats: [],
      };
    }
    acc[customerId].chats.push(chat);
    return acc;
  }, {} as Record<string, { customerId: string; customerName: string; chats: Chat[] }>);

  const customers = Object.values(customerGroups);
  const filteredCustomers = customers.filter((customer) => {
    return customer.customerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedCustomerChats = selectedCustomerId
    ? chats.filter((chat) => chat.customer.email === selectedCustomerId)
    : [];

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
    setShowCustomerSidebar(true);
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setSelectedChatId(null);
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
    setShowCustomerSidebar(false);
    if (viewMode === 'customers') {
      setSelectedCustomerId(null);
    }
  };

  const updateChatStatus = (chatId: string, newStatus: 'open' | 'pending' | 'closed') => {
    setChats(prevChats => prevChats.map(chat =>
      chat.id === chatId ? { ...chat, status: newStatus } : chat
    ));
  };

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
                      {filteredChats.filter(c => c.isBriefing).length} unread
                    </span>
                  </div>
                )}
              </div>

              {/* List Content */}
              <div className="flex-1 overflow-y-auto">
                {viewMode === 'chats' ? (
                  // Chats View
                  filteredChats.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No chats found</p>
                    </div>
                  ) : (
                    filteredChats.map((chat) => {
                      const urgent = isUrgent(chat.last_message_at, chat.status);
                      return (
                        <ChatCard
                          key={chat.id}
                          id={chat.id}
                          customerName={chat.customer.name}
                          customerInitials={
                            chat.customer.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                          }
                          subject={chat.subject}
                          lastMessage={chat.briefingSummary || chat.last_message || 'No messages yet'}
                          timestamp={formatTime(chat.last_message_at)}
                          status={chat.status}
                          isUrgent={urgent}
                          isBriefing={chat.isBriefing}
                          sentiment={chat.sentiment}
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
                      const latestChat = customer.chats.reduce((latest, chat) =>
                        new Date(chat.last_message_at) > new Date(latest.last_message_at)
                          ? chat
                          : latest
                      );

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
                          lastActivity={formatTime(latestChat.last_message_at)}
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
                      return (
                        <ChatCard
                          key={chat.id}
                          id={chat.id}
                          customerName={chat.customer.name}
                          customerInitials={
                            chat.customer.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                          }
                          subject={chat.subject}
                          lastMessage={chat.briefingSummary || chat.last_message || 'No messages yet'}
                          timestamp={formatTime(chat.last_message_at)}
                          status={chat.status}
                          isUrgent={urgent}
                          isBriefing={false}
                          sentiment={chat.sentiment}
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
                              {selectedChat.customer.name}
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
                        <>
                          {/* AI Summary Section */}
                          {selectedChat.isBriefing && selectedChat.briefingSummary && (
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 mb-4">
                              <div className="flex items-start gap-2 mb-2">
                                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-xs font-semibold text-purple-900 mb-1">AI Summary</h4>
                                  <p className="text-xs text-purple-800">{selectedChat.briefingSummary}</p>
                                </div>
                              </div>

                              {/* AI Suggestion Pills */}
                              {selectedChat.aiSuggestions && selectedChat.aiSuggestions.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-xs font-medium text-purple-900 mb-2">Suggested Actions:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedChat.aiSuggestions.map((suggestion, index) => (
                                      <button
                                        key={index}
                                        className="px-3 py-1.5 bg-white border border-purple-300 rounded-full text-xs text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-colors"
                                      >
                                        {suggestion}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {selectedChat.messages.map((message) => {
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
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Info Sidebar */}
              {selectedChat && showCustomerSidebar && (
                <div className="w-[360px] border-l border-gray-200">
                  <CustomerInfoSidebar
                    customerPersona={{
                      id: selectedChat.id,
                      name: selectedChat.customer.name,
                      beeyloId: selectedChat.customer.email,
                      phone: '+1 (555) 123-4567',
                      location: 'Unknown',
                      joinDate: selectedChat.last_message_at,
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
