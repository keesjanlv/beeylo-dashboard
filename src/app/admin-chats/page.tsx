'use client';

import { useState } from 'react';
import FullscreenWrapper from '../../components/layout/FullscreenWrapper';
import {
  MagnifyingGlassIcon,
  UserIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface TeamChat {
  id: string;
  customerName: string;
  subject: string;
  lastMessage: string;
  lastMessageTime: string;
  assignedTo: string;
  assignedToAvatar: string;
  status: 'active' | 'resolved' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const sampleTeamChats: TeamChat[] = [
  {
    id: '1',
    customerName: 'Emma Thompson',
    subject: 'Wrong item received in order',
    lastMessage: 'I received the wrong size. Can you help?',
    lastMessageTime: '2025-10-10T14:30:00Z',
    assignedTo: 'Sarah Johnson',
    assignedToAvatar: 'SJ',
    status: 'active',
    priority: 'urgent'
  },
  {
    id: '2',
    customerName: 'Michael Chen',
    subject: 'Product inquiry - Running shoes',
    lastMessage: 'Do you have size 11 in blue?',
    lastMessageTime: '2025-10-10T13:45:00Z',
    assignedTo: 'John Doe',
    assignedToAvatar: 'JD',
    status: 'active',
    priority: 'medium'
  },
  {
    id: '3',
    customerName: 'Lisa Anderson',
    subject: 'Shipping delay question',
    lastMessage: 'My order has been delayed by 3 days',
    lastMessageTime: '2025-10-10T12:20:00Z',
    assignedTo: 'Mike Wilson',
    assignedToAvatar: 'MW',
    status: 'active',
    priority: 'high'
  },
  {
    id: '4',
    customerName: 'Robert Davis',
    subject: 'Return request',
    lastMessage: 'I would like to return this item',
    lastMessageTime: '2025-10-10T11:15:00Z',
    assignedTo: 'Sarah Johnson',
    assignedToAvatar: 'SJ',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '5',
    customerName: 'Jennifer Martinez',
    subject: 'Bulk order discount inquiry',
    lastMessage: 'Can I get a discount for 50+ items?',
    lastMessageTime: '2025-10-10T10:30:00Z',
    assignedTo: 'John Doe',
    assignedToAvatar: 'JD',
    status: 'active',
    priority: 'high'
  },
  {
    id: '6',
    customerName: 'David Brown',
    subject: 'Product defect report',
    lastMessage: 'The zipper is broken on arrival',
    lastMessageTime: '2025-10-10T09:45:00Z',
    assignedTo: 'Mike Wilson',
    assignedToAvatar: 'MW',
    status: 'active',
    priority: 'urgent'
  },
  {
    id: '7',
    customerName: 'Ashley Taylor',
    subject: 'Order tracking issue',
    lastMessage: 'Tracking number not working',
    lastMessageTime: '2025-10-09T16:20:00Z',
    assignedTo: 'Sarah Johnson',
    assignedToAvatar: 'SJ',
    status: 'resolved',
    priority: 'low'
  },
  {
    id: '8',
    customerName: 'Christopher Wilson',
    subject: 'Size exchange request',
    lastMessage: 'Need to exchange for a larger size',
    lastMessageTime: '2025-10-09T15:10:00Z',
    assignedTo: 'John Doe',
    assignedToAvatar: 'JD',
    status: 'pending',
    priority: 'medium'
  }
];

export default function AdminChatsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return minutes <= 0 ? 'Just now' : `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueAgents = Array.from(new Set(sampleTeamChats.map(chat => chat.assignedTo)));
  const uniqueStatuses = Array.from(new Set(sampleTeamChats.map(chat => chat.status)));

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleAgent = (agent: string) => {
    setSelectedAgents(prev =>
      prev.includes(agent) ? prev.filter(a => a !== agent) : [...prev, agent]
    );
  };

  const filteredChats = sampleTeamChats.filter(chat => {
    const matchesSearch =
      chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(chat.status);
    const matchesAgent = selectedAgents.length === 0 || selectedAgents.includes(chat.assignedTo);

    return matchesSearch && matchesStatus && matchesAgent;
  });

  return (
    <FullscreenWrapper>
      <div className="flex flex-col bg-gray-50 !p-0 !m-0 !max-w-none h-full w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Chat Overview</h1>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats, customers, or agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter Buttons */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStatuses.includes(status)
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Agent Filter Buttons */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Agents</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueAgents.map((agent) => (
                <button
                  key={agent}
                  onClick={() => toggleAgent(agent)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedAgents.includes(agent)
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {agent}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Customer Avatar */}
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-700">
                        {chat.customerName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{chat.customerName}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(chat.priority)}`}>
                          {chat.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(chat.status)}`}>
                          {chat.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">{chat.subject}</p>
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>

                      {/* Assigned Agent */}
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">{chat.assignedToAvatar}</span>
                        </div>
                        <span className="text-xs text-gray-600">
                          Assigned to <span className="font-medium text-gray-900">{chat.assignedTo}</span>
                        </span>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                      <ClockIcon className="h-4 w-4" />
                      {formatTime(chat.lastMessageTime)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredChats.length === 0 && (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No chats found</p>
            </div>
          )}
        </div>
      </div>
    </FullscreenWrapper>
  );
}
