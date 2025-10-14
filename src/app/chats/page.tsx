'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FullscreenWrapper from '../../components/layout/FullscreenWrapper';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  UserPlusIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShoppingBagIcon,
  TruckIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  TicketIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import EditableBanner from '../../components/EditableBanner';
import CustomerInfoSidebar from '../../components/CustomerInfoSidebar';
import { useSidebar } from '../../contexts/SidebarContext';


// Import mock data
import conversationsData from '../../../data/conversations.json';
import messagesData from '../../../data/messages.json';
import companiesData from '../../../data/companies.json';

interface UpsellOpportunity {
  type: string;
  trigger: string;
  suggestion: string;
  confidence: 'low' | 'medium' | 'high';
}

interface AIBriefing {
  summary: string;
  calculatedActions: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedResolutionTime: string;
  customerValue: 'low' | 'medium' | 'high';
}

interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  beeyloId: string;
  companyId: string;
  assignedTo: string | null;
  status: 'active' | 'resolved' | 'pending' | 'escalated' | 'new';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  subject: string;
  lastMessage: string;
  lastMessageTime: string;
  createdAt: string;
  tags: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'frustrated' | 'satisfied';
  aiSuggestions: string[];
  upsellOpportunities?: UpsellOpportunity[];
  isUnseen?: boolean;
  aiBriefing?: AIBriefing;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'customer' | 'agent' | 'system';
  content: string;
  timestamp: string;
  attachments?: Array<{
    name: string;
    type: string;
    url?: string;
  }>;
}

function ChatsPageContent() {
  const { position } = useSidebar();
  const [conversations] = useState<Conversation[]>(conversationsData as Conversation[]);
  const [messages] = useState<Message[]>(messagesData as Message[]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');
  const [showAIBuddy, setShowAIBuddy] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'chat'>('list');
  const [layoutMode, setLayoutMode] = useState<'conversations' | 'customers'>('conversations');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('0m 0s');
  const searchParams = useSearchParams();



  // Mock customer persona data
  const customerPersona = selectedConversation ? {
    id: selectedConversation.customerId,
    name: selectedConversation.customerName,
    beeyloId: selectedConversation.beeyloId,
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: '2021-03-15',
    totalOrders: 24,
    totalSpent: 2847.50,
    loyaltyTier: 'Gold',
    preferredCategories: ['Running Gear', 'Outdoor Equipment'],
    lastActivity: '2024-01-15T10:30:00Z'
  } : null;

  // Mock order history data
  const orderHistory = selectedConversation ? [
    {
      id: 'ORD-2024-001',
      date: '2024-01-10',
      status: 'delivered',
      total: 156.99,
      items: ['Running Shoes', 'Athletic Shorts'],
      isRelevant: true,
      aiNote: 'Customer is asking about this order - wrong size received'
    },
    {
      id: 'ORD-2023-089',
      date: '2023-12-22',
      status: 'delivered',
      total: 89.50,
      items: ['Water Bottle', 'Protein Bars'],
      isRelevant: false,
      aiNote: null
    },
    {
      id: 'ORD-2023-067',
      date: '2023-11-15',
      status: 'delivered',
      total: 234.75,
      items: ['Winter Jacket', 'Thermal Leggings'],
      isRelevant: false,
      aiNote: null
    },
    {
      id: 'ORD-2023-045',
      date: '2023-10-08',
      status: 'returned',
      total: 127.25,
      items: ['Hiking Boots'],
      isRelevant: false,
      aiNote: null
    }
  ] : [];

  // Category options for filtering
  const categories = [
    { value: 'all', label: 'All', count: conversations.length },
    { value: 'resolve_now', label: 'Resolve Now', count: conversations.filter(c => c.priority === 'urgent' || c.priority === 'high').length },
    { value: 'retention', label: 'Retention', count: conversations.filter(c => c.category === 'retention' || c.sentiment === 'frustrated' || c.sentiment === 'negative').length },
    { value: 'upsell', label: 'Upsell', count: conversations.filter(c => c.upsellOpportunities && c.upsellOpportunities.length > 0).length },
    { value: 'proactive_updates', label: 'Proactive Updates', count: conversations.filter(c => c.category === 'shipping' || c.status === 'pending').length },
    { value: 'product_issue', label: 'Product Issues', count: conversations.filter(c => c.category === 'product_issue').length },
    { value: 'product_inquiry', label: 'Product Inquiries', count: conversations.filter(c => c.category === 'product_inquiry').length },
    { value: 'shipping', label: 'Shipping', count: conversations.filter(c => c.category === 'shipping').length },
    { value: 'return_refund', label: 'Returns & Refunds', count: conversations.filter(c => c.category === 'return_refund').length },
    { value: 'technical_support', label: 'Technical Support', count: conversations.filter(c => c.category === 'technical_support').length },
    { value: 'bulk_order', label: 'Bulk Orders', count: conversations.filter(c => c.category === 'bulk_order').length }
  ];

  // Get unique customers with their conversation count
  const getUniqueCustomers = () => {
    const customerMap = new Map();
    conversations.forEach(conv => {
      if (!customerMap.has(conv.customerId)) {
        customerMap.set(conv.customerId, {
          id: conv.customerId,
          name: conv.customerName,
          beeyloId: conv.beeyloId,
          conversationCount: 0,
          lastMessageTime: conv.lastMessageTime,
          sentiment: conv.sentiment,
          hasUrgent: false
        });
      }
      const customer = customerMap.get(conv.customerId);
      customer.conversationCount++;
      if (conv.priority === 'urgent') customer.hasUrgent = true;
      // Update to most recent message time
      if (new Date(conv.lastMessageTime) > new Date(customer.lastMessageTime)) {
        customer.lastMessageTime = conv.lastMessageTime;
        customer.sentiment = conv.sentiment;
      }
    });
    return Array.from(customerMap.values()).sort((a, b) =>
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
  };

  // Get conversations for a specific customer
  const getCustomerConversations = (customerId: string) => {
    return conversations
      .filter(conv => conv.customerId === customerId)
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus;
    const matchesPriority = priorityFilter === '' || conv.priority === priorityFilter;
    
    let matchesCategory = true;
    if (categoryFilter !== 'all') {
      switch (categoryFilter) {
        case 'resolve_now':
          matchesCategory = conv.priority === 'urgent' || conv.priority === 'high';
          break;
        case 'retention':
          matchesCategory = conv.category === 'retention' || conv.sentiment === 'frustrated' || conv.sentiment === 'negative';
          break;
        case 'upsell':
          matchesCategory = conv.upsellOpportunities && conv.upsellOpportunities.length > 0;
          break;
        case 'proactive_updates':
          matchesCategory = conv.category === 'shipping' || conv.status === 'pending';
          break;
        default:
          matchesCategory = conv.category === categoryFilter;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  }).sort((a, b) => {
    // Priority order: urgent > high > medium > low
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
    
    // First sort by priority (urgent first)
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // Then sort by status (new and active first, resolved last)
    const statusOrder = { new: 4, active: 3, pending: 2, escalated: 2, resolved: 1 };
    const aStatus = statusOrder[a.status as keyof typeof statusOrder] || 0;
    const bStatus = statusOrder[b.status as keyof typeof statusOrder] || 0;
    
    if (aStatus !== bStatus) {
      return bStatus - aStatus;
    }
    
    // Finally sort by most recent timestamp
    const aTime = new Date(a.lastMessageTime || a.createdAt).getTime();
    const bTime = new Date(b.lastMessageTime || b.createdAt).getTime();
    return bTime - aTime;
  });

  const conversationMessages = selectedConversation 
    ? messages.filter(msg => msg.conversationId === selectedConversation.id)
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-info';
      case 'pending': return 'status-warning';
      case 'resolved': return 'status-success';
      case 'escalated': return 'status-danger';
      default: return 'status-info';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'high': return <ExclamationTriangleIcon className="h-4 w-4 text-gray-500" />;
      case 'medium': return <ClockIcon className="h-4 w-4 text-gray-500" />;
      default: return <CheckCircleIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return 'Unknown';

    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return minutes <= 0 ? 'Just now' : `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // Less than a week
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      // Use consistent date format to avoid hydration mismatch
      return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  // Get sentiment icon and color
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'frustrated':
      case 'negative':
        return {
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
              <line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" />
              <line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" />
            </svg>
          ),
          color: 'text-red-500'
        };
      case 'neutral':
      case 'curious':
        return {
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="15" x2="16" y2="15" />
              <line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" />
              <line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" />
            </svg>
          ),
          color: 'text-gray-500'
        };
      case 'positive':
      case 'satisfied':
      case 'excited':
        return {
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" />
              <line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" />
            </svg>
          ),
          color: 'text-green-500'
        };
      default:
        return {
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="15" x2="16" y2="15" />
              <line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" />
              <line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" />
            </svg>
          ),
          color: 'text-gray-500'
        };
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setSelectedCustomerId(conversation.customerId);
    setViewMode('chat');
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const customerConvs = getCustomerConversations(customerId);
    if (customerConvs.length > 0) {
      setSelectedConversation(customerConvs[0]);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedConversation(null);
  };

  // Get customer avatar color based on sentiment
  const getAvatarColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-700';
      case 'satisfied': return 'bg-blue-100 text-blue-700';
      case 'neutral': return 'bg-gray-100 text-gray-700';
      case 'negative': return 'bg-red-100 text-red-700';
      case 'frustrated': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Open last ticket if resume=last is present in query params
  useEffect(() => {
    const resume = searchParams.get('resume');
    if (resume === 'last' && !selectedConversation && filteredConversations.length > 0) {
      setSelectedConversation(filteredConversations[0]);
      setViewMode('chat');
    }
  }, [searchParams, filteredConversations, selectedConversation]);

  // Auto-select first customer when switching to customer view
  useEffect(() => {
    if (layoutMode === 'customers' && !selectedCustomerId) {
      const customers = getUniqueCustomers();
      if (customers.length > 0) {
        handleSelectCustomer(customers[0].id);
      }
    }
  }, [layoutMode]);

  // Real-time timer for unseen urgent tickets
  useEffect(() => {
    const unseenConv = conversations.find(c => c.isUnseen);
    if (!unseenConv) return;

    const updateTimer = () => {
      const now = new Date();
      const created = new Date(unseenConv.lastMessageTime);
      const diffMs = now.getTime() - created.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      setElapsedTime(`${diffMins}m ${diffSecs}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [conversations]);

  // Get unseen urgent conversation
  const unseenUrgentConv = conversations.find(c => c.isUnseen && c.status === 'new');

  return (
    <FullscreenWrapper>
    <div className="flex flex-col bg-gray-50 !p-0 !m-0 !max-w-none h-full w-full">
      {/* Editable Banner */}
      <div className="flex-shrink-0 bg-white shadow-sm border-b border-gray-200 hidden personal-reminders-banner">
        <EditableBanner 
          storageKey="chats-banner-lines"
          defaultLines={[
            "Remember to be empathetic and professional in all customer interactions",
            "Check customer history before responding to provide personalized support"
          ]}
          className="mx-6 py-4"
        />
      </div>

      {/* Chat Content */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Full Screen Chat Container */}
        <div className="flex flex-col lg:flex-row flex-1 bg-white overflow-hidden">
          {/* Customer/Chat List Section */}
          {layoutMode === 'customers' ? (
            // Customer List (Left Panel in Customer View)
            <div className="w-full lg:w-80 flex flex-col h-full min-h-0 border-r border-gray-200">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-lg font-semibold text-gray-900">Customers</h1>

                  <div className="flex items-center gap-2">
                    {/* Layout Mode Switch */}
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                      <button
                        onClick={() => setLayoutMode('conversations')}
                        className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                          layoutMode === 'conversations'
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                        title="Conversation View"
                      >
                        <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-1" />
                        Chats
                      </button>
                      <button
                        onClick={() => setLayoutMode('customers')}
                        className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                          layoutMode === 'customers'
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                        title="Customer View"
                      >
                        <UserIcon className="h-4 w-4 inline mr-1" />
                        Customers
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                </div>
              </div>

              {/* Customer List */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                {getUniqueCustomers()
                  .filter(customer =>
                    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customer.beeyloId.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-all duration-200 ${
                        selectedCustomerId === customer.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(customer.sentiment)}`}>
                          <span className="text-sm font-medium">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate flex items-center gap-2">
                              {customer.name}
                              {customer.hasUrgent && (
                                <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-red-100 text-red-800">
                                  !
                                </span>
                              )}
                            </h3>
                            <span className="text-xs text-gray-500">{formatTime(customer.lastMessageTime)}</span>
                          </div>
                          <p className="text-xs text-blue-600 truncate">{customer.beeyloId}</p>
                          <p className="text-xs text-gray-400 mt-1">{customer.conversationCount} conversation{customer.conversationCount !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            // Conversation List (Original)
            <div className="w-full lg:w-[420px] flex flex-col h-full min-h-0 border-r border-gray-200">
        {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900">Customer Chats</h1>

            {/* Layout Mode Switch */}
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setLayoutMode('conversations')}
                className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                  layoutMode === 'conversations'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Conversation View"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-1" />
                Chats
              </button>
              <button
                onClick={() => setLayoutMode('customers')}
                className={`px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                  layoutMode === 'customers'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Customer View"
              >
                <UserIcon className="h-4 w-4 inline mr-1" />
                Customers
              </button>
            </div>
          </div>
          
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

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 5).map((category) => (
              <button
                key={category.value}
                onClick={() => setCategoryFilter(category.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  categoryFilter === category.value
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
                <span className="ml-2 text-xs opacity-75">
                  ({category.count})
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          {/* Urgent Briefing Card for Unseen Tickets */}
          {unseenUrgentConv && unseenUrgentConv.aiBriefing && (
            <div className="m-4 p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100"
              onClick={() => handleSelectConversation(unseenUrgentConv)}>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 text-xs font-bold rounded bg-red-100 text-red-800 uppercase">
                  Urgent
                </span>
                <span className="text-xs text-gray-500 font-mono">{elapsedTime}</span>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">
                    {unseenUrgentConv.customerName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{unseenUrgentConv.customerName}</h3>
                  <span className="text-xs text-gray-500 capitalize">{unseenUrgentConv.sentiment}</span>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-2">
                <h4 className="text-xs font-medium text-gray-900">{unseenUrgentConv.subject}</h4>
              </div>

              {/* AI Summary */}
              <div className="mb-3">
                <p className="text-xs text-gray-600 leading-relaxed">{unseenUrgentConv.aiBriefing.summary}</p>
              </div>

              {/* Calculated Actions */}
              <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                <p className="text-xs font-semibold text-gray-900 mb-1">Actions:</p>
                <ol className="space-y-0.5">
                  {unseenUrgentConv.aiBriefing.calculatedActions.map((action, idx) => (
                    <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                      <span className="font-semibold text-gray-900 flex-shrink-0">{idx + 1}.</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {filteredConversations.map((conversation, idx) => {
                const isUrgent = conversation.priority === 'urgent';
                const isUnread = idx < 3 && conversation.status !== 'resolved';
                return (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`p-5 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-all duration-200 ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {conversation.customerName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className={`text-xs ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-900'} truncate`}>
                              {conversation.customerName}
                            </h3>
                            {/* Sentiment Icon */}
                            <span className={getSentimentIcon(conversation.sentiment).color}>
                              {getSentimentIcon(conversation.sentiment).icon}
                            </span>
                            {isUrgent && (
                              <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                                URGENT
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{formatTime(conversation.lastMessageTime)}</span>
                        </div>
                        <p className={`text-xs ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'} truncate mt-1`}>
                          {conversation.subject}
                        </p>
                        <p className={`text-xs ${isUnread ? 'font-semibold text-gray-800' : 'text-gray-500'} truncate mt-1`}>
                          {conversation.lastMessage}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                           <span className="text-xs text-gray-500">
                             {conversation.category.replace(/_/g, ' ')}
                           </span>
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
          )}

          {/* Conversation History Panel (only in customer view) */}
          {layoutMode === 'customers' && selectedCustomerId && (
            <div className="w-full lg:w-80 flex flex-col h-full min-h-0 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-900">Conversation History</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {getCustomerConversations(selectedCustomerId).length} conversation{getCustomerConversations(selectedCustomerId).length !== 1 ? 's' : ''}
                </p>
                {/* Search Bar for Conversation History */}
                <div className="relative mt-3">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                {getCustomerConversations(selectedCustomerId)
                  .filter(conv =>
                    conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    conv.category.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-all duration-200 ${
                      selectedConversation?.id === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-gray-900">{conv.subject}</h3>
                        {conv.priority === 'urgent' && (
                          <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-red-100 text-red-800">
                            URGENT
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{formatTime(conv.lastMessageTime)}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{conv.lastMessage}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(conv.status)}`}>
                        {conv.status}
                      </span>
                      <span className="text-xs text-gray-500">{conv.category.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Window Section */}
          <div className="w-full lg:flex-1 flex flex-col h-full min-h-0">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
          <div className="bg-gray-50 p-4 md:p-5 lg:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {selectedConversation?.customerName?.split(' ').map(n => n[0]).join('') || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{selectedConversation?.customerName || 'Unknown'}</h2>
                    <p className="text-sm text-gray-500">{selectedConversation?.subject || 'No subject'}</p>
                  </div>
                </div>
                {selectedConversation?.priority === 'urgent' && (
                  <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                    URGENT
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-5 lg:p-6 space-y-4 md:space-y-5 lg:space-y-6 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
              {conversationMessages.length > 0 ? (
                conversationMessages.map((message) => {
                  // Check if message is long (over 200 characters) and from customer
                  const isLongMessage = message.content.length > 200 && message.senderType === 'customer';

                  // Generate AI summary for Emma Thompson's long message
                  const getAISummary = (content: string, customerName: string) => {
                    if (customerName === 'Emma Thompson' && content.length > 200) {
                      return {
                        issues: "Multiple order problems: late delivery, wrong items, defective product, damaged packaging",
                        suggestedAction: "Immediate refund/replacement + expedited shipping + quality control follow-up"
                      };
                    }
                    return null;
                  };

                  const aiSummary = getAISummary(message.content, selectedConversation?.customerName || '');

                  return (
                    <div key={message.id}>
                      <div
                        className={`flex ${message.senderType === 'agent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md rounded-2xl shadow-sm overflow-hidden ${
                            message.senderType === 'agent'
                              ? 'bg-blue-600 text-white shadow-blue-200'
                              : aiSummary
                              ? 'bg-white border border-gray-200 shadow-gray-100'
                              : 'bg-white border border-gray-200 text-gray-900 shadow-gray-100'
                          }`}
                        >
                          <div className="px-5 py-3">
                            {message.senderType !== 'agent' && (
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs font-medium text-blue-600">
                                  {selectedConversation?.customerName || 'Customer'}
                                </p>
                                {/* Sentiment Icon for Customer Messages */}
                                <span className={getSentimentIcon(selectedConversation?.sentiment || 'neutral').color}>
                                  {getSentimentIcon(selectedConversation?.sentiment || 'neutral').icon}
                                </span>
                              </div>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${message.senderType === 'agent' ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>

                          {/* AI Buddy Summary at bottom of message card - only for customer messages */}
                          {aiSummary && message.senderType === 'customer' && (
                            <div className="bg-gray-50 border-t border-gray-200 px-5 py-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-gray-700">AI Buddy Summary</span>
                              </div>
                              <div className="text-xs text-gray-600 space-y-1.5">
                                <p><span className="font-medium">Issues:</span> {aiSummary.issues}</p>
                                <p><span className="font-medium">Suggested Action:</span> {aiSummary.suggestedAction}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <p>No messages yet</p>
                  <p className="text-sm mt-2">Start the conversation with {selectedConversation?.customerName}</p>
                </div>
              )}
            </div>

            {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4 md:p-5 lg:p-6">
              {/* AI Suggestions - Above Input Field */}
              {selectedConversation?.aiSuggestions && selectedConversation.aiSuggestions.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-700">AI Suggestions</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedConversation.aiSuggestions.slice(0, 2).map((suggestion, idx) => (
                      <button
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start chatting</p>
            </div>
          </div>
        )}
          </div>

          {/* Customer Info Sidebar Section */}
          <div className="hidden xl:block w-80 h-full min-h-0 border-l border-gray-200" style={{borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem'}}>
          <CustomerInfoSidebar
            customerPersona={customerPersona}
            orderHistory={orderHistory}
            isVisible={!!selectedConversation}
          />
          </div>
        </div>
      </div>
    </div>
    </FullscreenWrapper>
  );
}

export default function ChatsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <ChatsPageContent />
    </Suspense>
  );
}