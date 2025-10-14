'use client';

import { useState, useEffect } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  TruckIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface CustomerPersona {
  id: string;
  name: string;
  beeyloId: string;
  phone: string;
  location: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyTier: string;
  preferredCategories: string[];
  lastActivity: string;
}

interface OrderItem {
  id: string;
  date: string;
  status: string;
  total: number;
  items: string[];
  isRelevant: boolean;
  aiNote: string | null;
}

interface CustomerNote {
  id: string;
  date: string;
  type: 'complaint' | 'preference' | 'resolution' | 'general';
  title: string;
  content: string;
  agent: string;
}

interface CustomerInfoSidebarProps {
  customerPersona: CustomerPersona | null;
  orderHistory: OrderItem[];
  isVisible: boolean;
}

type TabType = 'buddy' | 'stats' | 'current-order' | 'order-history' | 'notes';

const CustomerInfoSidebar: React.FC<CustomerInfoSidebarProps> = ({
  customerPersona,
  orderHistory,
  isVisible
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('buddy');
  const [buddyMessage, setBuddyMessage] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<Array<{ id: number; name: string; firstName: string; online: boolean }>>([
    { id: 1, name: 'Sarah M.', firstName: 'Sarah', online: true },
    { id: 2, name: 'Mike R.', firstName: 'Mike', online: true },
    { id: 3, name: 'You', firstName: 'You', online: true }
  ]);
  const [teamMessages, setTeamMessages] = useState<Array<{ id: number; sender: string; content: string; timestamp: string }>>([
    { id: 1, sender: 'Sarah M.', content: 'Looping @Mike R. on this ticket.', timestamp: '2:20 PM' },
    { id: 2, sender: 'You', content: 'Customer prefers email follow-up.', timestamp: '2:22 PM' }
  ]);
  const [newTeamMessage, setNewTeamMessage] = useState<string>('');
  const [showAddMember, setShowAddMember] = useState<boolean>(false);
  const [newMemberName, setNewMemberName] = useState<string>('');

  // Helper functions for team management
  const addTeamMember = () => {
    if (!newMemberName.trim()) return;
    const firstName = newMemberName.trim().split(' ')[0];
    const newMember = {
      id: Math.max(...teamMembers.map(m => m.id)) + 1,
      name: newMemberName.trim(),
      firstName,
      online: true
    };
    setTeamMembers([...teamMembers, newMember]);
    setNewMemberName('');
    setShowAddMember(false);
  };

  const removeMember = (memberId: number) => {
    setTeamMembers(teamMembers.filter(m => m.id !== memberId));
  };

  const sendTeamMessage = () => {
    if (!newTeamMessage.trim()) return;
    const nextId = (teamMessages[teamMessages.length - 1]?.id || 0) + 1;
    setTeamMessages([...teamMessages, { 
      id: nextId, 
      sender: 'You', 
      content: newTeamMessage.trim(), 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setNewTeamMessage('');
  };

  // Find the current/relevant order and set it as expanded by default
  const currentOrder = orderHistory.find(order => order.isRelevant);
  const otherOrders = orderHistory.filter(order => !order.isRelevant);
  
  // Sample customer notes data (in a real app, this would come from props or API)
  const customerNotes: CustomerNote[] = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'complaint',
      title: 'Delivery Issue',
      content: 'Customer complained about late delivery. Resolved by offering 10% discount on next order.',
      agent: 'Sarah M.'
    },
    {
      id: '2',
      date: '2024-01-10',
      type: 'preference',
      title: 'Contact Preference',
      content: 'Customer prefers email communication over phone calls. Available weekdays 9-5 EST.',
      agent: 'Mike R.'
    },
    {
      id: '3',
      date: '2024-01-05',
      type: 'resolution',
      title: 'Product Return',
      content: 'Successfully processed return for damaged item. Customer satisfied with quick resolution.',
      agent: 'Lisa K.'
    }
  ];
  
  // Set the current order as expanded by default
  useEffect(() => {
    if (currentOrder && !expandedOrder) {
      setExpandedOrder(currentOrder.id);
    }
  }, [currentOrder, expandedOrder]);

  if (!isVisible || !customerPersona) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'returned':
        return 'text-red-600 bg-red-50';
      case 'cancelled':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-3 w-3" />;
      case 'shipped':
        return <TruckIcon className="h-3 w-3" />;
      case 'processing':
        return <ClockIcon className="h-3 w-3" />;
      case 'returned':
        return <ArrowPathIcon className="h-3 w-3" />;
      case 'cancelled':
        return <XCircleIcon className="h-3 w-3" />;
      default:
        return <ExclamationTriangleIcon className="h-3 w-3" />;
    }
  };

  const handleQuickAction = (action: string, orderId: string) => {
    // In a real app, this would trigger the appropriate action
    console.log(`${action} action for order ${orderId}`);
    // You could show a toast notification or modal here
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const tabs = [
    { id: 'buddy', label: 'Buddy', icon: null, emoji: '🐝' },
    { id: 'current-order', label: 'Current Order', icon: ShoppingBagIcon },
    { id: 'stats', label: 'Stats', icon: ChartBarIcon },
    { id: 'order-history', label: 'History', icon: ClipboardDocumentListIcon },
    { id: 'notes', label: 'Notes', icon: ChatBubbleLeftRightIcon }
  ];

  const getNoteTypeColor = (type: CustomerNote['type']) => {
    switch (type) {
      case 'complaint':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'preference':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'resolution':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Customer Info Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600">
              {customerPersona.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{customerPersona.name}</h2>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              customerPersona.loyaltyTier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
              customerPersona.loyaltyTier === 'Silver' ? 'bg-gray-100 text-gray-800' :
              'bg-bronze-100 text-bronze-800'
            }`}>
              <StarIcon className="h-3 w-3 mr-1" />
              {customerPersona.loyaltyTier}
            </span>
          </div>
        </div>

        {/* Contact Info - Condensed */}
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <UserIcon className="h-3 w-3" />
            <span className="truncate text-blue-600 font-medium">{customerPersona.beeyloId}</span>
          </div>
          <div className="flex items-center space-x-2">
            <PhoneIcon className="h-3 w-3" />
            <span>{customerPersona.phone}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 flex flex-col items-center py-3 px-2 text-xs font-medium transition-all duration-200 focus:outline-none ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.emoji ? (
                  <span className="text-base mb-1">{tab.emoji}</span>
                ) : (
                  Icon && <Icon className="h-4 w-4 mb-1" />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content + Team Chat Panel */}
      <div className="flex-1 min-h-0 relative">
        {/* Scrollable Tab Content reserved above the team chat panel */}
        <div className="absolute inset-x-0 top-0 bottom-[180px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {activeTab === 'buddy' && (
          <div className="p-4 h-full flex flex-col">
            {/* Buddy AI Welcome */}
            <div className="mb-4 text-center">
              <h3 className="text-sm font-semibold text-gray-900">Buddy AI Assistant</h3>
              <p className="text-xs text-gray-500 mt-1">Ask me anything about this order</p>
            </div>

            {/* Suggestion Bubbles */}
            <div className="space-y-2 mb-4">
              <button
                onClick={() => setBuddyMessage('Find product information on Running Shoes')}
                className="w-full text-left px-4 py-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl hover:from-yellow-100 hover:to-orange-100 transition-all shadow-sm"
              >
                <p className="text-xs font-medium text-yellow-900">Find product information on Running Shoes</p>
              </button>
              <button
                onClick={() => setBuddyMessage('What is the customer\'s order history?')}
                className="w-full text-left px-4 py-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl hover:from-yellow-100 hover:to-orange-100 transition-all shadow-sm"
              >
                <p className="text-xs font-medium text-yellow-900">What is the customer's order history?</p>
              </button>
              <button
                onClick={() => setBuddyMessage('Suggest a response to this customer')}
                className="w-full text-left px-4 py-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl hover:from-yellow-100 hover:to-orange-100 transition-all shadow-sm"
              >
                <p className="text-xs font-medium text-yellow-900">Suggest a response to this customer</p>
              </button>
            </div>

            {/* Chat Area (Empty for now) */}
            <div className="flex-1 mb-3 border border-gray-200 rounded-xl bg-gray-50 p-4 flex items-center justify-center">
              <p className="text-xs text-gray-400">No messages yet. Start by asking a question!</p>
            </div>

            {/* Input Field */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={buddyMessage}
                onChange={(e) => setBuddyMessage(e.target.value)}
                placeholder="Ask Buddy anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    // Will be functional later
                    console.log('Buddy message:', buddyMessage);
                  }
                }}
              />
              <button
                onClick={() => {
                  // Will be functional later
                  console.log('Buddy message:', buddyMessage);
                }}
                disabled={!buddyMessage.trim()}
                className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 p-3 rounded-xl shadow-sm">
                <div className="text-xl font-bold text-gray-900">{customerPersona.totalOrders}</div>
                <div className="text-xs text-gray-500">Total Orders</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl shadow-sm">
                <div className="text-xl font-bold text-gray-900">${customerPersona.totalSpent.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Total Spent</div>
              </div>
            </div>
            
            {/* Additional Stats */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Location</span>
                <span className="text-gray-900">{customerPersona.location}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Member Since</span>
                <span className="text-gray-900">{new Date(customerPersona.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Activity</span>
                <span className="text-gray-900">{customerPersona.lastActivity}</span>
              </div>
            </div>
            
            {/* Preferred Categories */}
            <div>
              <div className="text-xs text-gray-500 mb-2">Preferred Categories</div>
              <div className="flex flex-wrap gap-2">
                {customerPersona.preferredCategories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 shadow-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'current-order' && (
          <div className="p-4">
            {currentOrder ? (
              <div className="border border-gray-200 rounded-xl shadow-sm">
                {/* Order Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200"
                  onClick={() => toggleOrderExpansion(currentOrder.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{currentOrder.id}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 shadow-sm">
                        Current
                      </span>
                    </div>
                    {expandedOrder === currentOrder.id ? (
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(currentOrder.status)}`}>
                        {getStatusIcon(currentOrder.status)}
                        <span className="ml-1 capitalize">{currentOrder.status}</span>
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">${currentOrder.total}</div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(currentOrder.date).toLocaleDateString()} • {currentOrder.items.length} item{currentOrder.items.length > 1 ? 's' : ''}
                  </div>
                  
                  {currentOrder.aiNote && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-xl text-xs text-blue-700 shadow-sm">
                      <strong>AI Note:</strong> {currentOrder.aiNote}
                    </div>
                  )}
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === currentOrder.id && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    {/* Order Items */}
                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-gray-700 mb-2">Items Ordered</h4>
                      <div className="space-y-1">
                        {currentOrder.items.map((item, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            • {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-700">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleQuickAction('track', currentOrder.id)}
                          className="flex items-center justify-center px-2 py-2 text-xs bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm"
                        >
                          <TruckIcon className="h-3 w-3 mr-1" />
                          Track
                        </button>
                        <button
                          onClick={() => handleQuickAction('return', currentOrder.id)}
                          className="flex items-center justify-center px-2 py-2 text-xs bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm"
                        >
                          <ArrowPathIcon className="h-3 w-3 mr-1" />
                          Return
                        </button>
                        <button
                          onClick={() => handleQuickAction('refund', currentOrder.id)}
                          className="flex items-center justify-center px-2 py-2 text-xs bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm"
                        >
                          <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                          Refund
                        </button>
                        <button
                          onClick={() => handleQuickAction('discount', currentOrder.id)}
                          className="flex items-center justify-center px-2 py-2 text-xs bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm"
                        >
                          <ReceiptPercentIcon className="h-3 w-3 mr-1" />
                          Discount
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBagIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No current order</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'order-history' && (
          <div className="p-4">
            <div className="space-y-3">
              {otherOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-xl shadow-sm">
                  {/* Order Header */}
                  <div
                    className="p-3 cursor-pointer hover:bg-gray-50 transition-all duration-200"
                    onClick={() => toggleOrderExpansion(order.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{order.id}</span>
                      </div>
                      {expandedOrder === order.id ? (
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">${order.total}</div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(order.date).toLocaleDateString()} • {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </div>
                    
                    {order.aiNote && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-xl text-xs text-blue-700 shadow-sm">
                        <strong>AI Note:</strong> {order.aiNote}
                      </div>
                    )}
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-200 p-3 bg-gray-50">
                      {/* Order Items */}
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">Items Ordered</h4>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-xs text-gray-600">
                              • {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-700">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleQuickAction('track', order.id)}
                            className="flex items-center justify-center px-2 py-2 text-xs bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm"
                          >
                            <TruckIcon className="h-3 w-3 mr-1" />
                            Track
                          </button>
                          <button
                            onClick={() => handleQuickAction('return', order.id)}
                            className="flex items-center justify-center px-2 py-2 text-xs bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm"
                          >
                            <ArrowPathIcon className="h-3 w-3 mr-1" />
                            Return
                          </button>
                          <button
                            onClick={() => handleQuickAction('refund', order.id)}
                            className="flex items-center justify-center px-2 py-2 text-xs bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm"
                          >
                            <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                            Refund
                          </button>
                          <button
                            onClick={() => handleQuickAction('discount', order.id)}
                            className="flex items-center justify-center px-2 py-2 text-xs bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm"
                          >
                            <ReceiptPercentIcon className="h-3 w-3 mr-1" />
                            Discount
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {otherOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardDocumentListIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No order history</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="p-4">
            <div className="space-y-3">
              {customerNotes.map((note) => (
                <div key={note.id} className="border border-gray-200 rounded-xl shadow-sm p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getNoteTypeColor(note.type)}`}>
                        {note.type}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(note.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{note.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{note.content}</p>
                  <div className="text-xs text-gray-500">
                    <span>Agent: {note.agent}</span>
                  </div>
                </div>
              ))}
              
              {customerNotes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No customer notes</p>
                </div>
              )}
            </div>
          </div>
        )}
        </div>

        {/* Inter-team Messages Panel (always visible, bottom-right) */}
        <div className="absolute inset-x-0 bottom-0 h-[180px] border-t border-gray-200 bg-white">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="h-4 w-4 text-gray-600" />
                <span className="text-xs font-semibold text-gray-800">Team Discussion</span>
              </div>
              <div className="flex items-center space-x-1">
                {/* Team Members */}
                <div className="flex items-center space-x-1 text-[10px] text-gray-500">
                  {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center group">
                      <span className={`px-1.5 py-0.5 rounded flex items-center space-x-1 ${
                        member.online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <span>{member.firstName}</span>
                        {member.name !== 'You' && (
                          <button
                            onClick={() => removeMember(member.id)}
                            className="opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity"
                          >
                            <XMarkIcon className="h-2.5 w-2.5" />
                          </button>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Add Member Button */}
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors"
                  title="Add team member"
                >
                  <PlusIcon className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Add Member Input */}
            {showAddMember && (
              <div className="px-3 py-1 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <input
                    value={newMemberName}
                    onChange={e => setNewMemberName(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addTeamMember()}
                    className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter team member name..."
                    autoFocus
                  />
                  <button
                    onClick={addTeamMember}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {setShowAddMember(false); setNewMemberName('');}}
                    className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 space-y-1">
              {teamMessages.map(msg => (
                <div key={msg.id} className="text-[11px]">
                  <span className="font-medium text-gray-700">{msg.sender}:</span>{' '}
                  <span className="text-gray-600">{msg.content}</span>
                  <span className="ml-2 text-gray-400">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 py-2 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <input
                  value={newTeamMessage}
                  onChange={e => setNewTeamMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendTeamMessage()}
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Type @name to mention team members..."
                />
                <button
                  onClick={sendTeamMessage}
                  className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
                  aria-label="Send team message"
                  disabled={!newTeamMessage.trim()}
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoSidebar;